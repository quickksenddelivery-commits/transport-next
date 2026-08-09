import type { NextRequest } from 'next/server';
import { connectDB } from '@/server/config/database';
import { authenticate } from '@/server/middleware/auth';
import { errorResponse, jsonMessage } from '@/server/middleware/errorHandler';
import { logRoute } from '@/server/middleware/requestLogger';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const userId = await authenticate(request);
    logRoute(request, 200, { userId });
    return jsonMessage('Logged out successfully');
  } catch (err) {
    return errorResponse(err);
  }
}
