import express from 'express';
import { googleAuth } from '../controllers/AuthController.js';
import { authLimiter } from '../middlewares/rateLimiter.js';

const authRouter = express.Router();

// POST /api/auth/google
authRouter.post('/google', authLimiter, googleAuth);

export default authRouter;