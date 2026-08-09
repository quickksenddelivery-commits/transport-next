import mongoose from 'mongoose';

export interface SubscriberDoc extends mongoose.Document {
  email: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const subscriberSchema = new mongoose.Schema<SubscriberDoc>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Subscriber =
  (mongoose.models.Subscriber as mongoose.Model<SubscriberDoc>) ||
  mongoose.model<SubscriberDoc>('Subscriber', subscriberSchema);
