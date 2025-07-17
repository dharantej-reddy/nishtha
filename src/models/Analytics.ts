import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalytics extends Document {
  eventType: string;
  userId?: mongoose.Types.ObjectId;
  sessionId?: string;
  entityType?: string;
  entityId?: mongoose.Types.ObjectId;
  properties: any;
  location?: {
    country?: string;
    state?: string;
    city?: string;
    coordinates?: [number, number];
  };
  device?: {
    platform?: string;
    version?: string;
    model?: string;
    userAgent?: string;
  };
  timestamp: Date;
  createdAt: Date;
}

const AnalyticsSchema = new Schema<IAnalytics>({
  eventType: {
    type: String,
    required: true,
    index: true
  },
  
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  
  sessionId: {
    type: String,
    index: true
  },
  
  entityType: {
    type: String,
    index: true
  },
  
  entityId: {
    type: Schema.Types.ObjectId,
    index: true
  },
  
  properties: {
    type: Schema.Types.Mixed,
    default: {}
  },
  
  location: {
    country: String,
    state: String,
    city: String,
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  },
  
  device: {
    platform: String,
    version: String,
    model: String,
    userAgent: String
  },
  
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Compound indexes for better query performance
AnalyticsSchema.index({ eventType: 1, timestamp: -1 });
AnalyticsSchema.index({ userId: 1, timestamp: -1 });
AnalyticsSchema.index({ entityType: 1, entityId: 1, timestamp: -1 });
AnalyticsSchema.index({ timestamp: -1 });

export const Analytics = mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);