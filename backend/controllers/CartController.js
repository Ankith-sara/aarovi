import userModel from "../models/UserModel.js";
import customizationModel from "../models/CustomizationModel.js";
import mongoose from "mongoose";

// ADD TO CART
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity = 1 } = req.body;

    if (!userId || !itemId || !size) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += quantity;
      } else {
        cartData[itemId][size] = quantity;
      }
    } else {
      cartData[itemId] = { [size]: quantity };
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({
      success: true,
      message: "Added to cart",
      cartData
    });

  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// UPDATE CART
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;

    if (!userId || !itemId || !size) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};

    if (quantity === 0) {
      if (cartData[itemId]) {
        delete cartData[itemId][size];
        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      }
    } else {
      if (!cartData[itemId]) {
        cartData[itemId] = {};
      }
      cartData[itemId][size] = quantity;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({
      success: true,
      message: "Cart updated",
      cartData
    });

  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// GET USER CART
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const userData = await userModel.findById(userId);
    const cartData = userData.cartData || {};

    res.json({
      success: true,
      cartData
    });

  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// REMOVE FROM CART
const removeFromCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;

    if (!userId || !itemId || !size) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};

    if (cartData[itemId]) {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({
      success: true,
      message: "Removed from cart",
      cartData
    });

  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// CLEAR CART
const clearCart = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({
      success: true,
      message: "Cart cleared",
      cartData: {}
    });

  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// ============================================================================
// CUSTOMIZATION CART FUNCTIONS
// ============================================================================

// ADD CUSTOMIZATION TO CART
const addCustomizationToCart = async (req, res) => {
  try {
    const { customizationId, snapshot, price } = req.body;
    const userId = req.body.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Login required"
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
        message: "Unauthorized access"
      });
    }

    const user = await userModel.findById(userId);
    let cartData = user.cartData || {};

    if (!cartData.customizations) {
      cartData.customizations = {};
    }

    if (cartData.customizations[customizationId]) {
      cartData.customizations[customizationId].quantity += 1;
    } else {
      cartData.customizations[customizationId] = {
        price: price,
        quantity: 1,
        snapshot: snapshot
      };
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    return res.json({
      success: true,
      message: "Customization added to cart",
      cartData
    });

  } catch (error) {
    console.error("Add customization to cart error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// UPDATE CUSTOMIZATION QUANTITY IN CART
const updateCustomizationQuantity = async (req, res) => {
  try {
    const { customizationId, quantity } = req.body;
    const userId = req.body.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Login required"
      });
    }

    if (!customizationId || !mongoose.Types.ObjectId.isValid(customizationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customization ID"
      });
    }

    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity"
      });
    }

    const user = await userModel.findById(userId);
    let cartData = user.cartData || {};

    if (!cartData.customizations || !cartData.customizations[customizationId]) {
      return res.status(404).json({
        success: false,
        message: "Item not in cart"
      });
    }

    if (quantity === 0) {
      delete cartData.customizations[customizationId];
      if (Object.keys(cartData.customizations).length === 0) {
        delete cartData.customizations;
      }
    } else {
      cartData.customizations[customizationId].quantity = quantity;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    return res.json({
      success: true,
      message: "Cart updated",
      cartData
    });

  } catch (error) {
    console.error("Update customization quantity error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// REMOVE CUSTOMIZATION FROM CART
const removeCustomizationFromCart = async (req, res) => {
  try {
    const { customizationId } = req.body;
    const userId = req.body.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Login required"
      });
    }

    if (!customizationId || !mongoose.Types.ObjectId.isValid(customizationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customization ID"
      });
    }

    const user = await userModel.findById(userId);
    let cartData = user.cartData || {};

    if (cartData.customizations && cartData.customizations[customizationId]) {
      delete cartData.customizations[customizationId];

      if (Object.keys(cartData.customizations).length === 0) {
        delete cartData.customizations;
      }
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    return res.json({
      success: true,
      message: "Removed from cart",
      cartData
    });

  } catch (error) {
    console.error("Remove customization from cart error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export { addToCart, updateCart, getUserCart, removeFromCart, clearCart, addCustomizationToCart, updateCustomizationQuantity, removeCustomizationFromCart };