import jwt from 'jsonwebtoken';
import validator from 'validator';
import { v2 as cloudinary } from 'cloudinary';
import { OAuth2Client } from 'google-auth-library';
import userModel from '../models/UserModel.js';
import sendOtpMail from '../middlewares/sendOtpMail.js';
import sendWelcomeMail from '../middlewares/sendWelcomeMail.js';
import sendNewsletterMail from '../middlewares/sendNewsletterMail.js';
import logger from '../utils/logger.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const createToken = (id, role = 'user') =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });

// ── helpers ────────────────────────────────────────────────────────────────

/** Send an OTP to any email, creating or updating the user record.
 *  Works for both new users (signup) and existing verified users (login). */
async function issueOtp(email, name, role = 'user') {
  let user = await userModel.findOne({ email });

  // Rate-limit: don't resend if a valid OTP was sent in the last 60 s
  if (user?.otpExpiry && user.otpExpiry > new Date(Date.now() - 4 * 60 * 1000)) {
    const secsLeft = Math.ceil((user.otpExpiry - new Date()) / 1000);
    if (secsLeft > 0) {
      const err = new Error(`OTP already sent. Wait ${secsLeft}s before requesting again.`);
      err.status = 429;
      throw err;
    }
  }

  const otp = generateOtp();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min

  if (user) {
    // Keep existing name unless this is a registration call with a real name
    if (name && name !== 'User' && name !== 'Admin') user.name = name;
    user.otp = otp;
    user.otpExpiry = otpExpiry;
  } else {
    user = new userModel({ email, name, role, isAdmin: role === 'admin', otp, otpExpiry });
  }

  await user.save();
  await sendOtpMail(email, otp, role);
  return user;
}

// ── USER: send OTP (signup + login unified) ────────────────────────────────

export const sendOtp = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address' });
    }

    const existing = await userModel.findOne({ email });
    const isNewUser = !existing || !existing.isVerified;

    // For login: name is not required (we already have it). For signup: require it.
    if (isNewUser && (!name || name.trim().length < 2)) {
      return res.status(400).json({ success: false, message: 'Name is required for new accounts' });
    }

    await issueOtp(email, name || existing?.name || 'User', 'user');

    res.json({ success: true, isNewUser, message: 'Verification code sent to your email.' });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

// ── USER: verify OTP (signup + login unified) ──────────────────────────────

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found. Please start again.' });
    }
    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({ success: false, message: 'No OTP requested. Please request a new code.' });
    }
    if (user.otpExpiry < new Date()) {
      return res.status(401).json({ success: false, message: 'Code expired. Please request a new one.' });
    }
    if (user.otp !== otp) {
      return res.status(401).json({ success: false, message: 'Invalid code. Please try again.' });
    }

    const isFirstTime = !user.isVerified;
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    if (isFirstTime) await sendWelcomeMail(email, user.name);

    const token = createToken(user._id, user.role);
    res.json({ success: true, token, name: user.name, role: user.role });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GOOGLE SIGN-IN ─────────────────────────────────────────────────────────

export const googleSignIn = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ success: false, message: 'Google credential is required' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { sub: googleId, email, name, picture } = ticket.getPayload();

    let user = await userModel.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // Link Google ID if this email existed without it
      if (!user.googleId) user.googleId = googleId;
      if (picture && user.image?.includes('wikipedia')) user.image = picture;
      user.isVerified = true;
      await user.save();
    } else {
      user = await userModel.create({
        name, email, googleId, image: picture,
        role: 'user', isVerified: true,
      });
      await sendWelcomeMail(email, name);
    }

    const token = createToken(user._id, user.role);
    res.json({ success: true, token, name: user.name, role: user.role });
  } catch (err) {
    logger.error('Google sign-in error:', err);
    res.status(401).json({ success: false, message: 'Google sign-in failed. Please try again.' });
  }
};

// ── ADMIN: send OTP ────────────────────────────────────────────────────────

export const sendAdminOtp = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address' });
    }

    const existing = await userModel.findOne({ email });
    const isNewAdmin = !existing || !existing.isVerified;

    if (isNewAdmin && (!name || name.trim().length < 2)) {
      return res.status(400).json({ success: false, message: 'Name is required for new admin accounts' });
    }

    // If existing user is not an admin role, promote to admin
    if (existing && existing.role !== 'admin') {
      existing.role = 'admin';
      existing.isAdmin = true;
      await existing.save();
    }

    await issueOtp(email, name || existing?.name || 'Admin', 'admin');

    res.json({ success: true, message: 'Verification code sent to your email.' });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

// ── ADMIN: verify OTP ──────────────────────────────────────────────────────

export const verifyAdminOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Admin account not found.' });
    }
    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'This account does not have admin access.' });
    }
    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({ success: false, message: 'No OTP requested. Please request a new code.' });
    }
    if (user.otpExpiry < new Date()) {
      return res.status(401).json({ success: false, message: 'Code expired. Please request a new one.' });
    }
    if (user.otp !== otp) {
      return res.status(401).json({ success: false, message: 'Invalid code. Please try again.' });
    }

    const isFirstTime = !user.isVerified;
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    if (isFirstTime) await sendWelcomeMail(email, user.name);

    const token = createToken(user._id, 'admin');
    res.json({ success: true, token, name: user.name, role: 'admin', message: `Welcome ${user.name}!` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PROFILE ────────────────────────────────────────────────────────────────

export const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId).select('-otp -otpExpiry');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).select('-otp -otpExpiry');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const updates = { name, email, phone };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'image', folder: 'user_profiles',
      });
      updates.image = result.secure_url;
    }

    const user = await userModel.findByIdAndUpdate(req.params.id, updates, { new: true })
      .select('-otp -otpExpiry');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addOrUpdateAddress = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { addressObj, index } = req.body;
    if (typeof index === 'number' && index >= 0) {
      user.addresses[index] = addressObj;
    } else {
      user.addresses.push(addressObj);
    }
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.addresses.splice(req.body.index, 1);
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const subscribeNewsletter = async (req, res) => {
  try {
    await sendNewsletterMail(req.body.email);
    res.json({ success: true, message: 'Check your inbox for the WhatsApp join link.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
