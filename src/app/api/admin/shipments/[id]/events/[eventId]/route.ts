import type { NextRequest } from 'next/server';
import { connectDB } from '@/server/config/database';
import { Shipment } from '@/server/models/Shipment';
import { authenticate } from '@/server/middleware/auth';
import { AppError, errorResponse, jsonSuccess } from '@/server/middleware/errorHandler';
import { logRoute } from '@/server/middleware/requestLogger';

// ─── Edit Tracking Event ─────────────────────────────────────────────────────
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; eventId: string }> }
) {
  try {
    await connectDB();
    const userId = await authenticate(request);
    const { id, eventId } = await params;

    const { time, date, location, lat, lng, desc, type } = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;

    const update: Record<string, unknown> = {};
    if (desc !== undefined) update['events.$.desc'] = desc;
    if (location !== undefined) update['events.$.location'] = location;
    if (lat !== undefined) update['events.$.lat'] = lat;
    if (lng !== undefined) update['events.$.lng'] = lng;
    if (date !== undefined) update['events.$.date'] = date;
    if (time !== undefined) update['events.$.time'] = time;
    if (type !== undefined) update['events.$.type'] = type;

    const shipment = await Shipment.findOneAndUpdate(
      { _id: id, isDeleted: false, 'events._id': eventId },
      { $set: update },
      { returnDocument: 'after' }
    );

    if (!shipment) throw new AppError('Shipment or event not found', 404);
    const updated = shipment.events.find((e) => String(e._id) === eventId);

    logRoute(request, 200, { userId });
    return jsonSuccess({ event: updated, shipment });
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
    await connectDB();
    const userId = await authenticate(request);
    const { id, eventId } = await params;

    const shipment = await Shipment.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $pull: { events: { _id: eventId } } },
      { returnDocument: 'after' }
    );

    if (!shipment) throw new AppError('Shipment not found', 404);

    logRoute(request, 200, { userId });
    return jsonSuccess({ shipment });
  } catch (err) {
    return errorResponse(err);
  }
}
