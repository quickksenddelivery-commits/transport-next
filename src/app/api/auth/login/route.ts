import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/server/config/database';
import { env } from '@/server/config/env';
import { User } from '@/server/models/User';
import { AppError, errorResponse, jsonSuccess } from '@/server/middleware/errorHandler';
import { assertValid, customRule, required } from '@/server/middleware/validate';
import { authLimiter, getClientIp } from '@/server/middleware/rateLimit';
import { logRoute } from '@/server/middleware/requestLogger';
import { logger } from '@/server/utils/logger';

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
    const user = await User.findOne(query).select('+password +loginAttempts +lockUntil');

    if (!user) {
      logger.warn(`Login failed: user not found — identifier: ${identifier} — IP: ${ip}`);
      throw new AppError('Invalid credentials', 401);
    }

    if (user.isLocked) {
      throw new AppError('Account temporarily locked. Try again later', 423);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await user.incLoginAttempts();
      logger.warn(`Login failed: wrong password — identifier: ${identifier} — IP: ${ip}`);
      throw new AppError('Invalid credentials', 401);
    }

    if (!user.isActive) throw new AppError('Account deactivated. Contact support', 403);

    await user.updateOne({ loginAttempts: 0, $unset: { lockUntil: 1 }, lastLogin: new Date() });

    const token = signToken(String(user._id));

    const userObj = user.toObject() as unknown as Record<string, unknown>;
    delete userObj.password;
    delete userObj.loginAttempts;
    delete userObj.lockUntil;

    logger.info(`Admin login — identifier: ${identifier} — IP: ${ip}`);
    logRoute(request, 200, { body: { email: identifier }, userId: String(user._id) });
    return jsonSuccess({ token, user: userObj });
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode ?? 500;
    logRoute(request, status, { body: { identifier: (request as unknown as { body?: { identifier?: string } }).body?.identifier } });
    return errorResponse(err);
  }
}
