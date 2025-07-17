import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface Config {
  // Server Configuration
  port: number;
  nodeEnv: string;
  apiUrl: string;
  clientUrl: string;

  // Database Configuration
  mongoUri: string;
  mongoOptions: object;

  // Redis Configuration
  redisHost: string;
  redisPort: number;
  redisPassword?: string;
  redisUrl: string;

  // JWT Configuration
  jwtSecret: string;
  jwtExpiration: string;
  jwtRefreshSecret: string;
  jwtRefreshExpiration: string;

  // Email Configuration
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  emailFrom: string;

  // File Upload Configuration
  cloudinaryName: string;
  cloudinaryApiKey: string;
  cloudinaryApiSecret: string;
  maxFileSize: number;
  allowedFileTypes: string[];

  // Payment Configuration
  stripeSecretKey: string;
  stripePublishableKey: string;
  stripeWebhookSecret: string;
  razorpayKeyId: string;
  razorpayKeySecret: string;
  razorpayWebhookSecret: string;

  // Firebase Configuration
  firebaseProjectId: string;
  firebasePrivateKey: string;
  firebaseClientEmail: string;
  firebaseDatabaseUrl: string;

  // External API Keys
  googleMapsApiKey: string;
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioPhoneNumber: string;

  // Security Configuration
  bcryptRounds: number;
  rateLimitWindowMs: number;
  rateLimitMax: number;

  // Analytics Configuration
  googleAnalyticsId: string;
  mixpanelToken: string;

  // Logging Configuration
  logLevel: string;
  logFormat: string;
}

export const config: Config = {
  // Server Configuration
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiUrl: process.env.API_URL || 'http://localhost:5000',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',

  // Database Configuration
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/sacredconnect',
  mongoOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferMaxEntries: 0,
    bufferCommands: false,
  },

  // Redis Configuration
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: parseInt(process.env.REDIS_PORT || '6379', 10),
  redisPassword: process.env.REDIS_PASSWORD,
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',

  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  jwtExpiration: process.env.JWT_EXPIRATION || '24h',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-jwt-key',
  jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',

  // Email Configuration
  smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
  smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
  smtpUser: process.env.SMTP_USER || 'your-email@gmail.com',
  smtpPassword: process.env.SMTP_PASSWORD || 'your-app-password',
  emailFrom: process.env.EMAIL_FROM || 'SacredConnect <noreply@sacredconnect.com>',

  // File Upload Configuration
  cloudinaryName: process.env.CLOUDINARY_NAME || 'your-cloudinary-name',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || 'your-api-key',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || 'your-api-secret',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
  allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,gif,mp4,mov,avi,pdf,doc,docx').split(','),

  // Payment Configuration
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_your_stripe_secret_key',
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_publishable_key',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_your_webhook_secret',
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_secret',
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || 'your_webhook_secret',

  // Firebase Configuration
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || 'your-firebase-project',
  firebasePrivateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk@your-project.iam.gserviceaccount.com',
  firebaseDatabaseUrl: process.env.FIREBASE_DATABASE_URL || 'https://your-project.firebaseio.com',

  // External API Keys
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || 'your-google-maps-api-key',
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || 'your-twilio-account-sid',
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || 'your-twilio-auth-token',
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER || '+1234567890',

  // Security Configuration
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),

  // Analytics Configuration
  googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID || 'GA-XXXXXXXXX',
  mixpanelToken: process.env.MIXPANEL_TOKEN || 'your-mixpanel-token',

  // Logging Configuration
  logLevel: process.env.LOG_LEVEL || 'info',
  logFormat: process.env.LOG_FORMAT || 'combined',
};

// Validate required environment variables
const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  } else {
    console.warn('Running in development mode with default values');
  }
}

export default config;