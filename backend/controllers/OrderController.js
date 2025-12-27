import orderModel from "../models/OrderModel.js";
import userModel from "../models/UserModel.js";
import productModel from "../models/ProductModal.js"
import customizationModel from "../models/CustomizationModel.js";
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import sendOrderEmails, { sendShippingEmail, sendDeliveredEmail } from "../middlewares/sendOrderMail.js";
dotenv.config();

const currency = 'inr'
const deliveryCharge = 50

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// Helper function to send notifications
const sendOrderNotifications = async (order, user) => {
  try {
    await sendOrderEmails(order, user);
  } catch (emailError) {
    console.error('Email sending failed:', emailError);
  }
};

// Helper function to process order items (UPDATED with canvas design)
const processOrderItems = (items) => {
  return items.map(item => {
    if (item.type === 'customization') {
      // Custom order item - includes full canvas design
      return {
        type: 'CUSTOM',
        name: `Custom ${item.gender}'s ${item.dressType}` || 'Custom Dress',
        quantity: item.quantity || 1,
        basePrice: item.price || 0,
        finalPrice: item.price || 0,
        customization: {
          customizationId: item._id,
          gender: item.gender,
          dressType: item.dressType,
          fabric: item.fabric,
          color: item.color,
          neckStyle: item.neckStyle || "",
          sleeveStyle: item.sleeveStyle || "",
          canvasDesign: {
            json: item.canvasDesign?.json || "",
            svg: item.canvasDesign?.svg || "",
            png: item.canvasDesign?.png || "",
            backgroundImage: item.canvasDesign?.backgroundImage || ""
          },
          measurements: {
            bust: item.measurements?.bust || "",
            waist: item.measurements?.waist || "",
            hips: item.measurements?.hips || "",
            shoulder: item.measurements?.shoulder || "",
            sleeveLength: item.measurements?.sleeveLength || "",
            length: item.measurements?.length || "",
            customNotes: item.measurements?.customNotes || ""
          },
          designNotes: item.designNotes || "",
          referenceImages: item.referenceImages || [],
          aiPrompt: item.aiPrompt || ""
        },
        productionStatus: 'DESIGNING',
        image: item.canvasDesign?.png || ""
      };
    } else {
      // Regular product item
      return {
        productId: item._id,
        type: 'READY_MADE',
        name: item.name,
        quantity: item.quantity || 1,
        basePrice: item.price,
        finalPrice: item.price,
        size: item.size,
        image: item.images?.[0] || item.image || ""
      };
    }
  });
};

