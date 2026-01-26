import express from 'express';
import { saveCustomization, getCustomization, updateCustomization, getUserCustomizations, submitCustomization, deleteCustomization, getAllCustomizationsAdmin, updateCustomizationStatusAdmin } from '../controllers/CustomizationController.js';
import authUser from '../middlewares/auth.js';
import adminAuth from '../middlewares/adminAuth.js';

const customizationRouter = express.Router();

customizationRouter.post('/save', authUser, saveCustomization);
customizationRouter.post('/my', authUser, getUserCustomizations);
customizationRouter.post('/:id', authUser, getCustomization);
customizationRouter.put('/update/:id', authUser, updateCustomization);
customizationRouter.post('/submit', authUser, submitCustomization);
customizationRouter.delete('/:id', authUser, deleteCustomization);
customizationRouter.get('/admin/all', adminAuth, getAllCustomizationsAdmin);
customizationRouter.put('/admin/update-status/:id', adminAuth, updateCustomizationStatusAdmin);

export default customizationRouter;