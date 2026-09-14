import type { NextRequest } from 'next/server';
import { prisma } from '@/server/config/prisma';
import { AppError, errorResponse, jsonMessage } from '@/server/middleware/errorHandler';
import { assertValid, isEmail } from '@/server/middleware/validate';
import { logRoute } from '@/server/middleware/requestLogger';
import { logger } from '@/server/utils/logger';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    assertValid(body, [isEmail('email', 'Valid email is required')]);

    const email = String(body.email || '').trim();

    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (!existing) throw new AppError('Email not found in our subscriber list', 404);

    await prisma.subscriber.update({ where: { email }, data: { isActive: false } });

    logger.info(`Unsubscribed: ${email}`);
    logRoute(request, 200, { body: { email } });
    return jsonMessage('You have been unsubscribed.');
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode ?? 500;
    logRoute(request, status);
    return errorResponse(err);
  }
}
