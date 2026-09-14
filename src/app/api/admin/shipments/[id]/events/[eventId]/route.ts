import type { NextRequest } from 'next/server';
import { prisma } from '@/server/config/prisma';
import { authenticate } from '@/server/middleware/auth';
import { AppError, errorResponse, jsonSuccess } from '@/server/middleware/errorHandler';
import { logRoute } from '@/server/middleware/requestLogger';

// ─── Edit Tracking Event ─────────────────────────────────────────────────────
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; eventId: string }> }
) {
  try {
    const userId = await authenticate(request);
    const { id, eventId } = await params;

    const { time, date, location, lat, lng, desc, type } = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;

    const existingEvent = await prisma.shipmentEvent.findFirst({
      where: { id: eventId, shipmentId: id, shipment: { isDeleted: false } },
    });
    if (!existingEvent) throw new AppError('Shipment or event not found', 404);

    const update: Record<string, unknown> = {};
    if (desc !== undefined) update.desc = desc;
    if (location !== undefined) update.location = location;
    if (lat !== undefined) update.lat = lat;
    if (lng !== undefined) update.lng = lng;
    if (date !== undefined) update.date = date;
    if (time !== undefined) update.time = time;
    if (type !== undefined) update.type = type;

    const updated = await prisma.shipmentEvent.update({ where: { id: eventId }, data: update });
    const shipment = await prisma.shipment.findUnique({ where: { id }, include: { events: { orderBy: { createdAt: 'asc' } } } });

    logRoute(request, 200, { userId });
    return jsonSuccess({ event: { ...updated, _id: updated.id }, shipment });
  } catch (err) {
    return errorResponse(err);
  }
}

// ─── Delete Tracking Event ────────────────────────────────────────────────────
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; eventId: string }> }
) {
  try {
    const userId = await authenticate(request);
    const { id, eventId } = await params;

    const existing = await prisma.shipment.findFirst({ where: { id, isDeleted: false } });
    if (!existing) throw new AppError('Shipment not found', 404);

    await prisma.shipmentEvent.deleteMany({ where: { id: eventId, shipmentId: id } });
    const shipment = await prisma.shipment.findUnique({ where: { id }, include: { events: { orderBy: { createdAt: 'asc' } } } });

    logRoute(request, 200, { userId });
    return jsonSuccess({ shipment });
  } catch (err) {
    return errorResponse(err);
  }
}
