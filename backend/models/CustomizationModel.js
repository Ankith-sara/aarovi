import mongoose from "mongoose";

const customizationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'User ID is required'],
    index: true
  },
  
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: {
      values: ['Men', 'Women'],
      message: 'Gender must be either Men or Women'
    }
  },
  
  dressType: {
    type: String,
    required: [true, 'Dress type is required'],
    trim: true
  },
  
  fabric: {
    type: String,
    required: [true, 'Fabric is required'],
    trim: true
  },
  
  color: {
    type: String,
    required: [true, 'Color is required'],
    trim: true
  },
  
  designNotes: {
    type: String,
    trim: true,
    default: ''
  },
  
  referenceImages: {
    type: [String],
    default: [],
    validate: {
      validator: function(arr) {
        return arr.length <= 5;
      },
      message: 'Maximum 5 reference images allowed'
    }
  },
  
  measurements: {
    bust: { type: String, default: '' },
    waist: { type: String, default: '' },
    hips: { type: String, default: '' },
    shoulder: { type: String, default: '' },
    sleeveLength: { type: String, default: '' },
    length: { type: String, default: '' },
    customNotes: { type: String, default: '' }
  },
  
  aiPrompt: {
    type: String,
    trim: true,
    default: ''
  },
  
  estimatedPrice: {
    type: Number,
    default: 0,
    min: [0, 'Price cannot be negative']
  },
  
  canvasDesign: {
    svg: { type: String, default: '' },
    pngUrl: { type: String, default: '' },
    zoneColors: { type: mongoose.Schema.Types.Mixed, default: {} },
    zonePatterns: { type: mongoose.Schema.Types.Mixed, default: {} },
    sleeveStyle: { 
      type: String, 
      default: 'full',
      enum: ['full', 'elbow', 'short', 'sleeveless']
    },
    baseColor: { type: String, default: '#ffffff' },
    embroideryMetadata: { 
      type: [mongoose.Schema.Types.Mixed], 
      default: [] 
    }
  },
  
  aiGeneratedDesign: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  
  status: {
    type: String,
    required: true,
    enum: {
      values: ['Draft', 'Submitted', 'In Review', 'In Production', 'Ready', 'Delivered'],
      message: 'Invalid status'
    },
    default: 'Draft',
    index: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
customizationSchema.index({ userId: 1, createdAt: -1 });
customizationSchema.index({ status: 1, createdAt: -1 });

const customizationModel = mongoose.models.customization || mongoose.model('customization', customizationSchema);

export default customizationModel;