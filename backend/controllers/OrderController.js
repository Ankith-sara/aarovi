import orderModel from "../models/OrderModel.js";
import userModel from "../models/UserModel.js";
import productModel from "../models/ProductModal.js"
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import sendOrderEmails from "../middlewares/sendOrderMail.js";
import sendOrderWhatsApp from "../middlewares/sendOrderWhatsapp.js";
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

  try {
    await sendOrderWhatsApp(order, user);
  } catch (whatsappError) {
    console.error('WhatsApp sending failed:', whatsappError);
  }
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

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now()
    }

    const newOrder = new orderModel(orderData);
    await newOrder.save();

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

// Verify COD Order (for consistency in verification flow)
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

    // Create order data first
    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now()
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Create Razorpay order
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

    // If only orderId is provided (from verify page redirect)
    if (orderId && !razorpay_payment_id) {
      const order = await orderModel.findById(orderId);
      
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }

      // Check if already verified
      if (order.payment) {
        return res.json({
          success: true,
          message: "Payment already verified",
          order: order
        });
      }

      // If payment not verified yet, return pending status
      return res.json({
        success: false,
        message: "Payment verification pending"
      });
    }

    // Full verification with payment details
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

    // Update order payment status
    await orderModel.findByIdAndUpdate(orderId, { payment: true });
    await userModel.findByIdAndUpdate(order.userId, { cartData: {} });

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

// All orders
const allOrders = async (req, res) => {
  try {
    const adminId = req.user.id;
    const adminProducts = await productModel.find({ adminId: adminId }).select('_id');
    const adminProductIds = adminProducts.map(p => p._id);
    const orders = await orderModel.find({ 'items.productId': { $in: adminProductIds } })
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
    const orders = await orderModel.find({ userId })
    res.json({ success: true, orders })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Update orders status
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body
    await orderModel.findByIdAndUpdate(orderId, { status })
    res.json({ success: true, message: "Order status updated" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

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

export { verifyRazorpay, verifyCOD,placeOrder, placeOrderRazorpay, allOrders, userOrders, updateStatus, orderStatus };