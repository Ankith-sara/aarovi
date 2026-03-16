# Aarovi — Backend API

Node.js/Express REST API for the Aarovi e-commerce platform.

## Tech stack

- **Runtime**: Node.js (ESM)
- **Framework**: Express
- **Database**: MongoDB via Mongoose
- **Auth**: OTP-based (email) + Google OAuth
- **File storage**: Cloudinary
- **Payments**: Razorpay + QR/UPI

## Getting started

```bash
npm install
cp .env.example .env   # fill in your values
npm run dev            # starts with nodemon on PORT 4000
```

## Environment variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `CLOUDINARY_*` | Cloudinary credentials |
| `RAZORPAY_KEY_ID` / `RAZORPAY_SECRET_KEY` | Razorpay credentials |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins |
| `NODE_ENV` | `development` or `production` |

## API overview

| Prefix | Description |
|---|---|
| `/api/user` | Auth (OTP, Google), profile, addresses |
| `/api/product` | Product CRUD |
| `/api/cart` | Cart management |
| `/api/order` | Orders (COD, QR, Razorpay) |
| `/api/wishlist` | Wishlist |
| `/api/customization` | Custom garment orders |

## Running tests

```bash
npm test
```

## Security notes

- Rate limiting is applied globally (`/api`) and more strictly on auth routes
- Admin access requires the account to already have `role: 'admin'` in the database — no API endpoint promotes users to admin
- OTPs expire after 5 minutes; resend is rate-limited to once per 60 seconds
