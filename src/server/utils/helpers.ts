import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export const generateTrackingNumber = () => {
  const prefix = 'QSD';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

export const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
};

export const hashOTP = (otp: string) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

export const generateReference = () => {
  return `PAY-${uuidv4().replace(/-/g, '').slice(0, 16).toUpperCase()}`;
};

export const paginationMeta = (total: number, page: number, limit: number) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

export const parsePagination = (query: Record<string, string | undefined>) => {
  const page = Math.max(1, parseInt(query.page || '1', 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

export const calcShippingCost = ({
  weight,
  distance,
  priority = 'standard',
  dimensions = {},
}: {
  weight: number;
  distance: number;
  priority?: string;
  dimensions?: { length?: number; width?: number; height?: number };
}) => {
  const BASE_RATE = 5.0;
  const WEIGHT_RATE = 0.5;
  const DISTANCE_RATE = 0.1;
  const PRIORITY_MULTIPLIER: Record<string, number> = {
    standard: 1.0,
    express: 1.5,
    overnight: 2.0,
    same_day: 2.5,
  };

  const volumetricWeight =
    dimensions.length && dimensions.width && dimensions.height
      ? (dimensions.length * dimensions.width * dimensions.height) / 5000
      : 0;

  const chargeableWeight = Math.max(weight, volumetricWeight);
  const cost =
    (BASE_RATE + chargeableWeight * WEIGHT_RATE + distance * DISTANCE_RATE) *
    (PRIORITY_MULTIPLIER[priority] || 1.0);

  return Math.round(cost * 100) / 100;
};

export const sanitizePhone = (phone: string) => {
  return phone.replace(/\D/g, '');
};

export const maskEmail = (email: string) => {
  const [user, domain] = email.split('@');
  return `${user.slice(0, 2)}***@${domain}`;
};

export const normalizeTrackingId = (trackingId: string) =>
  trackingId
    .trim()
    .replace(/[\u2010-\u2015]/g, '-')
    .replace(/\s+/g, '')
    .toUpperCase();
