import rateLimit from 'express-rate-limit';

const isDev = process.env.NODE_ENV !== 'production';

// General API limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => isDev,
    message: { success: false, message: 'Too many requests. Please try again after 15 minutes.' }
});

// Strict limiter for auth routes
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => isDev,
    message: { success: false, message: 'Too many login attempts. Please try again after 15 minutes.' }
});

// OTP limiter - prevent OTP spam
export const otpLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => isDev,
    message: { success: false, message: 'Too many OTP requests. Please wait 5 minutes.' }
});