// Placing orders using COD Method
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    if (!userId || !items || !amount || !address) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, items, amount, or address'
      });
    }

    // Process items (handle both regular and custom items with canvas)
    const processedItems = processOrderItems(items);

    const orderData = {
      userId,
      items: processedItems,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now()
    }

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Update customization status to "In Production" for custom items
    for (const item of items) {
      if (item.type === 'customization' && item._id) {
        try {
          await customizationModel.findByIdAndUpdate(
            item._id,
            { status: 'In Production' }
          );
        } catch (err) {
          console.error('Failed to update customization status:', err);
        }
      }
    }

    // Clear cart after order
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const user = await userModel.findById(userId);
    if (!user) {
      console.error('User not found for notifications');
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await sendOrderNotifications(newOrder, user);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: newOrder._id
    });

  } catch (error) {
    console.error('COD Order Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify COD Order
const verifyCOD = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID required"
      });
    }

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (order.paymentMethod !== "COD") {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method for this verification"
      });
    }

    return res.json({
      success: true,
      message: "COD Order confirmed",
      order: order
    });

  } catch (error) {
    console.error("COD verification error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Placing orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    if (!amount || !userId || !items || !address) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    // Process items (handle both regular and custom items with canvas)
    const processedItems = processOrderItems(items);

    const orderData = {
      userId,
      items: processedItems,
      amount,
      address,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now()
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${newOrder._id}`,
      notes: {
        orderId: newOrder._id.toString()
      }
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    res.json({
      success: true,
      order: razorpayOrder,
      orderId: newOrder._id
    });

  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify Razorpay Payment
const verifyRazorpay = async (req, res) => {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (orderId && !razorpay_payment_id) {
      const order = await orderModel.findById(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }

      if (order.payment) {
        return res.json({
          success: true,
          message: "Payment already verified",
          order: order
        });
      }

      return res.json({
        success: false,
        message: "Payment verification pending"
      });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification details"
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature"
      });
    }

    const order = await orderModel.findById(orderId);
    const user = await userModel.findById(order.userId);

    if (!order || !user) {
      return res.status(404).json({
        success: false,
        message: "Order or user not found"
      });
    }

    await orderModel.findByIdAndUpdate(orderId, { payment: true });
    await userModel.findByIdAndUpdate(order.userId, { cartData: {} });

    // Update customization status for custom items
    for (const item of order.items) {
      if (item.type === 'CUSTOM' && item.customization?.customizationId) {
        try {
          await customizationModel.findByIdAndUpdate(
            item.customization.customizationId,
            { status: 'In Production' }
          );
        } catch (err) {
          console.error('Failed to update customization status:', err);
        }
      }
    }

    await sendOrderNotifications(order, user);

    return res.json({
      success: true,
      message: "Payment verified & order placed",
      orderId: order._id,
    });

  } catch (error) {
    console.error("Razorpay verification error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// All orders for admin
const allOrders = async (req, res) => {
  try {
    const adminId = req.user.id;
    const adminProducts = await productModel.find({ adminId: adminId }).select('_id');
    const adminProductIds = adminProducts.map(p => p._id);

    // Find orders containing admin's products OR custom orders
    const orders = await orderModel.find({
      $or: [
        { 'items.productId': { $in: adminProductIds } },
        { 'items.type': 'CUSTOM' }
      ]
    }).populate('userId', 'name email').sort({ date: -1 });

    res.json({ success: true, orders })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// User order data
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId }).sort({ date: -1 });
    res.json({ success: true, orders })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Update order status
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const previousStatus = order.status;

    await orderModel.findByIdAndUpdate(orderId, { status });

    const user = await userModel.findById(order.userId);

    if (user && user.email) {
      const updatedOrder = await orderModel.findById(orderId);

      if (status === "Shipping" && previousStatus !== "Shipping") {
        try {
          await sendShippingEmail(updatedOrder, user);
          console.log(`Shipping email sent for order ${orderId}`);
        } catch (emailError) {
          console.error('Shipping email failed:', emailError);
        }
      }

      if (status === "Delivered" && previousStatus !== "Delivered") {
        try {
          await sendDeliveredEmail(updatedOrder, user);
          console.log(`Delivered email sent for order ${orderId}`);
        } catch (emailError) {
          console.error('Delivered email failed:', emailError);
        }
      }
    }

    res.json({ success: true, message: "Order status updated" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// Update production status for custom items
const updateProductionStatus = async (req, res) => {
  try {
    const { orderId, itemIndex, productionStatus } = req.body;

    if (!orderId || itemIndex === undefined || !productionStatus) {
      return res.status(400).json({
        success: false,
        message: "orderId, itemIndex, and productionStatus are required"
      });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (!order.items[itemIndex]) {
      return res.status(404).json({ success: false, message: "Item not found in order" });
    }

    if (order.items[itemIndex].type !== 'CUSTOM') {
      return res.status(400).json({
        success: false,
        message: "Production status only applicable to custom items"
      });
    }

    order.items[itemIndex].productionStatus = productionStatus;
    await order.save();

    // Update customization model status as well
    if (order.items[itemIndex].customization?.customizationId) {
      try {
        let customStatus = 'In Production';
        if (productionStatus === 'READY') {
          customStatus = 'Ready';
        }

        await customizationModel.findByIdAndUpdate(
          order.items[itemIndex].customization.customizationId,
          { status: customStatus }
        );
      } catch (err) {
        console.error('Failed to update customization model:', err);
      }
    }

    res.json({
      success: true,
      message: "Production status updated",
      order
    });

  } catch (error) {
    console.error("Update production status error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get order status
const orderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (e) {
    console.error("Tracking Error:", e.message);
    res.status(500).json({ success: false, message: e.message });
  }
};

export { verifyRazorpay, verifyCOD, placeOrder, placeOrderRazorpay, allOrders, userOrders, updateStatus, updateProductionStatus, orderStatus };