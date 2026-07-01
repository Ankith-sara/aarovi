import admin from 'firebase-admin';
import logger from '../utils/logger.js';

let firebaseAdminInstance = null;

try {
  const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (serviceAccountVar) {
    try {
      const serviceAccount = JSON.parse(serviceAccountVar);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      firebaseAdminInstance = admin;
      logger.info('Firebase Admin SDK initialized successfully using FIREBASE_SERVICE_ACCOUNT.');
    } catch (jsonErr) {
      logger.error('Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:', jsonErr);
    }
  } else if (projectId && clientEmail && privateKey) {
    try {
      const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: formattedPrivateKey
        })
      });
      firebaseAdminInstance = admin;
      logger.info('Firebase Admin SDK initialized successfully using individual environment keys.');
    } catch (certErr) {
      logger.error('Failed to initialize Firebase Admin SDK using cert properties:', certErr);
    }
  } else {
    logger.warn('Firebase Admin SDK: Credentials not found in environment variables. Firebase auth verification will fail until configured.');
  }
} catch (error) {
  logger.error('Firebase Admin SDK initialization critical error:', error);
}

export default firebaseAdminInstance;