import type { NextRequest } from 'next/server';
import { prisma } from '@/server/config/prisma';
import { AppError, errorResponse, jsonSuccess } from '@/server/middleware/errorHandler';
import { normalizeTrackingId } from '@/server/utils/helpers';

const maskName = (name = '') => {
  const parts = name.trim().split(' ');
  return parts.map((p) => (p.length > 1 ? `${p[0]}${'*'.repeat(p.length - 1)}` : p)).join(' ');
};

const maskEmail = (email = '') => {
  if (!email) return '';
  const [user, domain] = email.split('@');
  return `${user.slice(0, 2)}***@${domain}`;
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ trackingId: string }> }
) {
  try {
    const { trackingId } = await params;
    const normalizedTrackId = normalizeTrackingId(trackingId);
    const possibleTrackIds = [normalizedTrackId];

    if (normalizedTrackId.startsWith('AXP-')) {
      possibleTrackIds.push(normalizedTrackId.replace(/^AXP-/, 'QSD-'));
    } else if (normalizedTrackId.startsWith('QSD-')) {
      possibleTrackIds.push(normalizedTrackId.replace(/^QSD-/, 'AXP-'));
    }

    const shipment = await prisma.shipment.findFirst({
      where: { trackingNumber: { in: possibleTrackIds } },
      include: { events: { orderBy: { createdAt: 'asc' } } },
    });

    if (!shipment) throw new AppError('Tracking number not found', 404);

    const sender = shipment.sender as { name?: string; city?: string; country?: string } | null;
    const recipient = shipment.recipient as
      | { name?: string; city?: string; country?: string; email?: string }
      | null;

    // Mask personal details for public response
    const masked = {
      trackingNumber: shipment.trackingNumber,
      status: shipment.status,
      service: shipment.service,
      eta: shipment.eta,
      deliveredAt: shipment.deliveredAt,
      createdAt: shipment.createdAt,
      sender: {
        name: maskName(sender?.name),
        city: sender?.city,
        country: sender?.country,
      },
      recipient: {
        name: maskName(recipient?.name),
        city: recipient?.city,
        country: recipient?.country,
        email: maskEmail(recipient?.email),
      },
      weight: shipment.weight,
      events: [...shipment.events]
        .map((e) => ({ ...e, _id: e.id }))
        .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()),
    };

    return jsonSuccess({ shipment: masked });
  } catch (err) {
    return errorResponse(err);
  }
}
