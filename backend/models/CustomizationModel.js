import mongoose from "mongoose";

const customizationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  
  gender: {
    type: String,
    enum: ['Men', 'Women'],
    required: true
  },
  dressType: {
    type: String,
    required: true
  },
  fabric: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  
  designNotes: {
    type: String,
    default: ''
  },
  
  referenceImages: {
    type: [String],
    default: []
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
    default: ''
  },
  
  aiGeneratedDesign: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  
  canvasDesign: {
    svg: {
      type: String,
      default: ''
    },
    
    pngUrl: {
      type: String,
      default: ''
    },
    
    zoneColors: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    
    zonePatterns: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    
    sleeveStyle: {
      type: String,
      enum: ['full', 'elbow', 'short', 'sleeveless'],
      default: 'full'
    },
    
    baseColor: {
      type: String,
      default: '#ffffff'
    },
    
    embroideryMetadata: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
    },
    
    printMetadata: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
    },
    
    uploadedPrints: {
      type: [{
        id: { type: String, required: true },
        url: { type: String, required: true },
        zoneName: { type: String },
        zone: { type: String },
        fitOption: { type: String },
        repeat: { type: String },
        uploadedAt: { type: Date, default: Date.now }
      }],
      default: []
    },
    
    uploadedEmbroidery: {
      type: [{
        id: { type: String, required: true },
        url: { type: String, required: true },
        zoneName: { type: String },
        zone: { type: String },
        threadColor: { type: String },
        uploadedAt: { type: Date, default: Date.now }
      }],
      default: []
    }
  },
  
  estimatedPrice: {
    type: Number,
    default: 0
  },
  
  status: {
    type: String,
    enum: ['Draft', 'Submitted', 'In Review', 'In Production', 'Ready', 'Delivered'],
    default: 'Draft'
  }
}, {
  timestamps: true
});

customizationSchema.index({ userId: 1, createdAt: -1 });
customizationSchema.index({ status: 1 });

const customizationModel = mongoose.models.customization || mongoose.model('customization', customizationSchema);

export default customizationModel;