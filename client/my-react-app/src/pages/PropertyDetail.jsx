import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import {
  MapPin,
  Home,
  User,
  Phone,
  Mail,
  Send,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Heart,
  AlertTriangle,
  Clock,
  XCircle,
  CheckCircle,
} from "lucide-react";

const PropertyDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inquiry, setInquiry] = useState("");
  const [sending, setSending] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState({ subject: "", message: "" });

  useEffect(() => {
    const fetchProperty = async () => {
      // 🛡️ Guard clause: if id is 'undefined', don't fetch
      if (!id || id === "undefined") {
        console.error(
          "Critical Error: The ID passed in the URL is 'undefined'",
        );
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(`/api/properties/${id}`);
        setProperty(res.data);
      } catch (err) {
        console.error("Fetch Error:", err);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
    console.log("Fetching property with ID:", id); // 🔍 Check your browser console!
    if (!id || id === "undefined") return;
  }, [id]); // 🔄 Re-run if ID changes

  const handleInquiry = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    setSending(true);
    try {
      // Backend: inquiryController.createInquiry
      await axios.post("/api/inquiries", { propertyId: id, message: inquiry });
      alert("Inquiry sent successfully to the owner!");
      setInquiry("");
    } catch (err) {
      alert("Failed to send inquiry");
    } finally {
      setSending(false);
    }
  };

  const toggleFavorite = async () => {
    if (!user) return navigate("/login");
    try {
      // Backend: favoriteController.toggleFavorite (uses a POST for both add/remove)
      const res = await axios.post(`/api/favorites/toggle`, { propertyId: id });
      setIsFavorited(res.data.isFavorite);
    } catch (err) {
      alert("Failed to update favorites");
    }
  };

  const handleReport = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    try {
      // Backend: complaintController.createComplaint
      await axios.post("/api/complaints", {
        propertyId: id,
        subject: reportData.subject,
        message: reportData.message,
      });
      alert("Report submitted successfully.");
      setShowReportModal(false);
      setReportData({ subject: "", message: "" });
    } catch (err) {
      alert("Failed to submit report");
    }
  };

  const nextImage = () => {
    if (property.images) {
      setCurrentImage((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property.images) {
      setCurrentImage(
        (prev) => (prev - 1 + property.images.length) % property.images.length,
      );
    }
  };

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-600 w-10 h-10" />
      </div>
    );
  if (!property)
    return (
      <div className="text-center py-20 text-xl font-bold">
        Property not found
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT COLUMN: IMAGES & DETAILS */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Slider */}
          <div className="relative aspect-video rounded-3xl overflow-hidden group bg-neutral-100">
            {property.images && property.images.length > 0 ? (
              <img
                src={property.images[currentImage]}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-neutral-400">
                No images available
              </div>
            )}

            {property.images?.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white"
                >
                  <ChevronLeft />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white"
                >
                  <ChevronRight />
                </button>
              </>
            )}

            <button
              onClick={toggleFavorite}
              className={`absolute top-6 right-6 p-3 rounded-2xl backdrop-blur transition-all ${isFavorited ? "bg-red-500 text-white" : "bg-white/80 text-neutral-600 hover:text-red-500"}`}
            >
              <Heart className={isFavorited ? "fill-current" : ""} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-brand-600 font-bold uppercase tracking-wider text-sm">
              <Home className="w-4 h-4" /> {property.propertyType}
            </div>
            <h1 className="text-4xl font-display font-bold">
              {property.title}
            </h1>
            <div className="flex items-center text-neutral-500 gap-2">
              <MapPin className="w-5 h-5" /> {property.location}
            </div>
          </div>

          <div className="prose prose-neutral max-w-none">
            <h3 className="text-xl font-bold">About this property</h3>
            <p className="text-neutral-600 leading-relaxed">
              {property.description}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTACT & STATUS */}
        <div className="space-y-6">
          <div className="glass p-8 rounded-3xl sticky top-8 space-y-6 border border-neutral-100">
            <div className="flex items-end gap-1">
              <span className="text-3xl font-bold">${property.price}</span>
              <span className="text-neutral-500 pb-1">/ month</span>
            </div>

            <div
              className={`flex items-center gap-2 p-3 rounded-xl text-sm font-semibold ${property.isApproved ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}
            >
              {property.isApproved ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Clock className="w-4 h-4" />
              )}
              {property.isApproved
                ? "Verified Listing"
                : "Pending Verification"}
            </div>

            <hr className="border-neutral-100" />

            {/* Inquiry Form */}
            <form onSubmit={handleInquiry} className="space-y-4">
              <label className="text-sm font-bold text-neutral-700">
                Contact Owner
              </label>
              <textarea
                required
                placeholder="Ask about availability or schedule a visit..."
                className="w-full p-4 rounded-2xl border border-neutral-200 focus:ring-2 focus:ring-brand-500 outline-none resize-none"
                rows={4}
                value={inquiry}
                onChange={(e) => setInquiry(e.target.value)}
              />
              <button
                type="submit"
                disabled={sending}
                className="w-full btn-primary py-4 flex items-center justify-center gap-2"
              >
                {sending ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Inquiry
                  </>
                )}
              </button>
            </form>

            <button
              onClick={() => setShowReportModal(true)}
              className="w-full text-sm text-neutral-400 hover:text-red-500 flex items-center justify-center gap-2 transition-colors"
            >
              <AlertTriangle className="w-4 h-4" /> Report this listing
            </button>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full space-y-6 relative">
            <button
              onClick={() => setShowReportModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600"
            >
              <XCircle />
            </button>
            <h2 className="text-2xl font-bold text-red-600">Report Listing</h2>
            <form onSubmit={handleReport} className="space-y-4">
              <input
                type="text"
                placeholder="Subject (e.g., Wrong location)"
                required
                className="w-full p-3 rounded-xl border border-neutral-200"
                onChange={(e) =>
                  setReportData({ ...reportData, subject: e.target.value })
                }
              />
              <textarea
                placeholder="Describe the issue..."
                required
                className="w-full p-3 rounded-xl border border-neutral-200"
                rows={4}
                onChange={(e) =>
                  setReportData({ ...reportData, message: e.target.value })
                }
              />
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700"
              >
                Submit Report
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;
