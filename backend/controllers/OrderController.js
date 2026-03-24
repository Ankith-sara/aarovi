import orderModel from "../models/OrderModel.js";
import userModel from "../models/UserModel.js";
import productModel from "../models/ProductModel.js"
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

const sendOrderNotifications = async (order, user) => {
  try {
    await sendOrderEmails(order, user);
  } catch (emailError) {
    console.error('Email sending failed:', emailError);
  }
};

const validateTransactionId = (transactionId) => {
  if (!transactionId || typeof transactionId !== 'string') {
    return { valid: false, error: 'Transaction ID is required' };
  }
  const trimmedId = transactionId.trim();
  if (trimmedId.length === 0)  return { valid: false, error: 'Transaction ID cannot be empty' };
  if (trimmedId.length < 8)    return { valid: false, error: 'Transaction ID must be at least 8 characters long' };
  if (trimmedId.length > 50)   return { valid: false, error: 'Transaction ID is too long (max 50 characters)' };
  const validPattern = /^[A-Za-z0-9\-_./]+$/;
  if (!validPattern.test(trimmedId)) {
    return { valid: false, error: 'Transaction ID contains invalid characters. Only letters, numbers, and -_. are allowed' };
  }
  return { valid: true, transactionId: trimmedId };
};

// ── Process order items ──────────────────────────────────────────────────────
// Handles both READY_MADE (regular products) and CUSTOM (design studio) items.
// READY_MADE items now carry neckStyle, sleeveStyle, and specialInstructions
// so that style customisations chosen on the Product page are persisted to the
// order document and visible in the admin panel and user order history.
const processOrderItems = (items) => {
  return items.map(item => {
    if (item.type === 'customization') {
      // ── Custom design studio order ───────────────────────────────────────
      return {
        type: 'CUSTOM',
        name: `Custom ${item.gender || ''}'s ${item.dressType || 'Design'}`,
        quantity: item.quantity || 1,
        basePrice: item.price || 0,
        finalPrice: item.price || 0,
        customization: {
          customizationId: item._id,
          gender: item.gender || '',
          dressType: item.dressType || '',
          fabric: item.fabric || '',
          color: item.color || '',
          size: item.size || '',                     // ← XS–XXXL from form
          neckStyle: item.neckStyle || '',
          sleeveStyle: item.canvasDesign?.sleeveStyle || item.sleeveStyle || '',
          specialInstructions: item.specialInstructions || '',
          canvasDesign: {
            svg: item.canvasDesign?.svg || '',
            pngUrl: item.canvasDesign?.pngUrl || item.canvasDesign?.png || '',
            zoneColors: item.canvasDesign?.zoneColors || {},
            zonePatterns: item.canvasDesign?.zonePatterns || {},
            sleeveStyle: item.canvasDesign?.sleeveStyle || '',
            baseColor: item.canvasDesign?.baseColor || item.color || '',
            embroideryMetadata: item.canvasDesign?.embroideryMetadata || []
          },
          measurements: {
            bust: item.measurements?.bust || '',
            waist: item.measurements?.waist || '',
            hips: item.measurements?.hips || '',
            shoulder: item.measurements?.shoulder || '',
            sleeveLength: item.measurements?.sleeveLength || '',
            length: item.measurements?.length || '',
            customNotes: item.measurements?.customNotes || ''
          },
          designNotes: item.designNotes || '',
          referenceImages: item.referenceImages || [],
          aiPrompt: item.aiPrompt || ''
        },
        productionStatus: 'DESIGNING',
        image: item.canvasDesign?.pngUrl || item.canvasDesign?.png || item.image || ''
      };
    } else {
      // ── Regular ready-made product ───────────────────────────────────────
      // Preserve all style customisations the customer selected on the Product
      // page (neckStyle, sleeveStyle, specialInstructions).
      return {
        productId: item.productId || item._id,
        type: 'READY_MADE',
        name: item.name,
        quantity: item.quantity || 1,
        basePrice: item.price,
        finalPrice: item.price,
        size: item.size || '',
        image: item.images?.[0] || item.image || '',
        neckStyle: item.neckStyle || '',
        sleeveStyle: item.sleeveStyle || '',
        specialInstructions: item.specialInstructions || '',
      };
    }
  });
};

