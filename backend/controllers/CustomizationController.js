  import customizationModel from "../models/CustomizationModel.js";
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

      // Get userId from auth middleware (set in req.body.userId)
      const userId = req.userId;

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
        canvasDesign: canvasDesign || {
          json: "",
          svg: "",
          png: "",
          backgroundImage: ""
        },
        status: "Draft"
      });

      // Save to database
      await customization.save();

      return res.status(201).json({
        success: true,
        message: "Customization saved successfully",
        customization: customization
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
      const userId = req.userId;

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
      // Get userId from auth middleware (set in req.body.userId)
      const userId = req.userId;

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
        .lean(); // Use lean() for better performance

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
      const userId = req.userId;

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

  // SUBMIT CUSTOMIZATION
  const submitCustomization = async (req, res) => {
    try {
      const { customizationId } = req.body;
      const userId = req.userId;

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
      const userId = req.userId;

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

      // Optional: Prevent deletion of customizations in certain statuses
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

  export { saveCustomization, getCustomization, updateCustomization, getUserCustomizations, submitCustomization, deleteCustomization };