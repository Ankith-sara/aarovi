import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connectDB = async () => {
    mongoose.connection.on('connected',()=>{
        logger.info('MongoDB connected')
    })
    await mongoose.connect(`${process.env.MONGODB_URI}`)
}

export default connectDB;