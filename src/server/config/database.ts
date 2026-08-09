import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { env } from './env';

// Next.js hot-reloads route modules in dev and runs each request on a (possibly
// short-lived) serverless instance in production. Reusing a single cached
// connection across requests is critical to avoid exhausting the connection pool.
type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

const globalForMongoose = globalThis as unknown as { __mongooseCache?: Cache };

const cached: Cache = globalForMongoose.__mongooseCache ?? { conn: null, promise: null };
if (process.env.NODE_ENV !== 'production') {
  globalForMongoose.__mongooseCache = cached;
}

export const connectDB = async (): Promise<typeof mongoose> => {
  if (cached.conn) return cached.conn;

  if (!env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured');
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  }

  cached.conn = await cached.promise;

  mongoose.connection.on('error', (err) => {
    logger.error(`MongoDB connection error: ${err}`);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected — attempting reconnect');
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB reconnected');
  });

  return cached.conn;
};

export const disconnectDB = async () => {
  if (cached.conn) {
    await mongoose.connection.close();
    cached.conn = null;
    cached.promise = null;
    logger.info('MongoDB connection closed');
  }
};
