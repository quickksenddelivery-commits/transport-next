import { NextResponse } from 'next/server';
import { logger } from '../utils/logger';

export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  code: string | null;

  constructor(message: string, statusCode = 500, code: string | null = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 500 ? 'error' : 'fail';
    this.isOperational = true;
    this.code = code;
  }
}

type UnknownRecord = Record<string, unknown> & {
  name?: string;
  code?: number;
  keyValue?: Record<string, unknown>;
  path?: string;
  value?: unknown;
  message?: string;
  errors?: Record<string, { message?: string }>;
  stack?: string;
};

const normalizeError = (err: unknown): { error: AppError; logged: boolean } => {
  if (err instanceof AppError) return { error: err, logged: false };

  const e = err as UnknownRecord;

  if (e?.name === 'CastError') {
    return { error: new AppError(`Invalid ${e.path}: ${e.value}`, 400), logged: false };
  }

  if (e?.code === 11000) {
    const keyValue = e.keyValue || {};
    const field = Object.keys(keyValue)[0];
    return {
      error: new AppError(`${field} '${String(keyValue[field])}' already exists`, 409, 'DUPLICATE_FIELD'),
      logged: false,
    };
  }

  if (e?.name === 'ValidationError') {
    const errors = Object.values(e.errors || {})
      .map((x) => x?.message)
      .filter(Boolean);
    return { error: new AppError(`Validation failed: ${errors.join('. ')}`, 422), logged: false };
  }

  if (e?.name === 'JsonWebTokenError') {
    return { error: new AppError('Invalid token. Please log in again', 401), logged: false };
  }

  if (e?.name === 'TokenExpiredError') {
    return { error: new AppError('Token expired. Please log in again', 401), logged: false };
  }

  return { error: new AppError(e?.message || 'Something went wrong', 500), logged: true };
};

export const errorResponse = (err: unknown): NextResponse => {
  const { error, logged } = normalizeError(err);

  if (logged) logger.error('UNEXPECTED ERROR', { message: error.message, stack: error.stack });

  // Mask unexpected internal errors in production (mirrors the Express errorHandler)
  if (logged && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ status: 'error', message: 'Something went wrong' }, { status: 500 });
  }

  const body: Record<string, unknown> = { status: error.status, message: error.message };
  if (error.code) body.code = error.code;
  if (process.env.NODE_ENV === 'development' && error.stack) body.stack = error.stack;

  return NextResponse.json(body, { status: error.statusCode });
};

export const jsonSuccess = (data: unknown, status = 200): NextResponse =>
  NextResponse.json({ status: 'success', data }, { status });

export const jsonMessage = (
  message: string,
  status = 200,
  extra?: Record<string, unknown>
): NextResponse => NextResponse.json({ status: 'success', message, ...extra }, { status });

export const jsonPaged = (data: unknown, pagination: unknown, status = 200): NextResponse =>
  NextResponse.json({ status: 'success', data, pagination }, { status });

export const jsonValidationError = (errors: { field: string; message: string }[]): NextResponse =>
  NextResponse.json(
    { status: 'fail', message: 'Validation failed', errors },
    { status: 422 }
  );
