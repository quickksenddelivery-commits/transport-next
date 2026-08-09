import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { User } from '../models/User';
import { env } from '../config/env';
import { AppError } from './errorHandler';

export const getBearerToken = (request: Request): string | null => {
  const header = request.headers.get('authorization');
  if (!header || !header.startsWith('Bearer ')) return null;
  return header.slice(7).trim();
};

export const authenticate = async (request: NextRequest | Request): Promise<string> => {
  const token = getBearerToken(request);
  if (!token) throw new AppError('Authentication required', 401);

  let payload: { id?: string };
  try {
    payload = jwt.verify(token, env.JWT_SECRET) as { id?: string };
  } catch {
    throw new AppError('Invalid or expired token', 401);
  }

  if (!payload.id) throw new AppError('Invalid or expired token', 401);

  const user = await User.findById(payload.id);
  if (!user) throw new AppError('User no longer exists', 401);
  if (!user.isActive) throw new AppError('Account deactivated', 403);

  return String(user._id);
};
