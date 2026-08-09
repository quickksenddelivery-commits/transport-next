import { createLogger, format, transports } from 'winston';
import type { transport } from 'winston';
import path from 'path';
import fs from 'fs';

const { combine, timestamp, errors, json, colorize, printf } = format;

const devFormat = printf(
  ({ level, message, timestamp: ts, stack, service, ...meta }: Record<string, unknown>) => {
    const base = `${ts} [${level}]: ${stack || message}`;
    const hasMeta = Object.keys(meta).length > 0;
    return hasMeta ? `${base}\n${JSON.stringify(meta, null, 2)}` : base;
  }
);

const baseTransports: transport[] = [];

// File transports are only safe when we can write to disk (self-hosted).
// They are skipped entirely on read-only/serverless filesystems.
try {
  const logsDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

  baseTransports.push(
    new transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
    }),
    new transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
    })
  );
} catch {
  // Logging to disk unavailable — continue with console only
}

export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), json()),
  defaultMeta: { service: 'accessiblexpress' },
  transports: baseTransports,
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: combine(colorize(), timestamp({ format: 'HH:mm:ss' }), errors({ stack: true }), devFormat),
    })
  );
}
