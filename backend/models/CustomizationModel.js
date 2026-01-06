import mongoose from "mongoose";

const customizationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ["Men", "Women"]
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
    default: ""
  },
  referenceImages: [{
    type: String  // Base64 encoded images
  }],
  measurements: {
    bust: { type: String, default: "" },
    waist: { type: String, default: "" },
    hips: { type: String, default: "" },
    shoulder: { type: String, default: "" },
    sleeveLength: { type: String, default: "" },
    length: { type: String, default: "" },
    customNotes: { type: String, default: "" }
  },
  aiPrompt: {
    type: String,
    default: ""
  },
  canvasDesign: {
    svg: { type: String, default: "" },
    png: { type: String, default: "" },    
    zoneColors: { type: Map, of: String, default: {} },
    zonePatterns: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} }, 
    neckStyle: { type: String, default: "round" },
    sleeveStyle: { type: String, default: "full" },
    baseColor: { type: String, default: "#ffffff" },
    embroideryMetadata: [{
      type: {
        type: String,
        enum: ['maggam', 'threadWork', 'sequins', 'beadwork']
      },
      zone: String,
      zoneName: String,
      density: String,
      threadColor: String,
      appliedAt: { type: Date, default: Date.now }
    }]
  },
  estimatedPrice: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["Draft", "Submitted", "In Review", "In Production", "Ready", "Delivered"],
    default: "Draft"
  }
}, {
  timestamps: true
});

// Index for faster queries
customizationSchema.index({ userId: 1, createdAt: -1 });
customizationSchema.index({ status: 1 });

const customizationModel = mongoose.models.customization || mongoose.model("customization", customizationSchema);

export default customizationModel;