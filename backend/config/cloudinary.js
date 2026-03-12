import { v2 as cloudinary } from 'cloudinary';
import logger from '../utils/logger.js';

const connectCloudinary = async () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });
    logger.info('Cloudinary configured');
  } catch (error) {
    logger.error('Cloudinary config failed:', error.message);
  }
};

export default connectCloudinary;
