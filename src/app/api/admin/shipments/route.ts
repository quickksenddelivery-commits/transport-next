import type { NextRequest } from 'next/server';
import { connectDB } from '@/server/config/database';
import { Shipment } from '@/server/models/Shipment';
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
    await connectDB();
    const userId = await authenticate(request);

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePagination({
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
    });
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    const filter: Record<string, unknown> = { isDeleted: false };
    if (status) filter.status = status;
    if (search) {
      const re = { $regex: search, $options: 'i' };
      filter.$or = [
        { trackingNumber: re },
        { 'sender.name': re },
        { 'recipient.name': re },
        { 'sender.city': re },
        { 'recipient.city': re },
      ];
    }

    const [shipments, total] = await Promise.all([
      Shipment.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Shipment.countDocuments(filter),
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
    await connectDB();
    const userId = await authenticate(request);

    const body = await request.json().catch(() => ({}));
    const shipment = await Shipment.create({
      trackingNumber: generateTrackingNumber(),
      ...(body as object),
    });

    // Send all shipping documents to recipient (non-blocking)
    if (shipment.recipient?.email) {
      sendShipmentDocuments(shipment.toObject() as unknown as TemplateShipment).catch((err) =>
        logger.warn(`Shipment documents email failed: ${err.message}`)
      );
    }

    logRoute(request, 201, { userId, body });
    return jsonSuccess({ shipment }, 201);
  } catch (err) {
    return errorResponse(err);
  }
}
