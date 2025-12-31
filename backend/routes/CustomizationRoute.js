import express from "express";
import { getCustomization, saveCustomization, updateCustomization, getUserCustomizations, submitCustomization, deleteCustomization } from "../controllers/CustomizationController.js";
import authUser from "../middlewares/Auth.js";

const customizationRouter = express.Router();

customizationRouter.post("/my", authUser, getUserCustomizations);
customizationRouter.post("/save", authUser, saveCustomization);
customizationRouter.post("/submit", authUser, submitCustomization);
customizationRouter.get("/:id", authUser, getCustomization);
customizationRouter.put("/update/:id", authUser, updateCustomization);
customizationRouter.delete("/:id", authUser, deleteCustomization);

export default customizationRouter;