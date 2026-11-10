
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";
import { createClient } from "@supabase/supabase-js";
import { Upload, X, Plus, Loader2, MapPin, DollarSign, Home, FileText } from "lucide-react";

const supabaseUrl = "https://dptpdxyktnsoytwcwmqw.supabase.co";
const supabaseKey = "YOUR_EXISTING_SUPABASE_ANON_KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

const AddProperty = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    propertyType: "Apartment",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  // Fetch existing property when editing
  useEffect(() => {
    if (!isEditMode) return;

    const fetchProperty = async () => {
      try {
        const res = await API.get(`/api/properties/${id}`);

        const property = res.data;

        setFormData({
          title: property.title || "",
          description: property.description || "",
          price: property.price || "",
          location: property.location || "",
          propertyType: property.propertyType || "Apartment",
        });

        setExistingImages(property.images || []);
      } catch (error) {
        console.error("Failed to fetch property:", error);
        alert("Unable to load property details.");
        navigate("/my-listings");
      } finally {
        setFetching(false);
      }
    };

    fetchProperty();
  }, [id, isEditMode, navigate]);

  // Select new images
  const handleImageChange = (e) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);
    const availableSlots = 5 - existingImages.length - images.length;

    if (availableSlots <= 0) {
      alert("Maximum 5 images allowed.");
      e.target.value = "";
      return;
    }

    const selectedFiles = newFiles.slice(0, availableSlots);

    if (newFiles.length > availableSlots) {
      alert(`Only ${availableSlots} more image(s) can be added.`);
    }

    setImages((prev) => [...prev, ...selectedFiles]);

    const newPreviews = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviews((prev) => [...prev, ...newPreviews]);

    e.target.value = "";
  };

  // Remove an existing image from the update payload
  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove newly selected image
  const removeNewImage = (index) => {
    URL.revokeObjectURL(previews[index]);

    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Upload new images to Supabase
  const uploadImages = async () => {
    const uploadedUrls = [];

    for (const file of images) {
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}-${file.name}`;

      const filePath = `property_images/${fileName}`;

      const { error } = await supabase.storage
        .from("properties")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw new Error(`Image upload failed: ${error.message}`);
      }

      const { data } = supabase.storage
        .from("properties")
        .getPublicUrl(filePath);

      uploadedUrls.push(data.publicUrl);
    }

    return uploadedUrls;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (existingImages.length + images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    setLoading(true);

    try {
      const uploadedUrls = await uploadImages();

      const finalData = {
        ...formData,
        images: [...existingImages, ...uploadedUrls],
      };

      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      };

      if (isEditMode) {
        await API.put(`/api/properties/${id}`, finalData, config);
        alert("Property updated! It is awaiting admin approval.");
      } else {
        await API.post("/api/properties", finalData, config);
        alert("Property listed! Awaiting admin approval.");
      }

      navigate("/my-listings");
    } catch (error) {
      console.error("Property submission error:", error);
      alert(error.response?.data?.message || error.message || "Failed to save property.");
    } finally {
      setLoading(false);
    }
  };

  // Loading existing property
  if (fetching) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin w-10 h-10 text-brand-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="glass p-10 rounded-3xl space-y-10">

        <div className="text-center">
          <h1 className="text-3xl font-display font-bold">
            {isEditMode ? "Edit Your Property" : "List Your Property"}
          </h1>

          <p className="text-neutral-600 mt-2">
            {isEditMode
              ? "Update your property details and images."
              : "Provide details about your rental property to attract potential tenants."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-600" />
                Title
              </label>

              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                placeholder="Modern 2-Bedroom Apartment"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                <Home className="w-4 h-4 text-brand-600" />
                Property Type
              </label>

              <select
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all bg-white"
                value={formData.propertyType}
                onChange={(e) =>
                  setFormData({ ...formData, propertyType: e.target.value })
                }
              >
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Villa">Villa</option>
                <option value="Studio">Studio</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-brand-600" />
                Monthly Rent ($)
              </label>

              <input
                type="number"
                required
                min="1"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                placeholder="1200"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-600" />
                Location
              </label>

              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                placeholder="Downtown, New York"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>

          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-neutral-700">
              Description
            </label>

            <textarea
              required
              rows={5}
              className="w-full p-4 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none"
              placeholder="Describe the features, amenities, and neighborhood..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-semibold text-neutral-700">
              Property Images (Max 5)
            </label>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

              {existingImages.map((src, i) => (
                <div key={`existing-${i}`} className="relative aspect-square rounded-2xl overflow-hidden group">
                  <img
                    src={src}
                    alt="Existing property"
                    className="w-full h-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => removeExistingImage(i)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {previews.map((src, i) => (
                <div key={`new-${i}`} className="relative aspect-square rounded-2xl overflow-hidden group">
                  <img
                    src={src}
                    alt="New preview"
                    className="w-full h-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {existingImages.length + images.length < 5 && (
                <label className="aspect-square rounded-2xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 hover:bg-brand-50 transition-all group">

                  <Plus className="w-8 h-8 text-neutral-400 group-hover:text-brand-600" />

                  <span className="text-xs font-medium text-neutral-500 group-hover:text-brand-600 mt-2">
                    Add Image
                  </span>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}

            </div>

            <p className="text-xs text-neutral-500">
              {existingImages.length + images.length}/5 images selected
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Upload className="w-5 h-5" />
                {isEditMode ? "Save Changes" : "List Property Now"}
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddProperty;
