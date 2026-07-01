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

  // Firebase integration fields
  firebaseUid:   { type: String, sparse: true, unique: true },
  fullName:      { type: String, trim: true },
  firstName:     { type: String, trim: true },
  lastName:      { type: String, trim: true },
  profileImage:  { type: String },
  phone:         { type: String, trim: true },
  authProviders: { type: [String], default: ['password'] },
  emailVerified: { type: Boolean, default: false },
  status:        { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
  preferences:   { type: Object, default: {} },
  lastLogin:     { type: Date },

  addresses:           { type: [addressSchema], default: [] },
  wishlist:            { type: [String], default: [] },
  savedCustomizations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'customization' }],
  cartData:            { type: Object, default: {} },

  role:       { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  password:   { type: String }
}, { timestamps: true, minimize: false });

export default mongoose.models.user || mongoose.model('user', userSchema);
