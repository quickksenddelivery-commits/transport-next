import type { NextRequest } from 'next/server';
import { connectDB } from '@/server/config/database';
import { User } from '@/server/models/User';
import { authenticate } from '@/server/middleware/auth';
import { errorResponse, jsonSuccess } from '@/server/middleware/errorHandler';
import { logRoute } from '@/server/middleware/requestLogger';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const userId = await authenticate(request);
    const user = await User.findById(userId);
    logRoute(request, 200, { userId, role: user?.role });
    return jsonSuccess({ user });
  } catch (err) {
    return errorResponse(err);
  }
}
