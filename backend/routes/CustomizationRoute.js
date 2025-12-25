import express from "express";
import { getCustomization, saveCustomization, updateCustomization, getUserCustomizations, submitCustomization, deleteCustomization } from "../controllers/CustomizationController.js";
import authUser from "../middlewares/Auth.js";

const customizationRouter = express.Router();

customizationRouter.post("/my", authUser, getUserCustomizations);
customizationRouter.post("/:id", authUser, getCustomization);
customizationRouter.post("/save", authUser, saveCustomization);
customizationRouter.post("/submit", authUser, submitCustomization);
customizationRouter.post("/update/:id", authUser, updateCustomization);
customizationRouter.post("/delete/:id", authUser, deleteCustomization);

export default customizationRouter;