import mongoose, { Types } from 'mongoose';

export const STATUSES = [
  'pending',
  'confirmed',
  'picked_up',
  'in_transit',
  'out_for_delivery',
  'delivered',
  'failed',
  'cancelled',
  'returned',
] as const;

export const SERVICES = ['standard', 'express', 'overnight', 'same_day'] as const;
export const EVENT_TYPES = ['pickup', 'transit', 'delivery', 'exception', 'info'] as const;

export interface ShipParty {
  name: string;
  phone?: string;
  email?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface ShipEvent {
  _id?: Types.ObjectId;
  time?: string;
  date?: string;
  location?: string;
  lat?: number;
  lng?: number;
  desc: string;
  type?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ShipmentDoc extends mongoose.Document {
  trackingNumber?: string;
  status?: string;
  service?: string;
  sender: ShipParty;
  recipient: ShipParty;
  weight: number;
  dimensions?: { length?: number; width?: number; height?: number };
  contents?: string;
  declaredValue?: number;
  price?: number;
  eta?: Date;
  deliveredAt?: Date;
  events: ShipEvent[];
  notes?: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const partySchema = new mongoose.Schema<ShipParty>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    street: String,
    city: { type: String, trim: true },
    state: String,
    country: { type: String, trim: true },
    postalCode: String,
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema<ShipEvent>(
  {
    time: { type: String },
    date: { type: String },
    location: { type: String },
    lat: { type: Number, min: -90, max: 90 },
    lng: { type: Number, min: -180, max: 180 },
    desc: { type: String, required: true },
    type: { type: String, enum: EVENT_TYPES, default: 'info' },
  },
  { timestamps: true, _id: true }
);

const shipmentSchema = new mongoose.Schema<ShipmentDoc>(
  {
    trackingNumber: { type: String, unique: true, index: true },
    status: { type: String, enum: STATUSES, default: 'pending', index: true },
    service: { type: String, enum: SERVICES, default: 'standard' },
    sender: { type: partySchema, required: true },
    recipient: { type: partySchema, required: true },
    weight: { type: Number, required: true, min: 0.01 },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    contents: { type: String, trim: true },
    declaredValue: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    eta: { type: Date },
    deliveredAt: { type: Date },
    events: [eventSchema],
    notes: { type: String },
    isDeleted: { type: Boolean, default: false, select: false },
  },
  { timestamps: true }
);

shipmentSchema.index({ status: 1, createdAt: -1 });
shipmentSchema.index({ 'sender.name': 'text', 'recipient.name': 'text', trackingNumber: 'text' });

export const Shipment =
  (mongoose.models.Shipment as mongoose.Model<ShipmentDoc>) ||
  mongoose.model<ShipmentDoc>('Shipment', shipmentSchema);
