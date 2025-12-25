import mongoose from "mongoose";

const customizationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "user", 
    required: [true, "User ID is required"],
    index: true
  },
  gender: { 
    type: String, 
    enum: {
      values: ["Men", "Women"],
      message: "Gender must be either Men or Women"
    }, 
    required: [true, "Gender is required"]
  },
  dressType: { 
    type: String, 
    required: [true, "Dress type is required"],
    trim: true
  },
  fabric: { 
    type: String, 
    required: [true, "Fabric is required"],
    trim: true
  },
  color: { 
    type: String, 
    required: [true, "Color is required"],
    trim: true
  },
  designNotes: { 
    type: String, 
    default: "",
    maxlength: [2000, "Design notes cannot exceed 2000 characters"]
  },
  referenceImages: {
    type: [String],
    default: [],
    validate: {
      validator: function(images) {
        return images.length <= 5;
      },
      message: "Maximum 5 reference images allowed"
    }
  },
  measurements: {
    bust: { type: String, default: "", trim: true },
    waist: { type: String, default: "", trim: true },
    hips: { type: String, default: "", trim: true },
    shoulder: { type: String, default: "", trim: true },
    sleeveLength: { type: String, default: "", trim: true },
    length: { type: String, default: "", trim: true },
    customNotes: { 
      type: String, 
      default: "",
      maxlength: [1000, "Measurement notes cannot exceed 1000 characters"]
    }
  },
  aiPrompt: { 
    type: String, 
    default: "",
    maxlength: [1000, "AI prompt cannot exceed 1000 characters"]
  },
  estimatedPrice: { 
    type: Number, 
    default: 0, 
    min: [0, "Price cannot be negative"]
  },
  canvasDesign: {
    json: { type: String, default: "" },
    svg: { type: String, default: "" },
    png: { type: String, default: "" },
    backgroundImage: { type: String, default: "" },
    neckStyle: { type: String, default: "" },
    sleeveStyle: { type: String, default: "" }
  },
  status: {
    type: String,
    enum: {
      values: ["Draft", "Submitted", "Under Review", "Quoted", "In Production", "Ready", "Delivered", "Cancelled"],
      message: "Invalid status value"
    },
    default: "Draft",
    index: true
  },
  adminNotes: { 
    type: String, 
    default: "",
    maxlength: [2000, "Admin notes cannot exceed 2000 characters"]
  },
  quotedPrice: { 
    type: Number, 
    default: 0, 
    min: [0, "Quoted price cannot be negative"]
  },
  productionTime: { 
    type: String, 
    default: "",
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
customizationSchema.index({ userId: 1, createdAt: -1 });
customizationSchema.index({ status: 1, createdAt: -1 });
customizationSchema.index({ userId: 1, status: 1 });

// Virtual for age calculation
customizationSchema.virtual('age').get(function () {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Method to check if customization can be edited
customizationSchema.methods.canEdit = function() {
  return ["Draft", "Submitted"].includes(this.status);
};

// Method to check if customization can be deleted
customizationSchema.methods.canDelete = function() {
  return !["In Production", "Ready", "Delivered"].includes(this.status);
};

// Pre-save middleware to validate data
customizationSchema.pre('save', function(next) {
  // Trim string fields
  if (this.designNotes) this.designNotes = this.designNotes.trim();
  if (this.aiPrompt) this.aiPrompt = this.aiPrompt.trim();
  if (this.adminNotes) this.adminNotes = this.adminNotes.trim();
  
  next();
});

// Static method to get user customizations with pagination
customizationSchema.statics.getUserCustomizations = async function(userId, options = {}) {
  const {
    page = 1,
    limit = 10,
    status,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = options;

  const query = { userId };
  if (status) query.status = status;

  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const [customizations, total] = await Promise.all([
    this.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    this.countDocuments(query)
  ]);

  return {
    customizations,
    total,
    page,
    pages: Math.ceil(total / limit)
  };
};

// Ensure model is only created once
const customizationModel = mongoose.models.customization || 
  mongoose.model("customization", customizationSchema);

export default customizationModel;