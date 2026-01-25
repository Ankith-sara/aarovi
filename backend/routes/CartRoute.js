import express from 'express';
import { addToCart, updateCart, getUserCart, removeFromCart, clearCart, addCustomizationToCart, updateCustomizationQuantity, removeCustomizationFromCart } from '../controllers/CartController.js';
import authUser from '../middlewares/Auth.js';

const cartRouter = express.Router();

cartRouter.post('/add', authUser, addToCart);
cartRouter.post('/update', authUser, updateCart);
cartRouter.post('/get', authUser, getUserCart);
cartRouter.post('/remove', authUser, removeFromCart);
cartRouter.post('/clear', authUser, clearCart);
cartRouter.post('/add-custom', authUser, addCustomizationToCart);
cartRouter.post('/update-custom', authUser, updateCustomizationQuantity);
cartRouter.post('/remove-custom', authUser, removeCustomizationFromCart);

export default cartRouter;