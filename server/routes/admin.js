import express from "express";
import * as adminController from "../controllers/adminController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Middleware to ensure only admins reach these functions
router.use(authenticate, authorize(["admin"]));

router.get("/stats", adminController.getStats);
router.get("/users", adminController.getAllUsers);
router.delete("/users/:id", adminController.deleteUser);
router.patch("/properties/:id/approve", adminController.approveProperty);

export default router;