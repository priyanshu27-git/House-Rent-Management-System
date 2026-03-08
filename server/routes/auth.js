import express from "express";
import * as authController from "../controllers/authController.js";

const router = express.Router();

// Routes are now very clean and easy to read
router.post("/register", authController.register);
router.post("/login", authController.login);

export default router;