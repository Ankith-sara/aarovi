import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import userModel from '../models/UserModel.js';
import sendWelcomeMail from '../middlewares/sendWelcomeMail.js';
import sendOtpMail from '../middlewares/sendOtpMail.js';

export const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const createToken = (id, role = 'user') =>
    jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

export const findUserByEmail = (email) => userModel.findOne({ email });

export const createOtpForUser = async ({ email, name, password, role = 'user', isAdmin = false }) => {
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    const hashedPassword = await hashPassword(password);

    let user = await findUserByEmail(email);

    if (user) {
        Object.assign(user, { name, password: hashedPassword, role, isAdmin, otp, otpExpiry, isVerified: false });
    } else {
        user = new userModel({ email, name, password: hashedPassword, role, isAdmin, isVerified: false, otp, otpExpiry });
    }

    await user.save();
    await sendOtpMail(email, otp);
    return user;
};

export const verifyUserOtp = async (email, otp) => {
    const user = await findUserByEmail(email);
    if (!user) throw { status: 404, message: 'User not found. Please register first.' };
    if (!user.otp || !user.otpExpiry) throw { status: 400, message: 'OTP not requested. Please request OTP first.' };
    if (user.otp !== otp) throw { status: 401, message: 'Invalid OTP' };
    if (user.otpExpiry < new Date()) throw { status: 401, message: 'OTP expired. Please request a new one.' };

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    await sendWelcomeMail(email, user.name);
    return user;
};
