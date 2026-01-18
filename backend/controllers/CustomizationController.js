import customizationModel from "../models/CustomizationModel.js";
import userModel from "../models/UserModel.js";
import mongoose from "mongoose";

// SAVE CUSTOMIZATION
const saveCustomization = async (req, res) => {
  try {
    const {
      gender,
      dressType,
      fabric,
      color,
      designNotes,
      referenceImages,
      measurements,
      aiPrompt,
      canvasDesign,
      estimatedPrice
    } = req.body;

    // Get userId from auth middleware
    const userId = req.body.userId;

    // Validate userId
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login."
      });
    }

    // Validate required fields
    if (!gender || !dressType || !fabric || !color) {
      return res.status(400).json({
        success: false,
        message: "Gender, dressType, fabric, and color are required fields"
      });
    }

    // Validate gender
    if (!["Men", "Women"].includes(gender)) {
      return res.status(400).json({
        success: false,
        message: "Gender must be either 'Men' or 'Women'"
      });
    }

    // Process canvasDesign - ensure we store the SVG and metadata
    const processedCanvasDesign = {
      svg: canvasDesign?.svg || "",
      png: canvasDesign?.png || "",
      zoneColors: canvasDesign?.zoneColors || {},
      zonePatterns: canvasDesign?.zonePatterns || {},
      neckStyle: canvasDesign?.neckStyle || "round",
      sleeveStyle: canvasDesign?.sleeveStyle || "full",
      baseColor: canvasDesign?.baseColor || color,
      embroideryMetadata: canvasDesign?.embroideryMetadata || []
    };

    // Create customization object
    const customization = new customizationModel({
      userId,
      gender,
      dressType,
      fabric,
      color,
      designNotes: designNotes || "",
      referenceImages: Array.isArray(referenceImages) ? referenceImages : [],
      measurements: measurements || {
        bust: "",
        waist: "",
        hips: "",
        shoulder: "",
        sleeveLength: "",
        length: "",
        customNotes: ""
      },
      aiPrompt: aiPrompt || "",
      estimatedPrice: estimatedPrice || 0,
      canvasDesign: processedCanvasDesign,
      status: "Draft"
    });

    // Save to database
    await customization.save();

    return res.status(201).json({
      success: true,
      message: "Customization saved successfully",
      customization: customization,
      _id: customization._id
    });

  } catch (error) {
    console.error("Customization Save Error:", error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later."
    });
  }
};

// GET SINGLE CUSTOMIZATION FOR REVIEW
const getCustomization = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId;

    // Validate userId
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    // Validate customization ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customization ID"
      });
    }

    const customization = await customizationModel.findById(id);

    if (!customization) {
      return res.status(404).json({
        success: false,
        message: "Customization not found"
      });
    }

    // Check if user owns this customization
    if (customization.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to this customization"
      });
    }

    res.json({
      success: true,
      customization
    });

  } catch (error) {
    console.error("Get Customization Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later."
    });
  }
};

// GET ALL USER CUSTOMIZATIONS
const getUserCustomizations = async (req, res) => {
  try {
    // Get userId from request body
    const { userId } = req.body;

    // Validate userId
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login."
      });
    }

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format"
      });
    }

    // Fetch customizations
    const customizations = await customizationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      customizations: customizations || [],
      count: customizations.length
    });

  } catch (error) {
    console.error("Get User Customizations Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching customizations",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// UPDATE CUSTOMIZATION
const updateCustomization = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId;

    // Validate authentication
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    // Validate customization ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customization ID"
      });
    }

    const customization = await customizationModel.findById(id);

    if (!customization) {
      return res.status(404).json({
        success: false,
        message: "Customization not found"
      });
    }

    // Verify ownership
    if (customization.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this customization"
      });
    }

    // Don't allow updates to certain fields
    const updateData = { ...req.body };
    delete updateData.userId;
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.__v;

    // Process canvasDesign if provided
    if (updateData.canvasDesign) {
      updateData.canvasDesign = {
        svg: updateData.canvasDesign.svg || customization.canvasDesign.svg,
        png: updateData.canvasDesign.png || customization.canvasDesign.png,
        zoneColors: updateData.canvasDesign.zoneColors || customization.canvasDesign.zoneColors,
        zonePatterns: updateData.canvasDesign.zonePatterns || customization.canvasDesign.zonePatterns,
        neckStyle: updateData.canvasDesign.neckStyle || customization.canvasDesign.neckStyle,
        sleeveStyle: updateData.canvasDesign.sleeveStyle || customization.canvasDesign.sleeveStyle,
        baseColor: updateData.canvasDesign.baseColor || customization.canvasDesign.baseColor,
        embroideryMetadata: updateData.canvasDesign.embroideryMetadata || customization.canvasDesign.embroideryMetadata
      };
    }

    // Update customization
    const updated = await customizationModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Customization updated successfully",
      customization: updated
    });

  } catch (error) {
    console.error("Update Customization Error:", error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error. Please try again later."
    });
  }
};

