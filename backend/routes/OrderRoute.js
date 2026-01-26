import express from 'express';
import { placeOrder, placeOrderRazorpay, verifyRazorpay, verifyCOD, allOrders, userOrders, updateStatus, orderStatus, updateProductionStatus } from '../controllers/OrderController.js';
import authUser from '../middlewares/auth.js';
import adminAuth from '../middlewares/adminAuth.js';

const orderRouter = express.Router();

orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/razorpay', authUser, placeOrderRazorpay);
orderRouter.post('/verifyRazorpay', authUser, verifyRazorpay);
orderRouter.post('/verifyCOD', authUser, verifyCOD);
orderRouter.post('/userorders', authUser, userOrders); 
orderRouter.get('/status/:orderId', orderStatus);
orderRouter.get('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);
orderRouter.post('/update-production', adminAuth, updateProductionStatus);

export default orderRouter;