import { User, Property, Complaint, Inquiry } from "../models/index.js";

// GET system-wide stats for the Admin Dashboard
export const getStats = async (req, res) => {
  try {
    const stats = {
      users: await User.countDocuments(),
      properties: await Property.countDocuments(),
      inquiries: await Inquiry.countDocuments(),
      complaints: await Complaint.countDocuments()
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all users for management
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DELETE a user
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    res.json({ message: "Property approved successfully!", property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};