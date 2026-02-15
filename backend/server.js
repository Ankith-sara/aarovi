import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/UserRoute.js';
import productRouter from './routes/ProductRoute.js';
import cartRouter from './routes/CartRoute.js';
import orderRouter from './routes/OrderRoute.js';
import wishlistRouter from './routes/WishlistRoute.js';
import CustomizationRouter from './routes/CustomizationRoute.js';

const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS Configuration
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// API Endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/customization', CustomizationRouter);

app.get('/', (req, res) => {
    res.send("API is working");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err.message);

    if (err.type === 'entity.too.large') {
        return res.status(413).json({
            success: false,
            message: 'Request payload too large. Please reduce image sizes.'
        });
    }

    res.status(500).json({
        success: false,
        message: "Something went wrong!",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(port, () => console.log(`Server started on PORT: ${port}`));

export default app;