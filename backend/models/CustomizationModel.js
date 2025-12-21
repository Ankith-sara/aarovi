import mongoose from "mongoose";

const customizationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  gender: { type: String, enum: ["Men", "Women"], required: true },
  dressType: { type: String, required: true },
  fabric: { type: String, required: true },
  color: { type: String, required: true },
  designNotes: { type: String, default: "" },
  referenceImages: [{ type: String }],
  measurements: {
    bust: { type: String, default: "" },
    waist: { type: String, default: "" },
    hips: { type: String, default: "" },
    shoulder: { type: String, default: "" },
    sleeveLength: { type: String, default: "" },
    length: { type: String, default: "" },
    customNotes: { type: String, default: "" }
  },
  aiPrompt: { type: String, default: "" },
  estimatedPrice: { type: Number, default: 0, min: 0 },
  canvasDesign: {
    json: { type: String, default: "" },
    svg: { type: String, default: "" },
    png: { type: String, default: "" },
    backgroundImage: { type: String, default: "" }
  },
  status: {
    type: String,
    enum: ["Draft", "Submitted", "Under Review", "Quoted", "In Production", "Ready", "Delivered", "Cancelled"],
    default: "Draft"
  },
  adminNotes: { type: String, default: "" },
  quotedPrice: { type: Number, default: 0, min: 0 },
  productionTime: { type: String, default: "" },
}, {
  timestamps: true
});

customizationSchema.index({ userId: 1, createdAt: -1 });
customizationSchema.index({ status: 1 });
customizationSchema.virtual('age').get(function () {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

const customizationModel = mongoose.models.customization || mongoose.model("customization", customizationSchema);

export default customizationModel;