// AI CANVAS EDITING
const aiEditCanvas = async (req, res) => {
  try {
    const { editPrompt, currentDesign, systemPrompt } = req.body;
    const userId = req.body.userId;

    // Validate authentication
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    if (!editPrompt || !currentDesign) {
      return res.status(400).json({
        success: false,
        message: "Edit prompt and current design are required"
      });
    }

    // Color name to hex mapping
    const colorMap = {
      'red': '#FF0000',
      'blue': '#0000FF',
      'green': '#00FF00',
      'yellow': '#FFFF00',
      'orange': '#FFA500',
      'purple': '#800080',
      'pink': '#FFC0CB',
      'brown': '#A52A2A',
      'black': '#000000',
      'white': '#FFFFFF',
      'gray': '#808080',
      'grey': '#808080',
      'maroon': '#800000',
      'navy': '#000080',
      'gold': '#FFD700',
      'silver': '#C0C0C0',
      'beige': '#F5F5DC',
      'ivory': '#FFFFF0',
      'teal': '#008080',
      'turquoise': '#40E0D0',
      'lavender': '#E6E6FA',
      'magenta': '#FF00FF',
      'olive': '#808000',
      'coral': '#FF7F50',
      'peach': '#FFDAB9',
      'mint': '#98FF98',
      'cream': '#FFFDD0',
      'burgundy': '#800020',
      'mustard': '#FFDB58',
      'emerald': '#50C878'
    };

    // AI logic for pattern matching
    const parseEditRequest = (prompt, design) => {
      const lowerPrompt = prompt.toLowerCase();
      const modifications = {
        sleeveStyle: null,
        neckStyle: null,
        baseColor: null,
        zoneColors: {},
        applyEmbroidery: null,
        applyPrint: null,
        removeFromZones: []
      };

      let explanation = "Applied changes: ";
      const explanationParts = [];

      // Sleeve modifications
      if (lowerPrompt.includes('full sleeve') || lowerPrompt.includes('long sleeve')) {
        modifications.sleeveStyle = 'full';
        explanationParts.push('Changed to full sleeves');
      } else if (lowerPrompt.includes('half sleeve') || lowerPrompt.includes('elbow') || lowerPrompt.includes('3/4')) {
        modifications.sleeveStyle = 'elbow';
        explanationParts.push('Changed to 3/4 length sleeves');
      } else if (lowerPrompt.includes('short sleeve')) {
        modifications.sleeveStyle = 'short';
        explanationParts.push('Changed to short sleeves');
      } else if (lowerPrompt.includes('sleeveless') || lowerPrompt.includes('no sleeve')) {
        modifications.sleeveStyle = 'sleeveless';
        explanationParts.push('Removed sleeves');
      }

      // Color modifications
      for (const [colorName, hexCode] of Object.entries(colorMap)) {
        if (lowerPrompt.includes(colorName)) {
          // Check for zone-specific color changes
          if (lowerPrompt.includes('body')) {
            modifications.zoneColors.body = hexCode;
            explanationParts.push(`Changed body to ${colorName}`);
          }
          if (lowerPrompt.includes('sleeve')) {
            modifications.zoneColors.sleeve_left = hexCode;
            modifications.zoneColors.sleeve_right = hexCode;
            explanationParts.push(`Changed sleeves to ${colorName}`);
          }
          if (lowerPrompt.includes('collar') || lowerPrompt.includes('neck')) {
            if (design.availableZones.some(z => z.id.includes('collar'))) {
              modifications.zoneColors.collar = hexCode;
            } else if (design.availableZones.some(z => z.id.includes('neckline'))) {
              modifications.zoneColors.neckline = hexCode;
            }
            explanationParts.push(`Changed neckline to ${colorName}`);
          }
          // If no zone specified, apply to base color
          if (!lowerPrompt.includes('body') && !lowerPrompt.includes('sleeve') &&
            !lowerPrompt.includes('collar') && !lowerPrompt.includes('neck')) {
            modifications.baseColor = hexCode;
            explanationParts.push(`Changed base color to ${colorName}`);
          }
        }
      }

      // Embroidery modifications
      if (lowerPrompt.includes('maggam')) {
        const zones = [];
        if (lowerPrompt.includes('body')) zones.push('body');
        if (lowerPrompt.includes('sleeve')) zones.push('sleeve_left', 'sleeve_right');
        if (lowerPrompt.includes('collar') || lowerPrompt.includes('neck')) {
          if (design.availableZones.some(z => z.id.includes('collar'))) {
            zones.push('collar');
          } else if (design.availableZones.some(z => z.id.includes('neckline'))) {
            zones.push('neckline');
          }
        }
        if (zones.length === 0) zones.push('body');
        modifications.applyEmbroidery = { zones, pattern: 'maggam' };
        explanationParts.push(`Added Maggam embroidery to ${zones.join(', ')}`);
      } else if (lowerPrompt.includes('thread work') || lowerPrompt.includes('embroidery')) {
        const zones = [];
        if (lowerPrompt.includes('body')) zones.push('body');
        if (lowerPrompt.includes('sleeve')) zones.push('sleeve_left', 'sleeve_right');
        if (zones.length === 0) zones.push('body');
        modifications.applyEmbroidery = { zones, pattern: 'threadWork' };
        explanationParts.push(`Added thread work to ${zones.join(', ')}`);
      } else if (lowerPrompt.includes('sequin')) {
        const zones = [];
        if (lowerPrompt.includes('body')) zones.push('body');
        if (lowerPrompt.includes('sleeve')) zones.push('sleeve_left', 'sleeve_right');
        if (zones.length === 0) zones.push('body');
        modifications.applyEmbroidery = { zones, pattern: 'sequins' };
        explanationParts.push(`Added sequins to ${zones.join(', ')}`);
      } else if (lowerPrompt.includes('bead')) {
        const zones = [];
        if (lowerPrompt.includes('body')) zones.push('body');
        if (lowerPrompt.includes('sleeve')) zones.push('sleeve_left', 'sleeve_right');
        if (zones.length === 0) zones.push('body');
        modifications.applyEmbroidery = { zones, pattern: 'beadwork' };
        explanationParts.push(`Added beadwork to ${zones.join(', ')}`);
      }

      // Print modifications
      if (lowerPrompt.includes('floral')) {
        const zones = [];
        if (lowerPrompt.includes('entire') || lowerPrompt.includes('whole') || lowerPrompt.includes('all')) {
          zones.push(...design.availableZones.map(z => z.id));
        } else if (lowerPrompt.includes('body')) {
          zones.push('body');
        } else if (lowerPrompt.includes('sleeve')) {
          zones.push('sleeve_left', 'sleeve_right');
        }
        if (zones.length === 0) zones.push('body');
        modifications.applyPrint = { zones, print: 'floral' };
        explanationParts.push(`Added floral print to ${zones.join(', ')}`);
      } else if (lowerPrompt.includes('block')) {
        const zones = lowerPrompt.includes('entire') ? design.availableZones.map(z => z.id) : ['body'];
        modifications.applyPrint = { zones, print: 'block' };
        explanationParts.push(`Added block print to ${zones.join(', ')}`);
      } else if (lowerPrompt.includes('bagru')) {
        const zones = lowerPrompt.includes('entire') ? design.availableZones.map(z => z.id) : ['body'];
        modifications.applyPrint = { zones, print: 'bagru' };
        explanationParts.push(`Added bagru print to ${zones.join(', ')}`);
      } else if (lowerPrompt.includes('kalamkari')) {
        const zones = lowerPrompt.includes('entire') ? design.availableZones.map(z => z.id) : ['body'];
        modifications.applyPrint = { zones, print: 'kalamkari' };
        explanationParts.push(`Added kalamkari print to ${zones.join(', ')}`);
      } else if (lowerPrompt.includes('shibori')) {
        const zones = lowerPrompt.includes('entire') ? design.availableZones.map(z => z.id) : ['body'];
        modifications.applyPrint = { zones, print: 'shibori' };
        explanationParts.push(`Added shibori print to ${zones.join(', ')}`);
      }

      // Remove/clear modifications
      if (lowerPrompt.includes('remove') || lowerPrompt.includes('clear')) {
        if (lowerPrompt.includes('embroidery') || lowerPrompt.includes('print')) {
          modifications.removeFromZones = design.availableZones.map(z => z.id);
          explanationParts.push('Removed all embroidery and prints');
        }
      }

      explanation += explanationParts.join(', ') || 'No changes made';

      return { modifications, explanation };
    };

    const result = parseEditRequest(editPrompt, currentDesign);

    res.json({
      success: true,
      modifications: result.modifications,
      explanation: result.explanation
    });

  } catch (error) {
    console.error("AI Edit Canvas Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later."
    });
  }
};

