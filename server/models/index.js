import mongoose from "mongoose";

// --- User Model ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['tenant', 'owner', 'admin'], default: 'tenant' },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model("User", userSchema);

// --- Property Model ---
const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  location: {
    type: String,
    required: [true, "Location is required"],
  },
  propertyType: {
    type: String,
    enum: ["Apartment", "House", "Villa", "Studio"],
    default: "Apartment",
  },
  images: [
    {
      type: String, // These will store the Supabase Public URLs
      required: true,
    },
  ],
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Links the property to the person who posted it
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: false, // Properties need Admin approval by default
  },
  availabilityStatus: {
    type: String,
    enum: ["available", "rented", "sold"],
    default: "available",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create an index for faster searching by location
propertySchema.index({ location: "text" });

export const Property = mongoose.model("Property", propertySchema);

// --- Inquiry Model ---
const inquirySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'responded', 'closed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export const Inquiry = mongoose.model("Inquiry", inquirySchema);

// --- Favorite Model ---
const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  createdAt: { type: Date, default: Date.now }
});

// Ensures a tenant can't favorite the same house twice
favoriteSchema.index({ userId: 1, propertyId: 1 }, { unique: true });
export const Favorite = mongoose.model("Favorite", favoriteSchema);

// --- Complaint Model ---
const complaintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' }, // Optional
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'resolved', 'dismissed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export const Complaint = mongoose.model("Complaint", complaintSchema);

