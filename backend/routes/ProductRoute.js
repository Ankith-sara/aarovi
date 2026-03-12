import express from 'express';
import { listProducts, addProduct, removeProduct, singleProduct, editProduct, listAllProductsPublic } from '../controllers/ProductController.js';
import upload from '../middlewares/multer.js';
import adminAuth from '../middlewares/AdminAuth.js';
import { addProductValidation, mongoIdParam } from '../middlewares/validators.js';

const productRouter = express.Router();

const imageUpload = upload.fields([
    { name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 },
    { name: 'image5', maxCount: 1 }, { name: 'image6', maxCount: 1 }
]);

productRouter.post('/add', adminAuth, imageUpload, addProductValidation, addProduct);
productRouter.put('/edit/:id', adminAuth, ...mongoIdParam('id'), imageUpload, editProduct);
productRouter.get('/list', adminAuth, listProducts);
productRouter.get('/all', listAllProductsPublic);
productRouter.post('/single', singleProduct);
productRouter.delete('/remove/:id', adminAuth, ...mongoIdParam('id'), removeProduct);

export default productRouter;