// ── COD ──────────────────────────────────────────────────────────────────────
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    if (!userId || !items || !amount || !address) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, items, amount, or address'
      });
    }

    const processedItems = processOrderItems(items);

    const orderData = {
      userId,
      items: processedItems,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now()
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    for (const item of items) {
      if (item.type === 'customization' && item._id) {
        try {
          await customizationModel.findByIdAndUpdate(item._id, { status: 'In Production' });
        } catch (err) {
          console.error('Failed to update customization status:', err);
        }
      }
    }

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    await sendOrderNotifications(newOrder, user);

    res.status(201).json({ success: true, message: "Order placed successfully", orderId: newOrder._id });

  } catch (error) {
    console.error('COD Order Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── QR Payment ───────────────────────────────────────────────────────────────
const placeOrderQR = async (req, res) => {
  try {
    const { userId, items, amount, address, transactionId } = req.body;

    if (!userId || !items || !amount || !address) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, items, amount, or address'
      });
    }

    const validation = validateTransactionId(transactionId);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.error });
    }

    const validTransactionId = validation.transactionId;

    const existingOrder = await orderModel.findOne({ paymentMethod: "QR", transactionId: validTransactionId });
    if (existingOrder) {
      return res.status(400).json({
        success: false,
        message: 'This transaction ID has already been used. Please verify your payment and ensure you entered the correct transaction ID.'
      });
    }

    const processedItems = processOrderItems(items);

    const orderData = {
      userId,
      items: processedItems,
      amount,
      address,
      paymentMethod: "QR",
      payment: true,
      transactionId: validTransactionId,
      date: Date.now()
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    for (const item of items) {
      if (item.type === 'customization' && item._id) {
        try {
          await customizationModel.findByIdAndUpdate(item._id, { status: 'In Production' });
        } catch (err) {
          console.error('Failed to update customization status:', err);
        }
      }
    }

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    await sendOrderNotifications(newOrder, user);

    res.status(201).json({ success: true, message: "Order placed successfully with QR payment", orderId: newOrder._id });

  } catch (error) {
    console.error('QR Order Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── COD Verify ───────────────────────────────────────────────────────────────
const verifyCOD = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ success: false, message: "Order ID required" });

    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (order.paymentMethod !== "COD") return res.status(400).json({ success: false, message: "Invalid payment method for this verification" });

    return res.json({ success: true, message: "COD Order confirmed", order });
  } catch (error) {
    console.error("COD verification error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── Razorpay Create Order ─────────────────────────────────────────────────────
const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    if (!amount || !userId || !items || !address) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

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
      notes: { orderId: newOrder._id.toString() }
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);
    res.json({ success: true, order: razorpayOrder, orderId: newOrder._id });

  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Razorpay Verify ───────────────────────────────────────────────────────────
const verifyRazorpay = async (req, res) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (orderId && !razorpay_payment_id) {
      const order = await orderModel.findById(orderId);
      if (!order) return res.status(404).json({ success: false, message: "Order not found" });
      if (order.payment) return res.json({ success: true, message: "Payment already verified", order });
      return res.json({ success: false, message: "Payment verification pending" });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment verification details" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    const order = await orderModel.findById(orderId);
    const user = await userModel.findById(order.userId);

    if (!order || !user) return res.status(404).json({ success: false, message: "Order or user not found" });

    await orderModel.findByIdAndUpdate(orderId, { payment: true });
    await userModel.findByIdAndUpdate(order.userId, { cartData: {} });

    for (const item of order.items) {
      if (item.type === 'CUSTOM' && item.customization?.customizationId) {
        try {
          await customizationModel.findByIdAndUpdate(item.customization.customizationId, { status: 'In Production' });
        } catch (err) {
          console.error('Failed to update customization status:', err);
        }
      }
    }

    await sendOrderNotifications(order, user);

    return res.json({ success: true, message: "Payment verified & order placed", orderId: order._id });

  } catch (error) {
    console.error("Razorpay verification error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── All orders (admin) ────────────────────────────────────────────────────────
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// ── User orders ───────────────────────────────────────────────────────────────
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId }).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// ── Update order status ───────────────────────────────────────────────────────
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    const previousStatus = order.status;
    await orderModel.findByIdAndUpdate(orderId, { status });

    const user = await userModel.findById(order.userId);
    if (user?.email) {
      const updatedOrder = await orderModel.findById(orderId);
      if (status === "Shipping" && previousStatus !== "Shipping") {
        try { await sendShippingEmail(updatedOrder, user); } catch (e) { console.error('Shipping email failed:', e); }
      }
      if (status === "Delivered" && previousStatus !== "Delivered") {
        try { await sendDeliveredEmail(updatedOrder, user); } catch (e) { console.error('Delivered email failed:', e); }
      }
    }

    res.json({ success: true, message: "Order status updated" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// ── Update production status ──────────────────────────────────────────────────
const updateProductionStatus = async (req, res) => {
  try {
    const { orderId, itemIndex, productionStatus } = req.body;

    if (!orderId || itemIndex === undefined || !productionStatus) {
      return res.status(400).json({ success: false, message: "orderId, itemIndex, and productionStatus are required" });
    }

    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (!order.items[itemIndex]) return res.status(404).json({ success: false, message: "Item not found in order" });
    if (order.items[itemIndex].type !== 'CUSTOM') {
      return res.status(400).json({ success: false, message: "Production status only applicable to custom items" });
    }

    order.items[itemIndex].productionStatus = productionStatus;
    await order.save();

    if (order.items[itemIndex].customization?.customizationId) {
      try {
        const customStatus = productionStatus === 'READY' ? 'Ready' : 'In Production';
        await customizationModel.findByIdAndUpdate(order.items[itemIndex].customization.customizationId, { status: customStatus });
      } catch (err) {
        console.error('Failed to update customization model:', err);
      }
    }

    res.json({ success: true, message: "Production status updated", order });
  } catch (error) {
    console.error("Update production status error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Order status tracking ─────────────────────────────────────────────────────
const orderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) return res.status(400).json({ success: false, message: 'Order ID is required' });
    if (!orderId.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ success: false, message: 'Invalid order ID format' });

    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    res.json({ success: true, order });
  } catch (error) {
    console.error("Order Status Tracking Error:", error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch order status' });
  }
};

export {
  verifyRazorpay, verifyCOD, placeOrder, placeOrderQR, placeOrderRazorpay,
  allOrders, userOrders, updateStatus, updateProductionStatus, orderStatus
};