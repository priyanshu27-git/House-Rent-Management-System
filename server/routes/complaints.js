import express from "express";
import { Complaint } from "../models/index.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Submit a complaint
router.post("/", authenticate, async (req, res) => {
  try {
    const { propertyId, subject, message } = req.body;
    const complaint = new Complaint({ userId: req.user.id, propertyId, subject, message });
    await complaint.save();
    res.status(201).json({ message: "Complaint submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get my complaints
router.get("/my", authenticate, async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user?.id })
      .populate('propertyId', 'title')
      .sort({ createdAt: -1 });
    
    res.json(complaints.map((c) => ({
      ...c.toObject(),
      id: c._id,
      propertyTitle: c.propertyId?.title
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
