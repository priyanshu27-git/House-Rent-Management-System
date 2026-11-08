import express from "express";
import * as propertyController from "../controllers/propertyController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// 1. Public route to view properties
router.get("/", propertyController.getAllProperties);

// Home route
router.get("/home", propertyController.getAllProperties);
  
// 2. Specific route for Owner's listings (MUST be above /:id)
router.get("/my-listings", authenticate, propertyController.getMyProperties);

// Update property
router.put("/:id", authenticate, propertyController.updateProperty);


// 3. Get single property by ID
router.get("/:id", propertyController.getPropertyById);

// 4. Protected route to add properties
router.post(
  "/", 
  authenticate, 
  authorize(["owner", "admin"]), 
  propertyController.createProperty
);

// 5. Delete property (Includes Supabase cleanup)
router.delete("/:id", authenticate, propertyController.deleteProperty);

export default router;