import orderModel from '../models/OrderModel.js';
import userModel from '../models/UserModel.js';

export const getUserOrders = (userId) =>
    orderModel.find({ userId }).sort({ date: -1 });

export const getAllOrders = (filters = {}) =>
    orderModel.find(filters).sort({ date: -1 });

export const getOrderById = (orderId) =>
    orderModel.findById(orderId);

export const updateOrderStatus = async (orderId, status) => {
    const order = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) throw { status: 404, message: 'Order not found' };
    return order;
};

export const calculateOrderAmount = (items, deliveryCharge = 50) => {
    const itemsTotal = items.reduce((sum, item) => sum + (item.finalPrice || item.price || 0) * (item.quantity || 1), 0);
    return itemsTotal + deliveryCharge;
};
