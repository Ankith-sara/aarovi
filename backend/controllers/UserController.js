import jwt from 'jsonwebtoken';
import validator from 'validator';
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from 'bcryptjs';
import userModel from '../models/UserModel.js';
import sendWelcomeMail from '../middlewares/sendWelcomeMail.js';
import sendNewsletterMail from '../middlewares/sendNewsletterMail.js';
import logger from '../utils/logger.js';

const createToken = (id, role = 'user') =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });

// USER: Register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Name is required (min 2 characters)' });
    }
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
    }

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new userModel({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      isVerified: true,
      authProviders: ['password']
    });

    await user.save();
    logger.info(`New user registered: ${email}`);

    try {
      await sendWelcomeMail(email, name);
    } catch (mailErr) {
      logger.error(`Welcome email send failure for ${email}:`, mailErr);
    }

    const token = createToken(user._id, user.role);
    res.json({ success: true, token, name: user.name, role: user.role });
  } catch (error) {
    logger.error('Register User Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// USER: Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email' });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: 'This account was created using Google Sign-In. Please sign in with Google.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    const token = createToken(user._id, user.role);
    res.json({ success: true, token, name: user.name, role: user.role });
  } catch (error) {
    logger.error('Login User Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADMIN: Register
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Name is required (min 2 characters)' });
    }
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
    }

    const exists = await userModel.findOne({ email });
    if (exists) {
      if (exists.role === 'admin') {
        return res.status(400).json({ success: false, message: 'Admin account already exists. Please sign in.' });
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        exists.role = 'admin';
        exists.password = hashedPassword;
        if (!exists.authProviders.includes('password')) {
          exists.authProviders.push('password');
        }
        await exists.save();
        logger.info(`Existing user promoted to admin: ${email}`);
        const token = createToken(exists._id, 'admin');
        return res.json({ success: true, token, name: exists.name, role: 'admin', message: 'Welcome back admin!' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new userModel({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      isVerified: true,
      role: 'admin',
      authProviders: ['password']
    });

    await user.save();
    logger.info(`New admin registered: ${email}`);

    try {
      await sendWelcomeMail(email, name);
    } catch (mailErr) {
      logger.error(`Welcome email send failure for admin ${email}:`, mailErr);
    }

    const token = createToken(user._id, 'admin');
    res.json({ success: true, token, name: user.name, role: 'admin', message: `Welcome Admin ${user.name}!` });
  } catch (error) {
    logger.error('Register Admin Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADMIN: Login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No admin account found with this email' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'This email is not authorised for admin access.' });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: 'This admin account was created using Google Sign-In. Please sign in with Google.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    const token = createToken(user._id, 'admin');
    res.json({ success: true, token, name: user.name, role: 'admin', message: `Welcome ${user.name}!` });
  } catch (error) {
    logger.error('Login Admin Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PROFILE
export const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).select('-password');
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
      .select('-password');
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