import type { NextRequest } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/server/config/prisma';
import { authenticate } from '@/server/middleware/auth';
import { errorResponse, jsonPaged, jsonSuccess } from '@/server/middleware/errorHandler';
import { logRoute } from '@/server/middleware/requestLogger';
import { generateTrackingNumber, parsePagination, paginationMeta } from '@/server/utils/helpers';
import { sendShipmentDocuments } from '@/server/services/email.service';
import { logger } from '@/server/utils/logger';
import type { TemplateShipment } from '@/server/services/email.templates';

// ─── Shipments List ─────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const userId = await authenticate(request);

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePagination({
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
    });
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    const where: Prisma.ShipmentWhereInput = { isDeleted: false };
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { trackingNumber: { contains: search, mode: 'insensitive' } },
        { sender: { path: ['name'], string_contains: search } },
        { recipient: { path: ['name'], string_contains: search } },
        { sender: { path: ['city'], string_contains: search } },
        { recipient: { path: ['city'], string_contains: search } },
      ];
    }

    const [shipments, total] = await Promise.all([
      prisma.shipment.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit, include: { events: { orderBy: { createdAt: 'asc' } } } }),
      prisma.shipment.count({ where }),
    ]);

    logRoute(request, 200, { userId, query: { page, limit, status, search } });
    return jsonPaged({ shipments }, paginationMeta(total, page, limit));
  } catch (err) {
    return errorResponse(err);
  }
}

// ─── Create Shipment ─────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const userId = await authenticate(request);

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    delete body.trackingNumber;
    // Date inputs arrive as '' when left blank in the admin form — Prisma's
    // DateTime columns reject that outright, unlike Mongoose's looser casting.
    if (!body.eta) delete body.eta;
    else body.eta = new Date(body.eta as string);
    if (!body.deliveredAt) delete body.deliveredAt;
    else body.deliveredAt = new Date(body.deliveredAt as string);

    const shipment = await prisma.shipment.create({
      data: {
        ...(body as Prisma.ShipmentUncheckedCreateInput),
        trackingNumber: generateTrackingNumber(),
      },
      include: { events: { orderBy: { createdAt: 'asc' } } },
    });

    // Send all shipping documents to recipient (non-blocking)
    const recipient = shipment.recipient as { email?: string } | null;
    if (recipient?.email) {
      sendShipmentDocuments(shipment as unknown as TemplateShipment).catch((err) =>
        logger.warn(`Shipment documents email failed: ${err.message}`)
      );
    }

    logRoute(request, 201, { userId, body });
    return jsonSuccess({ shipment }, 201);
  } catch (err) {
    return errorResponse(err);
  }
}
