import userModel from "../models/UserModel.js";
import customizationModel from "../models/CustomizationModel.js";
import mongoose from "mongoose";

// Add product to cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity = 1 } = req.body;

    if (!userId || !itemId || !size) {
      return res.status(400).json({
        success: false,
        message: "userId, itemId, and size are required"
      });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    if (cartData[itemId]) {
      cartData[itemId][size] = (cartData[itemId][size] || 0) + quantity;
    } else {
      cartData[itemId] = { [size]: quantity };
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Product added to cart", cartData });
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update product quantity in cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;

    if (!userId || !itemId || !size || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "userId, itemId, size and quantity are required"
      });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    if (quantity === 0) {
      if (cartData[itemId]) {
        delete cartData[itemId][size];
        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      }
    } else {
      if (!cartData[itemId]) cartData[itemId] = {};
      cartData[itemId][size] = quantity;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Cart updated", cartData });
  } catch (error) {
    console.error("Error in updateCart:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user cart data
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};
    res.json({ success: true, cartData });
  } catch (error) {
    console.error("Error in getUserCart:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;

    if (!userId || !itemId || !size) {
      return res.status(400).json({
        success: false,
        message: "userId, itemId, and size are required"
      });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    if (cartData[itemId] && cartData[itemId][size]) {
      delete cartData[itemId][size];

      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Item removed from cart", cartData });
  } catch (error) {
    console.error("Error in removeFromCart:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    res.json({ success: true, message: "Cart cleared" });
  } catch (error) {
    console.error("Error in clearCart:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const addCustomToCart = async (req, res) => {
  try {
    const { userId, customizationId } = req.body;

    if (!userId || !customizationId) {
      return res.status(400).json({
        success: false,
        message: "userId and customizationId are required"
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
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
        message: "Unauthorized access to this customization"
      });
    }

    let cartData = user.cartData || {};

    if (!cartData.customizations) {
      cartData.customizations = {};
    }

    if (cartData.customizations[customizationId]) {
      cartData.customizations[customizationId].quantity += 1;
    } else {
      // ✅ SIMPLIFIED: Only essential info + final product image
      cartData.customizations[customizationId] = {
        price: customization.estimatedPrice || 0,
        quantity: 1,
        snapshot: {
          gender: customization.gender,
          dressType: customization.dressType,
          fabric: customization.fabric,
          color: customization.color,
          productImage: customization.canvasDesign?.png || '',  // ✅ Just the PNG
          designNotes: customization.designNotes || '',
          createdAt: customization.createdAt
        }
      };
    }

    // Mark nested object as modified
    user.markModified('cartData');
    await user.save();

    res.json({
      success: true,
      message: "Customization added to cart",
      cartData
    });
  } catch (error) {
    console.error("Error in addCustomToCart:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update custom item quantity
const updateCustomCart = async (req, res) => {
  try {
    const { userId, customizationId, quantity } = req.body;

    if (!userId || !customizationId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "userId, customizationId, and quantity are required"
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = user.cartData || {};

    if (quantity === 0) {
      if (cartData.customizations && cartData.customizations[customizationId]) {
        delete cartData.customizations[customizationId];

        if (Object.keys(cartData.customizations).length === 0) {
          delete cartData.customizations;
        }
      }
    } else {
      if (cartData.customizations && cartData.customizations[customizationId]) {
        cartData.customizations[customizationId].quantity = quantity;
      }
    }

    // ✅ Use markModified
    user.markModified('cartData');
    await user.save();

    res.json({ success: true, message: "Cart updated", cartData });
  } catch (error) {
    console.error("Error in updateCustomCart:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove custom item from cart
const removeCustomFromCart = async (req, res) => {
  try {
    const { userId, customizationId } = req.body;

    if (!userId || !customizationId) {
      return res.status(400).json({
        success: false,
        message: "userId and customizationId are required"
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = user.cartData || {};

    if (cartData.customizations && cartData.customizations[customizationId]) {
      delete cartData.customizations[customizationId];
      if (Object.keys(cartData.customizations).length === 0) {
        delete cartData.customizations;
      }
    }

    // ✅ Use markModified
    user.markModified('cartData');
    await user.save();

    res.json({
      success: true,
      message: "Customization removed from cart",
      cartData
    });
  } catch (error) {
    console.error("Error in removeCustomFromCart:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart, removeFromCart, clearCart, addCustomToCart, updateCustomCart, removeCustomFromCart };