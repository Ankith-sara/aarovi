import userModel from '../models/UserModel.js';
import { verifyFirebaseIdToken } from '../services/firebaseService.js';
import { generateTokens } from '../services/jwtService.js';
import sendWelcomeMail from '../middlewares/sendWelcomeMail.js';
import logger from '../utils/logger.js';

/**
 * Controller to handle Google Sign-In and Sign-Up.
 * Verifies Firebase Token, checks database, links accounts, creates new users.
 */
export const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Firebase ID Token is required.'
      });
    }

    // 1. Verify token
    let firebaseUser;
    try {
      firebaseUser = await verifyFirebaseIdToken(idToken);
    } catch (verifyErr) {
      return res.status(verifyErr.statusCode || 401).json({
        success: false,
        message: verifyErr.message || 'Firebase token verification failed.'
      });
    }

    const { uid, email, displayName, photoURL, emailVerified } = firebaseUser;

    // 2. Search MongoDB by priority: firebaseUid first, then email
    let user = await userModel.findOne({ firebaseUid: uid });

    if (!user) {
      user = await userModel.findOne({ email });
    }

    const isNewUser = !user;
    const requestedRole = req.body.role || 'user';

    // Split displayName into first & last name
    const nameParts = (displayName || '').trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    if (user) {
      // 3. User exists -> Update profile details and link providers
      let updated = false;

      if (!user.firebaseUid) {
        user.firebaseUid = uid;
        updated = true;
      }

      if (!user.authProviders.includes('google')) {
        user.authProviders.push('google');
        updated = true;
      }

      // Elevate role to admin if logging in through the admin panel
      if (requestedRole === 'admin' && user.role !== 'admin') {
        user.role = 'admin';
        updated = true;
      }

      // Update basic fields if not already populated or if they updated in Google
      if (displayName && user.name !== displayName) {
        user.name = displayName;
        user.fullName = displayName;
        user.firstName = firstName;
        user.lastName = lastName;
        updated = true;
      }

      if (photoURL && (user.image?.includes('wikipedia') || !user.image)) {
        user.image = photoURL;
        user.profileImage = photoURL;
        updated = true;
      }

      if (emailVerified !== undefined && user.emailVerified !== emailVerified) {
        user.emailVerified = emailVerified;
        updated = true;
      }

      // Ensure account verification flag reflects verified email
      if (emailVerified && !user.isVerified) {
        user.isVerified = true;
        updated = true;
      }

      user.lastLogin = new Date();
      await user.save();
      logger.info(`Existing user linked/updated: ${email}`);

    } else {
      // 4. User does not exist -> Create a new user
      user = new userModel({
        name: displayName || 'User',
        fullName: displayName || 'User',
        firstName,
        lastName,
        email,
        firebaseUid: uid,
        profileImage: photoURL || 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
        image: photoURL || 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
        emailVerified,
        isVerified: emailVerified || false,
        authProviders: ['google'],
        status: 'active',
        role: requestedRole,
        lastLogin: new Date()
      });

      await user.save();
      logger.info(`New user created via Google Sign-In: ${email}`);

      // Send welcome mail in background
      try {
        await sendWelcomeMail(email, displayName || 'User');
      } catch (mailErr) {
        logger.error(`Welcome email send failure for ${email}:`, mailErr);
      }
    }

    // 5. Generate app tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Clean user object for response
    const userResponse = {
      _id: user._id,
      name: user.name,
      fullName: user.fullName || user.name,
      email: user.email,
      image: user.image,
      profileImage: user.profileImage,
      role: user.role,
      authProviders: user.authProviders,
      addresses: user.addresses,
      wishlist: user.wishlist,
      cartData: user.cartData,
      isVerified: user.isVerified
    };

    return res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      token: accessToken, 
      user: userResponse
    });

  } catch (error) {
    logger.error('Google Auth Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.'
    });
  }
};
