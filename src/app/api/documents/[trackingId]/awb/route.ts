import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { connectDB } from '@/server/config/database';
import { Shipment } from '@/server/models/Shipment';
import { AppError, errorResponse } from '@/server/middleware/errorHandler';
import { generateAWB } from '@/server/services/document.service';
import type { TemplateShipment } from '@/server/services/email.templates';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ trackingId: string }> }
) {
  try {
    await connectDB();
    const { trackingId } = await params;

    const shipment = await Shipment.findOne({
      trackingNumber: trackingId.toUpperCase(),
      isDeleted: false,
    }).lean();

    if (!shipment) throw new AppError('Tracking number not found', 404);

    const { buffer, filename } = await generateAWB(shipment as unknown as TemplateShipment);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    return errorResponse(err);
  }
}
