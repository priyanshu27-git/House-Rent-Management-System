import { Favorite } from "../models/index.js";

export const toggleFavorite = async (req, res) => {
  try {
    const { propertyId } = req.body;
    const userId = req.user.id;

    const existing = await Favorite.findOne({ userId, propertyId });

    if (existing) {
      await Favorite.findByIdAndDelete(existing._id);
      return res.json({ message: "Removed from favorites", isFavorite: false });
    }

    const newFav = new Favorite({ userId, propertyId });
    await newFav.save();
    res.status(201).json({ message: "Added to favorites", isFavorite: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.id })
      .populate("propertyId");
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};