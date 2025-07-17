import mongoose, { Document, Schema } from 'mongoose';

export interface IPlaceOfWorship extends Document {
  name: string;
  type: 'temple' | 'church' | 'mosque' | 'synagogue' | 'gurudwara' | 'monastery' | 'other';
  description: string;
  images: string[];
  rating: number;
  followers: number;
  coordinates: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  timings: {
    [day: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  amenities: string[];
  isVerified: boolean;
  managedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PlaceOfWorshipSchema = new Schema<IPlaceOfWorship>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  
  type: {
    type: String,
    enum: ['temple', 'church', 'mosque', 'synagogue', 'gurudwara', 'monastery', 'other'],
    required: true,
    index: true
  },
  
  description: {
    type: String,
    maxlength: 2000
  },
  
  images: [{
    type: String
  }],
  
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  
  followers: {
    type: Number,
    default: 0,
    min: 0
  },
  
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  
  address: {
    street: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: String
  },
  
  contact: {
    phone: String,
    email: String,
    website: String
  },
  
  timings: {
    type: Schema.Types.Mixed,
    default: {}
  },
  
  amenities: [{
    type: String
  }],
  
  isVerified: {
    type: Boolean,
    default: false,
    index: true
  },
  
  managedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
PlaceOfWorshipSchema.index({ coordinates: '2dsphere' });
PlaceOfWorshipSchema.index({ type: 1, isVerified: 1 });
PlaceOfWorshipSchema.index({ rating: -1 });
PlaceOfWorshipSchema.index({ followers: -1 });
PlaceOfWorshipSchema.index({ name: 'text', description: 'text' });

export const PlaceOfWorship = mongoose.model<IPlaceOfWorship>('PlaceOfWorship', PlaceOfWorshipSchema);