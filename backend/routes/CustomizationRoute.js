import express from 'express';
import { saveCustomization, getCustomization, updateCustomization, getUserCustomizations, submitCustomization, deleteCustomization, getAllCustomizationsAdmin, updateCustomizationStatusAdmin } from '../controllers/CustomizationController.js';
import authUser from '../middlewares/Auth.js';

const customizationRouter = express.Router();

customizationRouter.post('/save', authUser, saveCustomization);
customizationRouter.post('/my', authUser, getUserCustomizations)
customizationRouter.post('/:id', authUser, getCustomization);
customizationRouter.put('/update/:id', authUser, updateCustomization);
customizationRouter.post('/submit', authUser, submitCustomization);
customizationRouter.delete('/:id', authUser, deleteCustomization);
customizationRouter.get('/admin/all', authUser, getAllCustomizationsAdmin);
customizationRouter.put('/admin/status/:id', authUser, updateCustomizationStatusAdmin);

export default customizationRouter;