import express from 'express';
import upload from '../middlewares/multer.js';
import authUser from '../middlewares/Auth.js';
import { authLimiter, otpLimiter } from '../middlewares/rateLimiter.js';
import { verifyOtpValidation, newsletterValidation } from '../middlewares/validators.js';
import {
  sendOtp, verifyOtp, googleSignIn,
  sendAdminOtp, verifyAdminOtp,
  getUserDetails, getUserProfile,
  updateUserProfile, addOrUpdateAddress, deleteAddress,
  subscribeNewsletter,
} from '../controllers/UserController.js';

const userRouter = express.Router();

// ── Auth ───────────────────────────────────────────────────────────────────
userRouter.post('/send-otp',         otpLimiter,  sendOtp);
userRouter.post('/verify-otp',       authLimiter, verifyOtpValidation, verifyOtp);
userRouter.post('/google-signin',    authLimiter, googleSignIn);

// ── Admin auth ─────────────────────────────────────────────────────────────
userRouter.post('/send-admin-otp',   otpLimiter,  sendAdminOtp);
userRouter.post('/verify-admin-otp', authLimiter, verifyOtpValidation, verifyAdminOtp);

// ── Newsletter ─────────────────────────────────────────────────────────────
userRouter.post('/newsletter/subscribe', newsletterValidation, subscribeNewsletter);

// ── Profile ────────────────────────────────────────────────────────────────
userRouter.get('/profile',           authUser, getUserProfile);
userRouter.get('/profile/:id',       getUserDetails);
userRouter.put('/profile/:id',       authUser, upload.single('image'), updateUserProfile);
userRouter.put('/address/:id',       authUser, addOrUpdateAddress);
userRouter.delete('/address/:id',    authUser, deleteAddress);

export default userRouter;
