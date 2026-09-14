import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { env } from './env';

// Next.js hot-reloads route modules in dev and runs each request on a
// (possibly short-lived) serverless instance in production. Reusing a single
// cached client across requests avoids exhausting the connection pool.
const globalForPrisma = globalThis as unknown as { __prisma?: PrismaClient };

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not configured');

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

export const prisma = globalForPrisma.__prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__prisma = prisma;
}
