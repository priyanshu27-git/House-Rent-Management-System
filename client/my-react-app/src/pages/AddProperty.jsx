import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { createClient } from "@supabase/supabase-js"; // 1. Added Supabase import
import { useAuth } from "../Context/AuthContext";
import { Upload, X, Plus, Loader2, MapPin, DollarSign, Home, FileText } from "lucide-react";

// 2. Initialize Supabase (Use your actual credentials here)
const supabaseUrl = "https://dptpdxyktnsoytwcwmqw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwdHBkeHlrdG5zb3l0d2N3bXF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4OTE0NTEsImV4cCI6MjA4ODQ2NzQ1MX0.wesA6jkKFz-HHWqMhor0GFwncyVu2aGf5_PRLl2sv5U";
const supabase = createClient(supabaseUrl, supabaseKey);

const AddProperty = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    propertyType: "Apartment",
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleImageChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages([...images, ...newFiles]);
      const newPreviews = newFiles.map(f => URL.createObjectURL(f));
      setPreviews([...previews, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  // ---------- EDITED MAIN SUBMIT FUNCTION ----------
const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) return alert("Please upload at least one image");
    
    setLoading(true);

    try {
      const imageUrls = [];

      for (const file of images) {
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = `property_images/${fileName}`;

        // 1. Upload attempt
        const { data, error: uploadError } = await supabase.storage
          .from("properties") 
          .upload(filePath, file, { 
            cacheControl: '3600',
            upsert: false 
          });

        if (uploadError) {
          // LOG THE FULL ERROR OBJECT HERE
          console.error("Supabase Upload Error Details:", uploadError);
          throw new Error(`Upload failed: ${uploadError.message}`);
        }

        // 2. Use the official method to get the URL
        const { data: { publicUrl } } = supabase.storage
          .from("properties")
          .getPublicUrl(filePath);

        imageUrls.push(publicUrl);
      }

      const finalData = { ...formData, images: imageUrls };

      await axios.post("/api/properties", finalData, {
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}` 
        }
      });

      navigate("/dashboard");
    } catch (err) {
      console.error("Full Error Catch:", err);
      alert(err.message || "Failed to add property.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="glass p-10 rounded-3xl space-y-10">
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold">List Your Property</h1>
          <p className="text-neutral-600 mt-2">Provide details about your rental property to attract potential tenants.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-600" /> Title
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                placeholder="Modern 2-Bedroom Apartment"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                <Home className="w-4 h-4 text-brand-600" /> Property Type
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all bg-white"
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
              >
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Villa">Villa</option>
                <option value="Studio">Studio</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-brand-600" /> Monthly Rent ($)
              </label>
              <input
                type="number"
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                placeholder="1200"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-600" /> Location
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                placeholder="Downtown, New York"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-neutral-700">Description</label>
            <textarea
              required
              rows={5}
              className="w-full p-4 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none"
              placeholder="Describe the features, amenities, and neighborhood..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-semibold text-neutral-700">Property Images (Max 5)</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {previews.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group">
                  <img src={src} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {previews.length < 5 && (
                <label className="aspect-square rounded-2xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 hover:bg-brand-50 transition-all group">
                  <Plus className="w-8 h-8 text-neutral-400 group-hover:text-brand-600" />
                  <span className="text-xs font-medium text-neutral-500 group-hover:text-brand-600 mt-2">Add Image</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Upload className="w-5 h-5" /> List Property Now</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;