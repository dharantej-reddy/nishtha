import admin from 'firebase-admin';
import { config } from './config';
import { logger } from '../utils/logger';

let isInitialized = false;

export const initFirebase = async (): Promise<void> => {
  try {
    if (isInitialized) {
      return;
    }

    if (!config.firebaseProjectId || !config.firebasePrivateKey || !config.firebaseClientEmail) {
      logger.warn('Firebase configuration incomplete, skipping initialization');
      return;
    }

    const serviceAccount = {
      projectId: config.firebaseProjectId,
      privateKey: config.firebasePrivateKey,
      clientEmail: config.firebaseClientEmail,
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: config.firebaseDatabaseUrl,
    });

    isInitialized = true;
    logger.info('✅ Firebase initialized successfully');
  } catch (error) {
    logger.error('❌ Failed to initialize Firebase:', error);
    throw error;
  }
};

export const getFirebaseAdmin = () => {
  if (!isInitialized) {
    throw new Error('Firebase not initialized');
  }
  return admin;
};

export default admin;