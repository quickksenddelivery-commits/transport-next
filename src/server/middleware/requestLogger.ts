import { logger } from '../utils/logger';

const SENSITIVE_KEYS = new Set([
  'password',
  'currentpassword',
  'newpassword',
  'token',
  'secret',
  'authorization',
  'x-admin-secret',
]);

export const maskSensitive = (obj: unknown): unknown => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;

  const masked: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    masked[key] = SENSITIVE_KEYS.has(key.toLowerCase()) ? '***' : value;
  }
  return masked;
};

export interface LogContext {
  userId?: string;
  role?: string;
  body?: unknown;
  query?: unknown;
}

/**
 * Best-effort request logger for Route Handlers. Route handlers call this once
 * they have produced a response; the middleware-level res.on('finish') hook the
 * Express version used does not exist in the App Router.
 */
export const logRoute = (
  request: Request,
  status: number,
  { userId, role, body, query }: LogContext = {}
): void => {
  const url = new URL(request.url);
  const entries: Record<string, unknown> = {
    method: request.method,
    path: url.pathname,
    status,
    ip: request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? undefined,
    userAgent: request.headers.get('user-agent') ?? undefined,
  };
  if (userId) entries.userId = userId;
  if (role) entries.role = role;
  if (body) entries.body = maskSensitive(body);
  if (query) entries.query = query;

  if (status >= 500) logger.error('route', entries);
  else if (status >= 400) logger.warn('route', entries);
  else logger.http('route', entries);
};
