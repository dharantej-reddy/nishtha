import mongoose, { Document, Schema } from 'mongoose';

export interface ILiveEvent extends Document {
  title: string;
  type: 'prayer' | 'ceremony' | 'discourse' | 'festival' | 'other';
  thumbnailUrl: string;
  streamUrl?: string;
  placeOfWorshipId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  isLive: boolean;
  viewerCount: number;
  language: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LiveEventSchema = new Schema<ILiveEvent>({
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['prayer', 'ceremony', 'discourse', 'festival', 'other'],
    required: true 
  },
  thumbnailUrl: { type: String, required: true },
  streamUrl: String,
  placeOfWorshipId: { 
    type: Schema.Types.ObjectId, 
    ref: 'PlaceOfWorship', 
    required: true 
  },
  startTime: { type: Date, required: true },
  endTime: Date,
  isLive: { type: Boolean, default: false },
  viewerCount: { type: Number, default: 0 },
  language: { type: String, required: true },
  description: String
}, {
  timestamps: true
});

export const LiveEvent = mongoose.model<ILiveEvent>('LiveEvent', LiveEventSchema);