import jwt from 'jsonwebtoken';

/**
 * Generates an Access Token and a Refresh Token for the given user.
 * @param {Object} user - User document
 * @returns {Object} { accessToken, refreshToken }
 */
export const generateTokens = (user) => {
  const payload = {
    id: user._id,
    role: user.role || 'user'
  };

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '1d' } // Access Token expires in 1 day
  );

  // Use a refresh secret if defined, otherwise fall back to JWT_SECRET
  const refreshSecret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
  const refreshToken = jwt.sign(
    payload,
    refreshSecret,
    { expiresIn: '30d' } // Refresh Token expires in 30 days
  );

  return {
    accessToken,
    refreshToken
  };
};
