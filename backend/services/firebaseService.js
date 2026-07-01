import firebaseAdmin from '../config/firebaseAdmin.js';
import logger from '../utils/logger.js';

/**
 * Verifies a Firebase ID token sent from the client.
 * @param {string} idToken - Client Firebase ID token
 * @returns {Promise<Object>} Decoded user details
 */
export const verifyFirebaseIdToken = async (idToken) => {
  if (global.mockFirebaseVerification) {
    return global.mockFirebaseVerification(idToken);
  }
  if (!idToken) {
    const error = new Error('Firebase ID Token is missing.');
    error.statusCode = 400;
    throw error;
  }

  if (!firebaseAdmin) {
    logger.error('Firebase Admin SDK not initialized. Verification aborted.');
    const error = new Error('Authentication service is currently misconfigured on the server. Please set Firebase environment variables.');
    error.statusCode = 500;
    throw error;
  }

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    
    const { uid, email, name, picture, email_verified } = decodedToken;
    
    if (!email) {
      const error = new Error('Email address is missing from the Firebase token. Email is required for authentication.');
      error.statusCode = 400;
      throw error;
    }
    
    return {
      uid,
      email,
      displayName: name || '',
      photoURL: picture || '',
      emailVerified: !!email_verified
    };
  } catch (err) {
    logger.error('Error verifying Firebase ID Token:', err);
    let message = 'Invalid or expired authentication token.';
    let statusCode = 401;

    if (err.code === 'auth/id-token-expired') {
      message = 'Authentication token has expired. Please sign in again.';
    } else if (err.code === 'auth/argument-error') {
      message = 'Malformed authentication token.';
      statusCode = 400;
    }

    const error = new Error(message);
    error.statusCode = statusCode;
    error.originalError = err;
    throw error;
  }
};
