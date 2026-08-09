import type { NextRequest } from 'next/server';
import { connectDB } from '@/server/config/database';
import { Shipment } from '@/server/models/Shipment';
import { authenticate } from '@/server/middleware/auth';
import { errorResponse, jsonSuccess } from '@/server/middleware/errorHandler';
import { logRoute } from '@/server/middleware/requestLogger';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const userId = await authenticate(request);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [totalShipments, deliveredToday, inTransit, onTimeTotal, onTimeMet, recentActivity] =
      await Promise.all([
        Shipment.countDocuments({ isDeleted: false }),
        Shipment.countDocuments({ status: 'delivered', deliveredAt: { $gte: todayStart }, isDeleted: false }),
        Shipment.countDocuments({ status: { $in: ['picked_up', 'in_transit', 'out_for_delivery'] }, isDeleted: false }),
        Shipment.countDocuments({ status: 'delivered', eta: { $exists: true }, isDeleted: false }),
        Shipment.countDocuments({ status: 'delivered', $expr: { $lte: ['$deliveredAt', '$eta'] }, isDeleted: false }),
        Shipment.find({ isDeleted: false })
          .sort({ updatedAt: -1 })
          .limit(10)
          .select('trackingNumber status sender.name recipient.name updatedAt service')
          .lean(),
      ]);

    const onTimeRate = onTimeTotal > 0 ? Math.round((onTimeMet / onTimeTotal) * 100) : 100;

    logRoute(request, 200, { userId });
    return jsonSuccess({ totalShipments, deliveredToday, inTransit, onTimeRate, recentActivity });
  } catch (err) {
    return errorResponse(err);
  }
}
