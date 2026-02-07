import customizationModel from "../models/CustomizationModel.js";
import userModel from "../models/UserModel.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from 'cloudinary';

// Helper function to upload base64 to Cloudinary
const uploadToCloudinary = async (base64Data, folder = 'customizations') => {
  try {
    if (!base64Data || typeof base64Data !== 'string') {
      return null;
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64Data, {
      folder: folder,
      resource_type: 'auto',
      quality: 'auto:good',
      format: 'png'
    });

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return null;
  }
};

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
      estimatedPrice,
      aiGeneratedDesign
    } = req.body;

    const userId = req.body.userId;

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

    if (!["Men", "Women"].includes(gender)) {
      return res.status(400).json({
        success: false,
        message: "Gender must be either 'Men' or 'Women'"
      });
    }

    // Upload PNG design to Cloudinary if exists
    let designImageUrl = null;
    if (canvasDesign?.png) {
      console.log('Uploading design PNG to Cloudinary...');
      designImageUrl = await uploadToCloudinary(
        canvasDesign.png,
        `customizations/${userId}`
      );
      console.log('Design image uploaded:', designImageUrl ? 'Success' : 'Failed');
    }

    // Upload reference images to Cloudinary
    let uploadedReferenceImages = [];
    if (Array.isArray(referenceImages) && referenceImages.length > 0) {
      console.log(`Uploading ${referenceImages.length} reference images...`);

      const uploadPromises = referenceImages.map(async (imgBase64, index) => {
        const url = await uploadToCloudinary(
          imgBase64,
          `customizations/${userId}/references`
        );
        return url;
      });

      const results = await Promise.all(uploadPromises);
      uploadedReferenceImages = results.filter(url => url !== null);
      console.log(`Uploaded ${uploadedReferenceImages.length}/${referenceImages.length} reference images`);
    }

    // NEW: Process uploaded prints
    let uploadedPrintsUrls = [];
    if (Array.isArray(canvasDesign?.uploadedPrints) && canvasDesign.uploadedPrints.length > 0) {
      console.log(`Uploading ${canvasDesign.uploadedPrints.length} custom prints...`);

      const printUploadPromises = canvasDesign.uploadedPrints.map(async (print) => {
        const url = await uploadToCloudinary(
          print.base64,
          `customizations/${userId}/prints`
        );
        return {
          id: print.id,
          url: url,
          zoneName: print.zoneName,
          zone: print.zone,
          fitOption: print.fitOption,
          repeat: print.repeat,
          uploadedAt: print.uploadedAt
        };
      });

      const results = await Promise.all(printUploadPromises);
      uploadedPrintsUrls = results.filter(item => item.url !== null);
      console.log(`Uploaded ${uploadedPrintsUrls.length}/${canvasDesign.uploadedPrints.length} custom prints`);
    }

    // NEW: Process uploaded embroidery
    let uploadedEmbroideryUrls = [];
    if (Array.isArray(canvasDesign?.uploadedEmbroidery) && canvasDesign.uploadedEmbroidery.length > 0) {
      console.log(`Uploading ${canvasDesign.uploadedEmbroidery.length} custom embroidery designs...`);

      const embroideryUploadPromises = canvasDesign.uploadedEmbroidery.map(async (embroidery) => {
        const url = await uploadToCloudinary(
          embroidery.base64,
          `customizations/${userId}/embroidery`
        );
        return {
          id: embroidery.id,
          url: url,
          zoneName: embroidery.zoneName,
          zone: embroidery.zone,
          threadColor: embroidery.threadColor,
          uploadedAt: embroidery.uploadedAt
        };
      });

      const results = await Promise.all(embroideryUploadPromises);
      uploadedEmbroideryUrls = results.filter(item => item.url !== null);
      console.log(`Uploaded ${uploadedEmbroideryUrls.length}/${canvasDesign.uploadedEmbroidery.length} custom embroidery designs`);
    }

    // Process canvas design data
    const processedCanvasDesign = {
      svg: canvasDesign?.svg || "",
      pngUrl: designImageUrl || "",
      zoneColors: canvasDesign?.zoneColors || {},
      zonePatterns: canvasDesign?.zonePatterns || {},
      sleeveStyle: canvasDesign?.sleeveStyle || "full",
      baseColor: canvasDesign?.baseColor || color,
      embroideryMetadata: Array.isArray(canvasDesign?.embroideryMetadata)
        ? canvasDesign.embroideryMetadata
        : [],
      printMetadata: Array.isArray(canvasDesign?.printMetadata)
        ? canvasDesign.printMetadata
        : [],
      // NEW: Add uploaded assets
      uploadedPrints: uploadedPrintsUrls,
      uploadedEmbroidery: uploadedEmbroideryUrls
    };

    // Create customization document
    const customization = new customizationModel({
      userId,
      gender,
      dressType,
      fabric,
      color,
      designNotes: designNotes || "",
      referenceImages: uploadedReferenceImages,
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
      aiGeneratedDesign: aiGeneratedDesign || null,
      status: "Draft"
    });

    await customization.save();

    console.log('Customization saved successfully:', customization._id);

    return res.status(201).json({
      success: true,
      message: "Customization saved successfully",
      customization: customization,
      _id: customization._id,
      uploadStats: {
        designImage: designImageUrl ? 'uploaded' : 'none',
        referenceImages: uploadedReferenceImages.length,
        customPrints: uploadedPrintsUrls.length,
        customEmbroidery: uploadedEmbroideryUrls.length
      }
    });

  } catch (error) {
    console.error("Customization Save Error:", error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET SINGLE CUSTOMIZATION
const getCustomization = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

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
    const userId = req.body.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login."
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format"
      });
    }

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

