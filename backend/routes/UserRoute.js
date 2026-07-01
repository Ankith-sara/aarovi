import express from 'express';
import upload from '../middlewares/multer.js';
import authUser from '../middlewares/Auth.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import { newsletterValidation } from '../middlewares/validators.js';
import {
  registerUser, loginUser, registerAdmin, loginAdmin,
  getUserDetails, getUserProfile,
  updateUserProfile, addOrUpdateAddress, deleteAddress, subscribeNewsletter,
} from '../controllers/UserController.js';

const userRouter = express.Router();

// ── Auth ───────────────────────────────────────────────────────────────────
userRouter.post('/register', authLimiter, registerUser);
userRouter.post('/login', authLimiter, loginUser);
// ── Admin auth ─────────────────────────────────────────────────────────────
userRouter.post('/register-admin', authLimiter, registerAdmin);
userRouter.post('/login-admin', authLimiter, loginAdmin);
// ── Newsletter ─────────────────────────────────────────────────────────────
userRouter.post('/newsletter/subscribe', newsletterValidation, subscribeNewsletter);
// ── Profile ────────────────────────────────────────────────────────────────
userRouter.get('/profile', authUser, getUserProfile);
userRouter.get('/profile/:id', getUserDetails);
userRouter.put('/profile/:id', authUser, upload.single('image'), updateUserProfile);
userRouter.put('/address/:id', authUser, addOrUpdateAddress);
userRouter.delete('/address/:id', authUser, deleteAddress);

export default userRouter;