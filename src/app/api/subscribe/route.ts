import type { NextRequest } from 'next/server';
import { prisma } from '@/server/config/prisma';
import { authenticate } from '@/server/middleware/auth';
import { errorResponse, jsonSuccess, jsonMessage } from '@/server/middleware/errorHandler';
import { assertValid, isEmail } from '@/server/middleware/validate';
import { subscribeLimiter } from '@/server/middleware/rateLimit';
import { logRoute } from '@/server/middleware/requestLogger';
import { sendNewsletterWelcome } from '@/server/services/email.service';
import { logger } from '@/server/utils/logger';

// Public — subscribe to the newsletter
export async function POST(request: NextRequest) {
  try {
    await subscribeLimiter(request);

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    assertValid(body, [isEmail('email', 'Valid email is required')]);

    const email = String(body.email || '').trim();
    const existing = await prisma.subscriber.findUnique({ where: { email } });

    if (existing) {
      if (existing.isActive) {
        logRoute(request, 200, { body: { email } });
        return jsonMessage('You are already subscribed.');
      }
      // Re-subscribe if they had previously unsubscribed
      await prisma.subscriber.update({ where: { email }, data: { isActive: true } });
    } else {
      await prisma.subscriber.create({ data: { email } });
    }

    // Send welcome email (non-blocking)
    sendNewsletterWelcome(email).catch((err) =>
      logger.warn(`Newsletter welcome email failed: ${err.message}`)
    );

    logger.info(`New subscriber: ${email}`);
    logRoute(request, 201, { body: { email } });
    return jsonMessage('Successfully subscribed. Check your inbox!', 201);
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode ?? 500;
    logRoute(request, status);
    return errorResponse(err);
  }
}

// Admin — list all subscribers
export async function GET(request: NextRequest) {
  try {
    const userId = await authenticate(request);

    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    const where: Record<string, unknown> = {};
    if (active !== null) where.isActive = active === 'true';

    const subscribers = await prisma.subscriber.findMany({ where, orderBy: { createdAt: 'desc' } });
    logRoute(request, 200, { userId });
    return jsonSuccess({ total: subscribers.length, subscribers });
  } catch (err) {
    return errorResponse(err);
  }
}