// UPDATE CUSTOMIZATION - WITH UPLOADED ASSETS
const updateCustomization = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

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

    if (customization.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this customization"
      });
    }

    const updateData = { ...req.body };
    delete updateData.userId;
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.__v;

    // Handle canvas design update with new PNG
    if (updateData.canvasDesign) {
      let designImageUrl = customization.canvasDesign?.pngUrl;

      // Upload new PNG if provided
      if (updateData.canvasDesign.png) {
        console.log('Uploading updated design PNG...');
        const newUrl = await uploadToCloudinary(
          updateData.canvasDesign.png,
          `customizations/${userId}`
        );
        if (newUrl) {
          designImageUrl = newUrl;
        }
      }

      // NEW: Handle uploaded prints update
      let uploadedPrintsUrls = customization.canvasDesign?.uploadedPrints || [];
      if (Array.isArray(updateData.canvasDesign.uploadedPrints)) {
        const newPrints = updateData.canvasDesign.uploadedPrints.filter(
          p => !uploadedPrintsUrls.find(existing => existing.id === p.id)
        );

        if (newPrints.length > 0) {
          const printUploadPromises = newPrints.map(async (print) => {
            const url = await uploadToCloudinary(
              print.base64,
              `customizations/${userId}/prints`
            );
            return {
              id: print.id,
              url: url,
              zoneName: print.zoneName,
              zone: print.zone,
              fitOption: print.fitOption,
              repeat: print.repeat,
              uploadedAt: print.uploadedAt
            };
          });

          const results = await Promise.all(printUploadPromises);
          const validResults = results.filter(item => item.url !== null);
          uploadedPrintsUrls = [...uploadedPrintsUrls, ...validResults];
        }
      }

      // NEW: Handle uploaded embroidery update
      let uploadedEmbroideryUrls = customization.canvasDesign?.uploadedEmbroidery || [];
      if (Array.isArray(updateData.canvasDesign.uploadedEmbroidery)) {
        const newEmbroidery = updateData.canvasDesign.uploadedEmbroidery.filter(
          e => !uploadedEmbroideryUrls.find(existing => existing.id === e.id)
        );

        if (newEmbroidery.length > 0) {
          const embroideryUploadPromises = newEmbroidery.map(async (embroidery) => {
            const url = await uploadToCloudinary(
              embroidery.base64,
              `customizations/${userId}/embroidery`
            );
            return {
              id: embroidery.id,
              url: url,
              zoneName: embroidery.zoneName,
              zone: embroidery.zone,
              threadColor: embroidery.threadColor,
              uploadedAt: embroidery.uploadedAt
            };
          });

          const results = await Promise.all(embroideryUploadPromises);
          const validResults = results.filter(item => item.url !== null);
          uploadedEmbroideryUrls = [...uploadedEmbroideryUrls, ...validResults];
        }
      }

      updateData.canvasDesign = {
        svg: updateData.canvasDesign.svg || customization.canvasDesign.svg,
        pngUrl: designImageUrl,
        zoneColors: updateData.canvasDesign.zoneColors || customization.canvasDesign.zoneColors,
        zonePatterns: updateData.canvasDesign.zonePatterns || customization.canvasDesign.zonePatterns,
        sleeveStyle: updateData.canvasDesign.sleeveStyle || customization.canvasDesign.sleeveStyle,
        baseColor: updateData.canvasDesign.baseColor || customization.canvasDesign.baseColor,
        embroideryMetadata: updateData.canvasDesign.embroideryMetadata || customization.canvasDesign.embroideryMetadata,
        printMetadata: updateData.canvasDesign.printMetadata || customization.canvasDesign.printMetadata,
        uploadedPrints: uploadedPrintsUrls,
        uploadedEmbroidery: uploadedEmbroideryUrls
      };
    }

    // Handle reference images update
    if (updateData.referenceImages && Array.isArray(updateData.referenceImages)) {
      const uploadedRefs = [];

      for (const img of updateData.referenceImages) {
        // If it's already a URL, keep it
        if (img.startsWith('http')) {
          uploadedRefs.push(img);
        } else {
          // Upload new base64 image
          const url = await uploadToCloudinary(img, `customizations/${userId}/references`);
          if (url) {
            uploadedRefs.push(url);
          }
        }
      }

      updateData.referenceImages = uploadedRefs;
    }

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
    const { customizationId, userId } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    if (!customizationId || !mongoose.Types.ObjectId.isValid(customizationId)) {
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

    if (customization.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to submit this customization"
      });
    }

    if (customization.status !== "Draft") {
      return res.status(400).json({
        success: false,
        message: `Cannot submit customization with status: ${customization.status}`
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

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

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

    if (customization.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this customization"
      });
    }

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

// ADMIN FUNCTIONS
const getAllCustomizationsAdmin = async (req, res) => {
  try {
    const customizations = await customizationModel
      .find()
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
      message: "Server error while fetching customizations"
    });
  }
};

const updateCustomizationStatusAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customization ID"
      });
    }

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

export { saveCustomization, getCustomization, updateCustomization, getUserCustomizations, submitCustomization, deleteCustomization, getAllCustomizationsAdmin, updateCustomizationStatusAdmin };