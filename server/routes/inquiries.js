import express from "express";
import { Inquiry, Property } from "../models/index.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticate, async (req, res) => {
  const { propertyId, message } = req.body;
  try {
    const inquiry = new Inquiry({ userId: req.user.id, propertyId, message });
    await inquiry.save();
    res.status(201).json({ message: "Inquiry sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/my", authenticate, async (req, res) => {
  try {
    let inquiries;
    if (req.user.role === "tenant") {
      inquiries = await Inquiry.find({ userId: req.user.id })
        .populate({ path: 'propertyId', select: 'title ownerId', populate: { path: 'ownerId', select: 'name' } })
        .sort({ createdAt: -1 });
      
      res.json(inquiries.map(i => {
        const iObj = i.toObject();
        return {
          ...iObj,
          id: iObj._id,
          propertyTitle: iObj.propertyId?.title,
          ownerName: iObj.propertyId?.ownerId?.name
        };
      }));
    } else if (req.user.role === "owner") {
      const myProperties = await Property.find({ ownerId: req.user.id }).select('_id');
      const propertyIds = myProperties.map(p => p._id);

      inquiries = await Inquiry.find({ propertyId: { $in: propertyIds } })
        .populate('userId', 'name email phone')
        .populate('propertyId', 'title')
        .sort({ createdAt: -1 });

      res.json(inquiries.map(i => {
        const iObj = i.toObject();
        return {
          ...iObj,
          id: iObj._id,
          propertyTitle: iObj.propertyId?.title,
          tenantName: iObj.userId?.name,
          tenantEmail: iObj.userId?.email,
          tenantPhone: iObj.userId?.phone
        };
      }));
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/:id", authenticate, authorize(["owner", "admin"]), async (req, res) => {
  const { status } = req.body;
  try {
    await Inquiry.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: "Inquiry status updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;