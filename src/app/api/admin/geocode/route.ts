import type { NextRequest } from 'next/server';
import { connectDB } from '@/server/config/database';
import { authenticate } from '@/server/middleware/auth';
import { AppError, errorResponse, jsonSuccess } from '@/server/middleware/errorHandler';
import { logRoute } from '@/server/middleware/requestLogger';
import { logger } from '@/server/utils/logger';

// Proxies OpenStreetMap's Nominatim so the admin never has to know or look up
// a lat/lng themselves — this must run server-side because Nominatim does not
// send CORS headers, so a direct browser fetch is blocked outright.
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const userId = await authenticate(request);

    const q = (new URL(request.url).searchParams.get('q') || '').trim();
    if (!q) throw new AppError('Query parameter "q" is required', 400);

    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Accessiblexpress-Admin/1.0 (logistics tracking dashboard)' },
      cache: 'no-store',
    });

    if (!response.ok) {
      logger.warn('Geocode lookup failed', { q, status: response.status });
      logRoute(request, 200, { userId });
      return jsonSuccess({ result: null });
    }

    const results = (await response.json()) as Array<{ lat: string; lon: string }>;
    const match = results?.[0];
    const result = match ? { lat: parseFloat(match.lat), lng: parseFloat(match.lon) } : null;

    logRoute(request, 200, { userId });
    return jsonSuccess({ result });
  } catch (err) {
    return errorResponse(err);
  }
}