// SUBMIT CUSTOMIZATION
const submitCustomization = async (req, res) => {
  try {
    const { customizationId } = req.body;
    const userId = req.body.userId;

    // Validate authentication
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    // Validate customizationId
    if (!customizationId) {
      return res.status(400).json({
        success: false,
        message: "Customization ID is required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(customizationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customization ID"
      });
    }

    const customization = await customizationModel.findById(customizationId);

    if (!customization) {
      return res.status(404).json({
        success: false,
        message: "Customization not found"
      });
    }

    // Verify ownership
    if (customization.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to submit this customization"
      });
    }

    // Check if already submitted
    if (customization.status !== "Draft") {
      return res.status(400).json({
        success: false,
        message: `Cannot submit customization with status: ${customization.status}`
      });
    }

    // Update status
    customization.status = "Submitted";
    await customization.save();

    res.json({
      success: true,
      message: "Customization submitted successfully",
      customization
    });

  } catch (error) {
    console.error("Submit Customization Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later."
    });
  }
};

// DELETE CUSTOMIZATION
const deleteCustomization = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId;

    // Validate authentication
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    // Validate customization ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customization ID"
      });
    }

    const customization = await customizationModel.findById(id);

    if (!customization) {
      return res.status(404).json({
        success: false,
        message: "Customization not found"
      });
    }

    // Verify ownership
    if (customization.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this customization"
      });
    }

    // Prevent deletion of customizations in certain statuses
    if (["In Production", "Ready", "Delivered"].includes(customization.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete customization with status: ${customization.status}`
      });
    }

    await customizationModel.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Customization deleted successfully"
    });

  } catch (error) {
    console.error("Delete Customization Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later."
    });
  }
};

// ============================================================================
// ADMIN FUNCTIONS
// ============================================================================

// GET ALL CUSTOMIZATIONS (ADMIN ONLY)
const getAllCustomizationsAdmin = async (req, res) => {
  try {
    // Fetch all customizations with user details populated
    const customizations = await customizationModel
      .find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      customizations: customizations || [],
      count: customizations.length
    });

  } catch (error) {
    console.error("Get All Customizations Admin Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching customizations",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// UPDATE CUSTOMIZATION STATUS (ADMIN ONLY)
const updateCustomizationStatusAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate customization ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customization ID"
      });
    }

    // Validate status
    const validStatuses = ["Draft", "Submitted", "In Review", "In Production", "Ready", "Delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const customization = await customizationModel.findById(id);

    if (!customization) {
      return res.status(404).json({
        success: false,
        message: "Customization not found"
      });
    }

    // Update status
    customization.status = status;
    await customization.save();

    res.json({
      success: true,
      message: "Status updated successfully",
      customization
    });

  } catch (error) {
    console.error("Update Customization Status Admin Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later."
    });
  }
};

export { saveCustomization, getCustomization, updateCustomization, getUserCustomizations, submitCustomization, deleteCustomization, aiEditCanvas, getAllCustomizationsAdmin, updateCustomizationStatusAdmin };