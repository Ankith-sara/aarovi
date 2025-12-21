import customizationModel from "../models/CustomizationModel.js";

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
      canvasDesign
    } = req.body;

    const userId = req.body.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    if (!gender || !dressType || !fabric || !color) {
      return res.status(400).json({
        success: false,
        message: "Gender, dressType, fabric, and color are required"
      });
    }

    const customization = new customizationModel({
      userId,
      gender,
      dressType,
      fabric,
      color,
      designNotes: designNotes || "",
      referenceImages: referenceImages || [],
      measurements: measurements || {},
      aiPrompt: aiPrompt || "",
      estimatedPrice: 0, // Will be set by admin
      canvasDesign: canvasDesign || {},
      status: "Draft"
    });

    await customization.save();

    return res.json({
      success: true,
      message: "Customization saved successfully",
      customization: customization
    });

  } catch (error) {
    console.log("Customization Save Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET CUSTOMIZATION FOR REVIEW
const getCustomization = async (req, res) => {
  try {
    const { id } = req.params;

    const customization = await customizationModel.findById(id);

    if (!customization) {
      return res.status(404).json({
        success: false,
        message: "Customization not found"
      });
    }

    res.json({ success: true, customization });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL USER CUSTOMIZATIONS
const getUserCustomizations = async (req, res) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const customizations = await customizationModel
      .find({ userId })
      .sort({ createdAt: -1 });

    res.json({ success: true, customizations });

  } catch (error) {
    console.log("Get User Customizations Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE CUSTOMIZATION WHEN USER EDITS
const updateCustomization = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId;

    const customization = await customizationModel.findById(id);

    if (!customization) {
      return res.status(404).json({
        success: false,
        message: "Customization not found"
      });
    }

    if (customization.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const updated = await customizationModel.findByIdAndUpdate(
      id,
      { ...req.body, userId },
      { new: true }
    );

    res.json({
      success: true,
      message: "Customization updated",
      customization: updated
    });

  } catch (error) {
    console.log("Update Customization Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// SUBMIT CUSTOMIZATION
const submitCustomization = async (req, res) => {
  try {
    const { customizationId } = req.body;
    const userId = req.body.userId;

    if (!customizationId) {
      return res.status(400).json({
        success: false,
        message: "Customization ID is required"
      });
    }

    const customization = await customizationModel.findById(customizationId);

    if (!customization) {
      return res.status(404).json({
        success: false,
        message: "Customization not found"
      });
    }

    if (customization.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    customization.status = "Submitted";
    await customization.save();

    res.json({
      success: true,
      message: "Customization submitted successfully",
      customization
    });

  } catch (error) {
    console.log("Submit Customization Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE CUSTOMIZATION
const deleteCustomization = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId;

    const customization = await customizationModel.findById(id);

    if (!customization) {
      return res.status(404).json({
        success: false,
        message: "Customization not found"
      });
    }

    if (customization.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    await customizationModel.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Customization deleted successfully"
    });

  } catch (error) {
    console.log("Delete Customization Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { saveCustomization, getCustomization, updateCustomization, getUserCustomizations, submitCustomization, deleteCustomization };