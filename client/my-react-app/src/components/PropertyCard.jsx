import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { MapPin, ArrowRight, Heart } from "lucide-react";

const PropertyCard = ({ property }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteToggle = async (e) => {
    // 1. Prevent the click from navigating to the detail page
    e.preventDefault();
    e.stopPropagation();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to save favorites!");
        return;
      }

      // 2. Call your backend favorite toggle route
      await axios.post(`/api/favorites/toggle/${property._id}`, {}, {
  headers: { Authorization: `Bearer ${token}` }
});

      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Error updating favorites:", err);
    }
  };

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300 relative">
      <Link to={`/properties/${property._id}`} className="block">
        <div className="relative h-64 overflow-hidden">
          <img
            src={property.images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-600 uppercase tracking-wider">
            {property.propertyType}
          </div>

          {/* FAVORITE BUTTON */}
          <button
            onClick={handleFavoriteToggle}
            className={`absolute top-4 right-4 p-2 rounded-full transition-all shadow-sm ${
              isFavorite ? "bg-red-500 text-white" : "bg-white/90 text-neutral-400 hover:text-red-500"
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-neutral-900 mb-1 group-hover:text-brand-600 transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center text-neutral-500 text-sm">
              <MapPin className="w-4 h-4 mr-1 text-brand-500" />
              {property.location}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-neutral-50">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-brand-600">${property.price}</span>
              <span className="text-neutral-400 text-xs">/month</span>
            </div>
            <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-600 group-hover:bg-brand-600 group-hover:text-white transition-all">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;