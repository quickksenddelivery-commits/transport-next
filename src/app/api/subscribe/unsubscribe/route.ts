import type { NextRequest } from 'next/server';
import { connectDB } from '@/server/config/database';
import { Subscriber } from '@/server/models/Subscriber';
import { AppError, errorResponse, jsonMessage } from '@/server/middleware/errorHandler';
import { assertValid, isEmail } from '@/server/middleware/validate';
import { logRoute } from '@/server/middleware/requestLogger';
import { logger } from '@/server/utils/logger';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    assertValid(body, [isEmail('email', 'Valid email is required')]);

    const email = String(body.email || '').trim();

    const subscriber = await Subscriber.findOneAndUpdate(
      { email },
      { isActive: false },
      { returnDocument: 'after' }
    );

    if (!subscriber) throw new AppError('Email not found in our subscriber list', 404);

    logger.info(`Unsubscribed: ${email}`);
    logRoute(request, 200, { body: { email } });
    return jsonMessage('You have been unsubscribed.');
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode ?? 500;
    logRoute(request, status);
    return errorResponse(err);
  }
}
