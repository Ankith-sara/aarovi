import express from 'express';
import { placeOrder, placeOrderQR, placeOrderRazorpay, verifyRazorpay, verifyCOD, allOrders, userOrders, updateStatus, orderStatus, updateProductionStatus } from '../controllers/OrderController.js';
import authUser from '../middlewares/Auth.js';
import adminAuth from '../middlewares/AdminAuth.js';

const orderRouter = express.Router();

orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/qr', authUser, placeOrderQR);
orderRouter.post('/razorpay', authUser, placeOrderRazorpay);
orderRouter.post('/verifyRazorpay', authUser, verifyRazorpay);
orderRouter.post('/verifyCOD', authUser, verifyCOD);
orderRouter.post('/userorders', authUser, userOrders); 
orderRouter.get('/status/:orderId', orderStatus);
orderRouter.get('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);
orderRouter.post('/update-production', adminAuth, updateProductionStatus);

export default orderRouter;