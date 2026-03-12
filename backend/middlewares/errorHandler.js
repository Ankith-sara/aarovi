import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
    logger.error(`${req.method} ${req.originalUrl} - ${err.message}`, { stack: err.stack });

    // Payload too large
    if (err.type === 'entity.too.large') {
        return res.status(413).json({
            success: false,
            message: 'Request payload too large. Please reduce image sizes.'
        });
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ success: false, message: messages.join(', ') });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        return res.status(409).json({ success: false, message: `${field} already exists.` });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Token expired. Please login again.' });
    }

    // Default 500
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Something went wrong!',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

export default errorHandler;
