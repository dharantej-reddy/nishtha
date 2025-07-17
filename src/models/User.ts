import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

export interface IUser extends Document {
  // Basic Information
  email: string;
  username: string;
  password: string;
  fullName: string;
  profileImage?: string;
  coverImage?: string;
  bio?: string;
  
  // Personal Information
  age?: number;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  phoneNumber?: string;
  
  // Location Information
  location?: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates: {
      type: 'Point';
      coordinates: [number, number]; // [longitude, latitude]
    };
  };
  
  // Religious Preferences
  preferredReligions: string[];
  favoriteLanguages: string[];
  spiritualInterests: string[];
  
  // App Usage
  followers: number;
  following: number;
  followedPlaces: mongoose.Types.ObjectId[];
  favoriteEvents: mongoose.Types.ObjectId[];
  
  // Verification and Security
  verificationStatus: 'verified' | 'unverified' | 'pending';
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  
  // Subscription and Premium
  subscriptionType: 'free' | 'premium' | 'pro';
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  
  // Notification Preferences
  notificationSettings: {
    email: boolean;
    push: boolean;
    sms: boolean;
    liveEvents: boolean;
    bookingReminders: boolean;
    communityUpdates: boolean;
    marketplaceOffers: boolean;
    donationUpdates: boolean;
  };
  
  // Privacy Settings
  privacySettings: {
    profileVisibility: 'public' | 'friends' | 'private';
    showLocation: boolean;
    showAge: boolean;
    showEmail: boolean;
    allowDirectMessages: boolean;
  };
  
  // App Analytics
  lastActive: Date;
  loginCount: number;
  deviceTokens: string[]; // for push notifications
  
  // Account Status
  isActive: boolean;
  isBlocked: boolean;
  blockedReason?: string;
  blockedAt?: Date;
  
  // Referral System
  referralCode: string;
  referredBy?: mongoose.Types.ObjectId;
  referralCount: number;
  
  // Earnings and Rewards
  totalEarnings: number;
  rewardPoints: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
  generateRefreshToken(): string;
  toJSON(): any;
}

const UserSchema = new Schema<IUser>({
  // Basic Information
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't include password in queries by default
  },
  
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  
  profileImage: {
    type: String,
    default: null
  },
  
  coverImage: {
    type: String,
    default: null
  },
  
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    trim: true
  },
  
  // Personal Information
  age: {
    type: Number,
    min: [13, 'Must be at least 13 years old'],
    max: [120, 'Age cannot exceed 120 years']
  },
  
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(value: Date) {
        return value < new Date();
      },
      message: 'Date of birth cannot be in the future'
    }
  },
  
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer_not_to_say'],
    default: 'prefer_not_to_say'
  },
  
  phoneNumber: {
    type: String,
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number']
  },
  
  // Location Information
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    }
  },
  
  // Religious Preferences
  preferredReligions: [{
    type: String,
    enum: ['hinduism', 'christianity', 'islam', 'judaism', 'sikhism', 'buddhism', 'jainism', 'other']
  }],
  
  favoriteLanguages: [{
    type: String
  }],
  
  spiritualInterests: [{
    type: String
  }],
  
  // App Usage
  followers: {
    type: Number,
    default: 0,
    min: 0
  },
  
  following: {
    type: Number,
    default: 0,
    min: 0
  },
  
  followedPlaces: [{
    type: Schema.Types.ObjectId,
    ref: 'PlaceOfWorship'
  }],
  
  favoriteEvents: [{
    type: Schema.Types.ObjectId,
    ref: 'LiveEvent'
  }],
  
  // Verification and Security
  verificationStatus: {
    type: String,
    enum: ['verified', 'unverified', 'pending'],
    default: 'unverified'
  },
  
  emailVerified: {
    type: Boolean,
    default: false
  },
  
  phoneVerified: {
    type: Boolean,
    default: false
  },
  
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  
  twoFactorSecret: {
    type: String,
    select: false
  },
  
  // Subscription and Premium
  subscriptionType: {
    type: String,
    enum: ['free', 'premium', 'pro'],
    default: 'free'
  },
  
  subscriptionStartDate: Date,
  subscriptionEndDate: Date,
  
  // Notification Preferences
  notificationSettings: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    liveEvents: { type: Boolean, default: true },
    bookingReminders: { type: Boolean, default: true },
    communityUpdates: { type: Boolean, default: true },
    marketplaceOffers: { type: Boolean, default: false },
    donationUpdates: { type: Boolean, default: true }
  },
  
  // Privacy Settings
  privacySettings: {
    profileVisibility: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'public'
    },
    showLocation: { type: Boolean, default: false },
    showAge: { type: Boolean, default: false },
    showEmail: { type: Boolean, default: false },
    allowDirectMessages: { type: Boolean, default: true }
  },
  
  // App Analytics
  lastActive: {
    type: Date,
    default: Date.now
  },
  
  loginCount: {
    type: Number,
    default: 0
  },
  
  deviceTokens: [{
    type: String
  }],
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  isBlocked: {
    type: Boolean,
    default: false
  },
  
  blockedReason: String,
  blockedAt: Date,
  
  // Referral System
  referralCode: {
    type: String,
    unique: true,
    sparse: true
  },
  
  referredBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  
  referralCount: {
    type: Number,
    default: 0
  },
  
  // Earnings and Rewards
  totalEarnings: {
    type: Number,
    default: 0,
    min: 0
  },
  
  rewardPoints: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ 'location.coordinates': '2dsphere' });
UserSchema.index({ verificationStatus: 1 });
UserSchema.index({ subscriptionType: 1 });
UserSchema.index({ isActive: 1, isBlocked: 1 });
UserSchema.index({ createdAt: -1 });

// Virtual for full profile completion percentage
UserSchema.virtual('profileCompletion').get(function() {
  let completion = 0;
  const fields = [
    'fullName', 'profileImage', 'bio', 'age', 'location.city',
    'preferredReligions', 'favoriteLanguages'
  ];
  
  fields.forEach(field => {
    const value = field.includes('.') 
      ? field.split('.').reduce((obj, key) => obj?.[key], this)
      : this[field];
    
    if (value && (Array.isArray(value) ? value.length > 0 : true)) {
      completion += 1;
    }
  });
  
  return Math.round((completion / fields.length) * 100);
});

// Virtual for subscription status
UserSchema.virtual('isSubscriptionActive').get(function() {
  if (this.subscriptionType === 'free') return true;
  return this.subscriptionEndDate && this.subscriptionEndDate > new Date();
});

// Pre-save middleware to hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(config.bcryptRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to generate referral code
UserSchema.pre('save', function(next) {
  if (!this.referralCode && this.isNew) {
    this.referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT token
UserSchema.methods.generateAuthToken = function(): string {
  return jwt.sign(
    { 
      userId: this._id,
      email: this.email,
      username: this.username,
      verificationStatus: this.verificationStatus
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiration }
  );
};

// Method to generate refresh token
UserSchema.methods.generateRefreshToken = function(): string {
  return jwt.sign(
    { userId: this._id },
    config.jwtRefreshSecret,
    { expiresIn: config.jwtRefreshExpiration }
  );
};

// Override toJSON to exclude sensitive fields
UserSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.twoFactorSecret;
  delete userObject.deviceTokens;
  delete userObject.__v;
  
  return userObject;
};

// Static method to find by email or username
UserSchema.statics.findByEmailOrUsername = function(identifier: string) {
  return this.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { username: identifier.toLowerCase() }
    ]
  });
};

export const User = mongoose.model<IUser>('User', UserSchema);