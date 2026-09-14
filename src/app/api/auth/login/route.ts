import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/server/config/prisma';
import { env } from '@/server/config/env';
import { AppError, errorResponse, jsonSuccess } from '@/server/middleware/errorHandler';
import { assertValid, customRule, required } from '@/server/middleware/validate';
import { authLimiter, getClientIp } from '@/server/middleware/rateLimit';
import { logRoute } from '@/server/middleware/requestLogger';
import { logger } from '@/server/utils/logger';
import { comparePassword, isLocked, loginAttemptPatch, sanitizeUser } from '@/server/models/user.helpers';

const signToken = (id: string) =>
  jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  try {
    await authLimiter(request);

    const body = await request.json().catch(() => ({}));
    assertValid(body, [
      required('password', 'Password is required'),
      customRule('identifier', 'Email or username is required', (b) => {
        const o = (b ?? {}) as Record<string, unknown>;
        return !!(o.email || o.username);
      }),
    ]);

    const { email, username, password } = body as Record<string, string>;
    const identifier = email || username;

    // Optional extra security layer — enforced only when ADMIN_SECRET is set in .env
    if (env.ADMIN_SECRET) {
      const providedSecret = request.headers.get('x-admin-secret');
      if (!providedSecret || providedSecret !== env.ADMIN_SECRET) {
        logger.warn(`Admin login blocked — missing/invalid x-admin-secret — IP: ${ip}`);
        throw new AppError('Invalid credentials', 401);
      }
    }

    const query = identifier.includes('@') ? { email: identifier } : { username: identifier };
    const user = await prisma.user.findUnique({ where: query });

    if (!user) {
      logger.warn(`Login failed: user not found — identifier: ${identifier} — IP: ${ip}`);
      throw new AppError('Invalid credentials', 401);
    }

    if (isLocked(user)) {
      throw new AppError('Account temporarily locked. Try again later', 423);
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      await prisma.user.update({ where: { id: user.id }, data: loginAttemptPatch(user) });
      logger.warn(`Login failed: wrong password — identifier: ${identifier} — IP: ${ip}`);
      throw new AppError('Invalid credentials', 401);
    }

    if (!user.isActive) throw new AppError('Account deactivated. Contact support', 403);

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { loginAttempts: 0, lockUntil: null, lastLogin: new Date() },
    });

    const token = signToken(updated.id);

    logger.info(`Admin login — identifier: ${identifier} — IP: ${ip}`);
    logRoute(request, 200, { body: { email: identifier }, userId: updated.id });
    return jsonSuccess({ token, user: sanitizeUser(updated) });
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode ?? 500;
    logRoute(request, status, { body: { identifier: (request as unknown as { body?: { identifier?: string } }).body?.identifier } });
    return errorResponse(err);
  }
}
