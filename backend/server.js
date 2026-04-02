import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/UserRoute.js';
import productRouter from './routes/ProductRoute.js';
import cartRouter from './routes/CartRoute.js';
import orderRouter from './routes/OrderRoute.js';
import wishlistRouter from './routes/WishlistRoute.js';
import CustomizationRouter from './routes/CustomizationRoute.js';
import imageGenerationRouter from './routes/ImageGenerationRoute.js';
import { apiLimiter } from './middlewares/rateLimiter.js';
import errorHandler from './middlewares/errorHandler.js';
import logger from './utils/logger.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure logs directory exists
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

// ── Security & Performance ──────────────────────────────────────────
app.use(helmet());
app.use(compression());

// Enable ETag support for conditional GET (saves bandwidth on unchanged data)
app.set('etag', 'strong');

// Cache-control helper — attach to read-only public routes
export const publicCacheHeaders = (_req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    next();
};

// ── CORS ────────────────────────────────────────────────────────────
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// ── Body Parsing ─────────────────────────────────────────────────────
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ── Logging ──────────────────────────────────────────────────────────
app.use(morgan('combined', {
    stream: { write: (msg) => logger.info(msg.trim()) }
}));

// ── Rate Limiting ────────────────────────────────────────────────────
app.use('/api', apiLimiter);

// ── API Endpoints ────────────────────────────────────────────────────
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/customization', CustomizationRouter);
app.use('/api', imageGenerationRouter);

app.get('/', (req, res) => {
    res.json({ success: true, message: 'API is running', version: '1.0.0' });
});

// ── 404 Handler ──────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Central Error Handler ─────────────────────────────────────────────
app.use(errorHandler);

app.listen(port, () => logger.info(`Server started on PORT: ${port}`));

export default app;
