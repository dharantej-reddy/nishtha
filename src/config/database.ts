import mongoose from 'mongoose';
import { config } from './config';
import { logger } from '../utils/logger';

// MongoDB connection options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  bufferMaxEntries: 0, // Disable mongoose buffering
  bufferCommands: false, // Disable mongoose buffering
  retryWrites: true,
  w: 'majority',
};

export const connectDB = async (): Promise<void> => {
  try {
    // Set mongoose debugging in development
    if (config.nodeEnv === 'development') {
      mongoose.set('debug', true);
    }

    // Connect to MongoDB
    const conn = await mongoose.connect(config.mongoUri, mongoOptions);
    
    logger.info(`🍃 MongoDB Connected: ${conn.connection.host}`);
    logger.info(`📊 Database: ${conn.connection.name}`);

    // Connection event listeners
    mongoose.connection.on('connected', () => {
      logger.info('📡 Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (error) => {
      logger.error('❌ Mongoose connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('📡 Mongoose disconnected from MongoDB');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        logger.info('🔌 MongoDB connection closed through app termination');
        process.exit(0);
      } catch (error) {
        logger.error('Error closing MongoDB connection:', error);
        process.exit(1);
      }
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (error: Error) => {
      logger.error('🚨 Unhandled Rejection:', error);
      mongoose.connection.close();
      process.exit(1);
    });

  } catch (error) {
    logger.error('❌ MongoDB connection failed:', error);
    
    // Retry connection after 5 seconds
    setTimeout(() => {
      logger.info('🔄 Retrying MongoDB connection...');
      connectDB();
    }, 5000);
  }
};

// Create indexes for better query performance
export const createIndexes = async (): Promise<void> => {
  try {
    const db = mongoose.connection.db;
    
    // User indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ username: 1 }, { unique: true });
    await db.collection('users').createIndex({ 'location.coordinates': '2dsphere' });
    await db.collection('users').createIndex({ createdAt: -1 });

    // Place of Worship indexes
    await db.collection('placesofworship').createIndex({ 'coordinates': '2dsphere' });
    await db.collection('placesofworship').createIndex({ type: 1 });
    await db.collection('placesofworship').createIndex({ isVerified: 1 });
    await db.collection('placesofworship').createIndex({ rating: -1 });
    await db.collection('placesofworship').createIndex({ followers: -1 });
    await db.collection('placesofworship').createIndex({ name: 'text', description: 'text' });

    // Live Events indexes
    await db.collection('liveevents').createIndex({ placeOfWorshipId: 1 });
    await db.collection('liveevents').createIndex({ isLive: 1 });
    await db.collection('liveevents').createIndex({ startTime: -1 });
    await db.collection('liveevents').createIndex({ type: 1 });
    await db.collection('liveevents').createIndex({ language: 1 });

    // Marketplace indexes
    await db.collection('marketplaceitems').createIndex({ placeOfWorshipId: 1 });
    await db.collection('marketplaceitems').createIndex({ category: 1 });
    await db.collection('marketplaceitems').createIndex({ price: 1 });
    await db.collection('marketplaceitems').createIndex({ rating: -1 });
    await db.collection('marketplaceitems').createIndex({ title: 'text', description: 'text' });

    // Bookings indexes
    await db.collection('servicebookings').createIndex({ userId: 1 });
    await db.collection('servicebookings').createIndex({ placeOfWorshipId: 1 });
    await db.collection('servicebookings').createIndex({ priestId: 1 });
    await db.collection('servicebookings').createIndex({ scheduledDate: 1 });
    await db.collection('servicebookings').createIndex({ status: 1 });

    // Community Posts indexes
    await db.collection('communityposts').createIndex({ userId: 1 });
    await db.collection('communityposts').createIndex({ ageGroup: 1 });
    await db.collection('communityposts').createIndex({ type: 1 });
    await db.collection('communityposts').createIndex({ createdAt: -1 });
    await db.collection('communityposts').createIndex({ tags: 1 });

    // Donations indexes
    await db.collection('donations').createIndex({ userId: 1 });
    await db.collection('donations').createIndex({ placeOfWorshipId: 1 });
    await db.collection('donations').createIndex({ status: 1 });
    await db.collection('donations').createIndex({ createdAt: -1 });

    // Analytics indexes
    await db.collection('analytics').createIndex({ entityType: 1, entityId: 1 });
    await db.collection('analytics').createIndex({ eventType: 1 });
    await db.collection('analytics').createIndex({ timestamp: -1 });
    await db.collection('analytics').createIndex({ userId: 1 });

    // Notifications indexes
    await db.collection('notifications').createIndex({ userId: 1 });
    await db.collection('notifications').createIndex({ isRead: 1 });
    await db.collection('notifications').createIndex({ type: 1 });
    await db.collection('notifications').createIndex({ createdAt: -1 });

    logger.info('✅ Database indexes created successfully');
  } catch (error) {
    logger.error('❌ Error creating database indexes:', error);
  }
};

// Database health check
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    const adminDb = mongoose.connection.db.admin();
    await adminDb.ping();
    return true;
  } catch (error) {
    logger.error('Database health check failed:', error);
    return false;
  }
};

// Get database statistics
export const getDatabaseStats = async (): Promise<any> => {
  try {
    const db = mongoose.connection.db;
    const stats = await db.stats();
    return {
      database: db.databaseName,
      collections: stats.collections,
      documents: stats.objects,
      dataSize: stats.dataSize,
      storageSize: stats.storageSize,
      indexes: stats.indexes,
      indexSize: stats.indexSize,
      avgObjSize: stats.avgObjSize,
      connection: {
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        readyState: mongoose.connection.readyState,
      }
    };
  } catch (error) {
    logger.error('Error getting database stats:', error);
    return null;
  }
};

export default {
  connectDB,
  createIndexes,
  checkDatabaseHealth,
  getDatabaseStats
};