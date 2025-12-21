import express from "express"
import { addToCart, updateCart, getUserCart, removeFromCart, clearCart, addCustomToCart, updateCustomCart, removeCustomFromCart } from "../controllers/CartController.js"
import authUser from "../middlewares/Auth.js"

const cartRouter = express.Router()

cartRouter.post('/get',authUser, getUserCart)
cartRouter.post('/add',authUser, addToCart)
cartRouter.post('/update',authUser, updateCart)
cartRouter.post('/remove', authUser, removeFromCart);
cartRouter.post('/clear', authUser, clearCart);
cartRouter.post('/add-custom', authUser, addCustomToCart);
cartRouter.post('/update-custom', authUser, updateCustomCart);
cartRouter.post('/remove-custom', authUser, removeCustomFromCart);

export default cartRouter;