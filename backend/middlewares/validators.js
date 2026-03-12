import { body, param, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// ── Auth ───────────────────────────────────────────────────────────────────
export const verifyOtpValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 digits'),
  validate,
];

// ── Newsletter ─────────────────────────────────────────────────────────────
export const newsletterValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  validate,
];

// ── Products ───────────────────────────────────────────────────────────────
export const addProductValidation = [
  body('name').trim().notEmpty().isLength({ min: 2, max: 200 }).withMessage('Product name must be 2–200 characters'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0.01 }).withMessage('Price must be a positive number'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('subCategory').trim().notEmpty().withMessage('Sub-category is required'),
  validate,
];

// ── Orders ─────────────────────────────────────────────────────────────────
export const placeOrderValidation = [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('amount').isFloat({ min: 0 }).withMessage('Order amount must be non-negative'),
  body('address').notEmpty().withMessage('Delivery address is required'),
  validate,
];

// ── Params ─────────────────────────────────────────────────────────────────
export const mongoIdParam = (paramName = 'id') => [
  param(paramName).isMongoId().withMessage(`Invalid ${paramName}`),
  validate,
];
