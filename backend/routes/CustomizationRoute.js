import express from "express";
import { getCustomization, saveCustomization, updateCustomization, getUserCustomizations, submitCustomization, deleteCustomization, aiEditCanvas, getAllCustomizationsAdmin, updateCustomizationStatusAdmin } from "../controllers/CustomizationController.js";
import authUser from "../middlewares/Auth.js";
import adminAuth from "../middlewares/AdminAuth.js";

const customizationRouter = express.Router();

customizationRouter.post("/my", authUser, getUserCustomizations);
customizationRouter.post("/ai-edit", authUser, aiEditCanvas);
customizationRouter.post("/save", authUser, saveCustomization);
customizationRouter.post("/submit", authUser, submitCustomization);
customizationRouter.get("/:id", authUser, getCustomization);
customizationRouter.put("/update/:id", authUser, updateCustomization);
customizationRouter.delete("/:id", authUser, deleteCustomization);
customizationRouter.get("/admin/all", adminAuth, getAllCustomizationsAdmin);
customizationRouter.put("/admin/update-status/:id", adminAuth, updateCustomizationStatusAdmin);

export default customizationRouter;