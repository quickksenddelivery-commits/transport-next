import type { NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/server/config/prisma';
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
    const userId = await authenticate(request);
    const { id } = await params;

    const shipment = await prisma.shipment.findFirst({ where: { id, isDeleted: false }, include: { events: true } });
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
    const userId = await authenticate(request);
    const { id } = await params;

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const forbidden = ['trackingNumber', 'isDeleted', 'events'];
    forbidden.forEach((f) => delete body[f]);

    if (body.status === 'delivered' && !body.deliveredAt) {
      body.deliveredAt = new Date();
    }
    // Date inputs arrive as '' when left blank in the admin form — Prisma's
    // DateTime columns reject that outright, unlike Mongoose's looser casting.
    if (typeof body.eta === 'string') body.eta = body.eta ? new Date(body.eta) : undefined;
    if (typeof body.deliveredAt === 'string') body.deliveredAt = body.deliveredAt ? new Date(body.deliveredAt) : undefined;

    const existing = await prisma.shipment.findFirst({ where: { id, isDeleted: false } });
    if (!existing) throw new AppError('Shipment not found', 404);

    const shipment = await prisma.shipment.update({
      where: { id },
      data: body as Prisma.ShipmentUncheckedUpdateInput,
      include: { events: true },
    });

    // Send the status alert email inline so the admin gets real confirmation
    let notified = false;
    let notifyError: string | undefined;
    const newStatus = body.status;
    const recipient = shipment.recipient as { email?: string } | null;
    if (
      newStatus &&
      STATUS_EMAIL_MAP[String(newStatus)] &&
      recipient?.email
    ) {
      try {
        await STATUS_EMAIL_MAP[String(newStatus)](shipment as unknown as TemplateShipment);
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
    const userId = await authenticate(request);
    const { id } = await params;

    const existing = await prisma.shipment.findFirst({ where: { id, isDeleted: false } });
    if (!existing) throw new AppError('Shipment not found', 404);

    await prisma.shipment.update({ where: { id }, data: { isDeleted: true } });

    logRoute(request, 200, { userId });
    return jsonMessage('Shipment deleted');
  } catch (err) {
    return errorResponse(err);
  }
}
