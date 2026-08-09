import type { NextRequest } from 'next/server';
import { connectDB } from '@/server/config/database';
import { Shipment } from '@/server/models/Shipment';
import { authenticate } from '@/server/middleware/auth';
import { AppError, errorResponse, jsonMessage, jsonSuccess } from '@/server/middleware/errorHandler';
import { logRoute } from '@/server/middleware/requestLogger';
import {
  sendPickedUpAlert,
  sendInTransitAlert,
  sendOutForDeliveryAlert,
  sendDeliveredAlert,
} from '@/server/services/email.service';
import { logger } from '@/server/utils/logger';
import type { TemplateShipment } from '@/server/services/email.templates';

const STATUS_EMAIL_MAP: Record<string, (s: TemplateShipment) => Promise<unknown>> = {
  picked_up: (s) => sendPickedUpAlert(s),
  in_transit: (s) => sendInTransitAlert(s),
  out_for_delivery: (s) => sendOutForDeliveryAlert(s),
  delivered: (s) => sendDeliveredAlert(s),
};

// ─── Single Shipment ─────────────────────────────────────────────────────────
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const userId = await authenticate(request);
    const { id } = await params;

    const shipment = await Shipment.findOne({ _id: id, isDeleted: false }).lean();
    if (!shipment) throw new AppError('Shipment not found', 404);

    logRoute(request, 200, { userId });
    return jsonSuccess({ shipment });
  } catch (err) {
    return errorResponse(err);
  }
}

// ─── Update Shipment ─────────────────────────────────────────────────────────
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const userId = await authenticate(request);
    const { id } = await params;

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const forbidden = ['trackingNumber', 'isDeleted', 'events'];
    forbidden.forEach((f) => delete body[f]);

    if (body.status === 'delivered' && !body.deliveredAt) {
      body.deliveredAt = new Date();
    }

    const shipment = await Shipment.findOneAndUpdate(
      { _id: id, isDeleted: false },
      body,
      { returnDocument: 'after', runValidators: true }
    );

    if (!shipment) throw new AppError('Shipment not found', 404);

    // Send the status alert email inline so the admin gets real confirmation
    let notified = false;
    let notifyError: string | undefined;
    const newStatus = body.status;
    if (
      newStatus &&
      STATUS_EMAIL_MAP[String(newStatus)] &&
      shipment.recipient?.email
    ) {
      try {
        await STATUS_EMAIL_MAP[String(newStatus)](shipment.toObject() as unknown as TemplateShipment);
        notified = true;
      } catch (err) {
        logger.warn(`Status alert email failed [${newStatus}]: ${(err as Error).message}`);
        notifyError = (err as Error).message;
      }
    }

    logRoute(request, 200, { userId, body });
    return jsonSuccess({ shipment, notified, notifyError });
  } catch (err) {
    return errorResponse(err);
  }
}

// ─── Delete Shipment (soft delete) ───────────────────────────────────────────
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const userId = await authenticate(request);
    const { id } = await params;

    const shipment = await Shipment.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { returnDocument: 'after' }
    );

    if (!shipment) throw new AppError('Shipment not found', 404);

    logRoute(request, 200, { userId });
    return jsonMessage('Shipment deleted');
  } catch (err) {
    return errorResponse(err);
  }
}
