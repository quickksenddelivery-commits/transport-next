import { AppError } from './errorHandler';

type Bucket = { count: number; resetAt: number };

// Simple in-memory sliding-window limiter. Reset on server restart, which is
// acceptable for a small admin/shipping app. For serverless multi-instance
// deployments this should be replaced with a shared store (Redis, etc.).
const store = new Map<string, Bucket>();
const MAX_ENTRIES = 10_000;

export const getClientIp = (request: Request): string => {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const real = request.headers.get('x-real-ip');
  if (real) return real;
  return 'unknown';
};

export interface RateLimitOptions {
  windowMs: number;
  max: number;
  message: string;
}

export const createRateLimiter = ({ windowMs, max, message }: RateLimitOptions) => {
  return async (request: Request): Promise<void> => {
    const ip = getClientIp(request);
    const pathname = new URL(request.url).pathname;
    const key = `${ip}:${pathname}`;
    const now = Date.now();

    let bucket = store.get(key);
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + windowMs };
      store.set(key, bucket);
    }

    bucket.count += 1;

    if (bucket.count > max) {
      if (store.size > MAX_ENTRIES) {
        for (const [k, b] of store) {
          if (b.resetAt <= now) store.delete(k);
        }
      }
      throw new AppError(message, 429, 'RATE_LIMITED');
    }
  };
};

export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts. Please try again in 15 minutes.',
});

export const adminLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many admin login attempts. Please try again in 15 minutes.',
});

export const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: 'Too many requests. Please try again later.',
});

export const otpLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 3,
  message: 'Too many OTP requests. Please try again in 1 minute.',
});

export const contactLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Too many messages sent. Please try again later.',
});

export const subscribeLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: 'Too many subscription requests. Please try again later.',
});
