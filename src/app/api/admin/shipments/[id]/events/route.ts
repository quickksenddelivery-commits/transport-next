import type { NextRequest } from 'next/server';
import { connectDB } from '@/server/config/database';
import { Shipment } from '@/server/models/Shipment';
import { authenticate } from '@/server/middleware/auth';
import { AppError, errorResponse, jsonSuccess } from '@/server/middleware/errorHandler';
import { logRoute } from '@/server/middleware/requestLogger';
import { sendDelayAlert, sendInTransitAlert } from '@/server/services/email.service';
import { logger } from '@/server/utils/logger';
import type { TemplateShipment } from '@/server/services/email.templates';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const userId = await authenticate(request);
    const { id } = await params;

    const { time, date, location, lat, lng, desc, type } = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    if (!desc) throw new AppError('Event description is required', 400);

    const shipment = await Shipment.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $push: { events: { time, date, location, lat, lng, desc, type } } },
      { returnDocument: 'after' }
    );

    if (!shipment) throw new AppError('Shipment not found', 404);
    const newEvent = shipment.events[shipment.events.length - 1];

    let notified = false;
    let notifyError: string | undefined;
    try {
      const to = shipment.toObject() as unknown as TemplateShipment;
      // Delay alert — send when an exception event is added
      if (type === 'exception' && shipment.recipient?.email) {
        await sendDelayAlert(to, newEvent);
        notified = true;
      }
      // In-transit update — send when a transit event is added
      if (type === 'transit' && shipment.recipient?.email) {
        await sendInTransitAlert(to, String(location || ''));
        notified = true;
      }
    } catch (err) {
      logger.warn(`Event alert email failed [${String(type)}]: ${(err as Error).message}`);
      notifyError = (err as Error).message;
    }

    logRoute(request, 201, { userId });
    return jsonSuccess({ event: newEvent, shipment, notified, notifyError }, 201);
  } catch (err) {
    return errorResponse(err);
  }
}
