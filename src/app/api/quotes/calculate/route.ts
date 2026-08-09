import type { NextRequest } from 'next/server';
import { AppError, errorResponse, jsonSuccess } from '@/server/middleware/errorHandler';

const SERVICE_OPTIONS = [
  { key: 'standard', label: 'Standard Delivery', days: '5–7 business days', multiplier: 1.0 },
  { key: 'express', label: 'Express Delivery', days: '2–3 business days', multiplier: 1.6 },
  { key: 'overnight', label: 'Overnight Delivery', days: 'Next business day', multiplier: 2.2 },
  { key: 'same_day', label: 'Same Day Delivery', days: 'Same day', multiplier: 3.0 },
];

const BASE_RATE = 8.0;
const WEIGHT_RATE = 1.2; // per kg
const VOL_DIVISOR = 5000; // cm³ → kg (standard volumetric divisor)

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const { from, to, weight, length, width, height, service } = body;

    if (!from || !to) throw new AppError('Origin and destination are required', 400);
    const w = Number(weight);
    if (!w || w <= 0) throw new AppError('Weight must be greater than 0', 400);

    const volumetricWeight =
      length && width && height ? (Number(length) * Number(width) * Number(height)) / VOL_DIVISOR : 0;

    const chargeableWeight = Math.max(w, volumetricWeight);
    const basePrice = Math.round((BASE_RATE + chargeableWeight * WEIGHT_RATE) * 100) / 100;

    const options = SERVICE_OPTIONS.map(({ key, label, days, multiplier }) => ({
      key,
      label,
      days,
      price: Math.round(basePrice * multiplier * 100) / 100,
    }));

    const selected = service ? options.find((o) => o.key === service) : null;

    return jsonSuccess({
      basePrice,
      chargeableWeight,
      from,
      to,
      options,
      ...(selected && { selected }),
    });
  } catch (err) {
    return errorResponse(err);
  }
}
