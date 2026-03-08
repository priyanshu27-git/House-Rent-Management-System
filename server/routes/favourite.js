import express from "express";
// Point these to the PropertyController logic we already fixed
import * as propertyController from "../controllers/propertyController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Use the URL parameter version (:propertyId) to match your PropertyCard.jsx
router.post("/toggle/:propertyId", authenticate, propertyController.toggleFavorite);
router.get("/", authenticate, propertyController.getMyFavorites);

export default router;