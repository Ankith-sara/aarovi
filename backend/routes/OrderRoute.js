import express from 'express'
import { placeOrder, placeOrderRazorpay, allOrders, userOrders, updateStatus, verifyRazorpay, orderStatus, verifyCOD } from '../controllers/OrderController.js'
import adminAuth from '../middlewares/AdminAuth.js';
import authUser from '../middlewares/Auth.js'

const orderRouter = express.Router()

orderRouter.get('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)
orderRouter.post('/place', authUser, placeOrder)
orderRouter.post('/razorpay', authUser, placeOrderRazorpay)
orderRouter.post('/userorders', authUser, userOrders)
orderRouter.post('/verifyRazorpay', authUser, verifyRazorpay)
orderRouter.post('/verifycod', authUser, verifyCOD);
orderRouter.get('/track/:orderId', orderStatus)

export default orderRouter;