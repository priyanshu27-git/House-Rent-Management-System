import { Property, User } from "../models/index.js";
import { supabase } from "../config/supabase.js";

// GET all properties with basic filtering
export const getAllProperties = async (req, res) => {
  try {
    const { location, type, minPrice, maxPrice, adminMode } = req.query;
    let query = (adminMode === 'true') ? {} : { isApproved: true };

    // 🛡️ Only add filters if the value is NOT an empty string or null
    if (location && location.trim() !== "") {
      query.location = { $regex: location, $options: "i" };
    }
    if (type && type !== "") {
      query.propertyType = type;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice && minPrice !== "") query.price.$gte = Number(minPrice);
      if (maxPrice && maxPrice !== "") query.price.$lte = Number(maxPrice);
    }

    const properties = await Property.find(query).sort({ createdAt: -1 });
    console.log(properties[0]);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// POST: Create a new property listing
export const createProperty = async (req, res) => {
  try {
    const { title, description, price, location, propertyType, images } = req.body;

    const newProperty = new Property({
      title,
      description,
      price,
      location,
      propertyType,
      images,
      ownerId: req.user.id,
      isApproved: false, // 🛡️ Hardcode this to false so it ignores whatever the frontend sends
    });

    await newProperty.save();
    res.status(201).json({ message: "Property listed! Awaiting admin approval." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    // 1. Security Check: Only the owner or an admin can delete
    if (property.ownerId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // 2. Extract filenames from Supabase URLs to delete from Storage
    // Example URL: .../public/Data/property_images/171000-house.jpg
    const filesToDelete = property.images.map(url => {
      const parts = url.split('/');
      return `property_images/${parts[parts.length - 1]}`;
    });

    if (filesToDelete.length > 0) {
      const { error: storageError } = await supabase.storage
        .from('Data')
        .remove(filesToDelete);
      
      if (storageError) console.error("Supabase cleanup failed:", storageError);
    }

    // 3. Delete from MongoDB
    await Property.findByIdAndDelete(req.params.id);
    
    res.json({ message: "Property and associated images deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get properties belonging to the logged-in owner
export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your properties", error: error.message });
  }
};

// Get a single property for the Details page
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("ownerId", "name email phone");
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: "Error fetching property details", error: error.message });
  }
};

// Toggle Favorite: Add or Remove property from user's list
export const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { propertyId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // FIX: Check if the string version of the ID exists in the favorites array
    const index = user.favorites.indexOf(propertyId);

    if (index > -1) {
      // If it exists, remove it
      user.favorites.splice(index, 1);
    } else {
      // If it doesn't, add it
      user.favorites.push(propertyId);
    }

    await user.save();
    res.json({ 
      message: index > -1 ? "Removed from favorites" : "Added to favorites", 
      favorites: user.favorites 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User's Favorites with full property details
export const getMyFavorites = async (req, res) => {
  try {
    // This was also failing due to the missing import
    const user = await User.findById(req.user.id).populate("favorites");
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.json(user.favorites || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};