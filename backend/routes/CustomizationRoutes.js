import express from "express";
import { getCustomization, saveCustomization, updateCustomization, getUserCustomizations, submitCustomization, deleteCustomization } from "../controllers/CustomizationController.js";
import authUser from "../middlewares/Auth.js";

const CustomizationRouter = express.Router();

CustomizationRouter.post("/save", authUser, saveCustomization);
CustomizationRouter.get("/my", authUser, getUserCustomizations);
CustomizationRouter.post("/submit", authUser, submitCustomization);
CustomizationRouter.get("/:id", authUser, getCustomization);
CustomizationRouter.put("/update/:id", authUser, updateCustomization);
CustomizationRouter.delete("/:id", authUser, deleteCustomization);

export default CustomizationRouter;