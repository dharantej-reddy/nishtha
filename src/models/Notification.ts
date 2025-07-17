import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'live_event' | 'booking_confirmation' | 'donation_received' | 'new_follower' | 'community_post' | 'marketplace_offer' | 'system' | 'reminder';
  title: string;
  message: string;
  data?: any;
  priority: 'low' | 'normal' | 'high';
  status: 'pending' | 'sent' | 'failed' | 'read';
  channels: ('push' | 'email' | 'sms')[];
  isRead: boolean;
  readAt?: Date;
  scheduledFor?: Date;
  sentAt?: Date;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  type: {
    type: String,
    enum: ['live_event', 'booking_confirmation', 'donation_received', 'new_follower', 'community_post', 'marketplace_offer', 'system', 'reminder'],
    required: true,
    index: true
  },
  
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  
  data: {
    type: Schema.Types.Mixed,
    default: {}
  },
  
  priority: {
    type: String,
    enum: ['low', 'normal', 'high'],
    default: 'normal'
  },
  
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed', 'read'],
    default: 'pending',
    index: true
  },
  
  channels: [{
    type: String,
    enum: ['push', 'email', 'sms']
  }],
  
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  
  readAt: Date,
  
  scheduledFor: {
    type: Date,
    index: true
  },
  
  sentAt: Date,
  
  error: String
}, {
  timestamps: true
});

// Indexes for better query performance
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, isRead: 1 });
NotificationSchema.index({ type: 1, createdAt: -1 });
NotificationSchema.index({ status: 1, scheduledFor: 1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);