import type { NextRequest } from 'next/server';
import { prisma } from '@/server/config/prisma';
import { authenticate } from '@/server/middleware/auth';
import { errorResponse, jsonSuccess } from '@/server/middleware/errorHandler';
import { logRoute } from '@/server/middleware/requestLogger';
import { sanitizeUser } from '@/server/models/user.helpers';

export async function GET(request: NextRequest) {
  try {
    const userId = await authenticate(request);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    logRoute(request, 200, { userId, role: user?.role });
    return jsonSuccess({ user: user ? sanitizeUser(user) : null });
  } catch (err) {
    return errorResponse(err);
  }
}
