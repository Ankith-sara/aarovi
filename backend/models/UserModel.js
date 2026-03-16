import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  label:   { type: String },
  address: { type: String },
  city:    { type: String },
  state:   { type: String },
  zip:     { type: String },
  country: { type: String },
  phone:   { type: String },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  image:    { type: String, default: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png' },
  googleId: { type: String, sparse: true },

  addresses:           { type: [addressSchema], default: [] },
  wishlist:            { type: [String], default: [] },
  savedCustomizations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'customization' }],
  cartData:            { type: Object, default: {} },

  role:       { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },

  // Shared OTP field – used for both signup and login
  otp:       { type: String },
  otpExpiry: { type: Date },
}, { timestamps: true, minimize: false });

export default mongoose.models.user || mongoose.model('user', userSchema);
