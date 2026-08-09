import type { NextRequest } from 'next/server';
import { connectDB } from '@/server/config/database';
import { Shipment } from '@/server/models/Shipment';
import { AppError, errorResponse, jsonSuccess } from '@/server/middleware/errorHandler';

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
    await connectDB();
    const { trackingId } = await params;

    const shipment = await Shipment.findOne({
      trackingNumber: trackingId.toUpperCase(),
    })
      .select('-isDeleted -notes -declaredValue')
      .lean();

    if (!shipment) throw new AppError('Tracking number not found', 404);

    // Mask personal details for public response
    const masked = {
      trackingNumber: shipment.trackingNumber,
      status: shipment.status,
      service: shipment.service,
      eta: shipment.eta,
      deliveredAt: shipment.deliveredAt,
      createdAt: shipment.createdAt,
      sender: {
        name: maskName(shipment.sender?.name),
        city: shipment.sender?.city,
        country: shipment.sender?.country,
      },
      recipient: {
        name: maskName(shipment.recipient?.name),
        city: shipment.recipient?.city,
        country: shipment.recipient?.country,
        email: maskEmail(shipment.recipient?.email),
      },
      weight: shipment.weight,
      events: [...(shipment.events || [])].sort(
        (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
      ),
    };

    return jsonSuccess({ shipment: masked });
  } catch (err) {
    return errorResponse(err);
  }
}
