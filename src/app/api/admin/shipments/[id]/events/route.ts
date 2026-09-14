import type { NextRequest } from 'next/server';
import { prisma } from '@/server/config/prisma';
import { authenticate } from '@/server/middleware/auth';
import { AppError, errorResponse, jsonSuccess } from '@/server/middleware/errorHandler';
import { logRoute } from '@/server/middleware/requestLogger';
import { sendDelayAlert, sendInTransitAlert } from '@/server/services/email.service';
import { logger } from '@/server/utils/logger';
import type { TemplateShipment } from '@/server/services/email.templates';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await authenticate(request);
    const { id } = await params;

    const { time, date, location, lat, lng, desc, type } = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    if (!desc) throw new AppError('Event description is required', 400);

    const existing = await prisma.shipment.findFirst({ where: { id, isDeleted: false } });
    if (!existing) throw new AppError('Shipment not found', 404);

    const newEvent = await prisma.shipmentEvent.create({
      data: {
        shipmentId: id,
        time: time as string | undefined,
        date: date as string | undefined,
        location: location as string | undefined,
        lat: lat as number | undefined,
        lng: lng as number | undefined,
        desc: String(desc),
        type: (type as string) || 'info',
      },
    });

    const shipment = await prisma.shipment.findUnique({ where: { id }, include: { events: { orderBy: { createdAt: 'asc' } } } });
    const recipient = shipment?.recipient as { email?: string } | null;

    let notified = false;
    let notifyError: string | undefined;
    try {
      const to = shipment as unknown as TemplateShipment;
      // Delay alert — send when an exception event is added
      if (type === 'exception' && recipient?.email) {
        await sendDelayAlert(to, {
          desc: newEvent.desc,
          location: newEvent.location ?? undefined,
          date: newEvent.date ?? undefined,
          time: newEvent.time ?? undefined,
        });
        notified = true;
      }
      // In-transit update — send when a transit event is added
      if (type === 'transit' && recipient?.email) {
        await sendInTransitAlert(to, String(location || ''));
        notified = true;
      }
    } catch (err) {
      logger.warn(`Event alert email failed [${String(type)}]: ${(err as Error).message}`);
      notifyError = (err as Error).message;
    }

    logRoute(request, 201, { userId });
    return jsonSuccess({ event: { ...newEvent, _id: newEvent.id }, shipment, notified, notifyError }, 201);
  } catch (err) {
    return errorResponse(err);
  }
}
