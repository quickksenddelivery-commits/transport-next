import type { NextRequest } from 'next/server';
import { prisma } from '@/server/config/prisma';
import { authenticate } from '@/server/middleware/auth';
import { errorResponse, jsonSuccess } from '@/server/middleware/errorHandler';
import { logRoute } from '@/server/middleware/requestLogger';

export async function GET(request: NextRequest) {
  try {
    const userId = await authenticate(request);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [totalShipments, deliveredToday, inTransit, onTimeCandidates, recentActivity] =
      await Promise.all([
        prisma.shipment.count({ where: { isDeleted: false } }),
        prisma.shipment.count({
          where: { status: 'delivered', deliveredAt: { gte: todayStart }, isDeleted: false },
        }),
        prisma.shipment.count({
          where: { status: { in: ['picked_up', 'in_transit', 'out_for_delivery'] }, isDeleted: false },
        }),
        prisma.shipment.findMany({
          where: { status: 'delivered', eta: { not: null }, isDeleted: false },
          select: { eta: true, deliveredAt: true },
        }),
        prisma.shipment.findMany({
          where: { isDeleted: false },
          orderBy: { updatedAt: 'desc' },
          take: 10,
          select: { trackingNumber: true, status: true, sender: true, recipient: true, updatedAt: true, service: true },
        }),
      ]);

    const onTimeTotal = onTimeCandidates.length;
    const onTimeMet = onTimeCandidates.filter(
      (s) => s.deliveredAt && s.eta && s.deliveredAt.getTime() <= s.eta.getTime()
    ).length;
    const onTimeRate = onTimeTotal > 0 ? Math.round((onTimeMet / onTimeTotal) * 100) : 100;

    logRoute(request, 200, { userId });
    return jsonSuccess({ totalShipments, deliveredToday, inTransit, onTimeRate, recentActivity });
  } catch (err) {
    return errorResponse(err);
  }
}
