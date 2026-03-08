import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Home, MapPin, Trash2, CheckCircle, Clock, Loader2, Plus, ExternalLink } from "lucide-react";

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      const res = await axios.get("/api/properties/my-listings", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setListings(res.data);
    } catch (err) {
      console.error("Failed to fetch listings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    // Prevent the click from triggering the Link navigation
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm("Delete this property and all its images from Supabase?")) return;
    try {
      await axios.delete(`/api/properties/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setListings(listings.filter(p => p._id !== id));
      alert("Deleted successfully!");
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin w-10 h-10 text-brand-600" /></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-neutral-900">My Property Listings</h1>
        <Link to="/add-property" className="flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-xl hover:bg-brand-700 transition-all shadow-md">
          <Plus className="w-5 h-5" /> List New Property
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="glass p-20 text-center rounded-3xl border border-dashed border-neutral-300">
          <Home className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
          <p className="text-neutral-500 text-lg italic">You haven't added any properties yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((prop) => (
            /* FIX: Ensure Link uses _id and wraps the card */
            <Link 
              to={`/properties/${prop._id}`} 
              key={prop._id} 
              className="glass rounded-3xl overflow-hidden border border-neutral-100 group hover:shadow-xl transition-all block relative"
            >
              <div className="relative h-52 overflow-hidden">
                <img 
                  src={prop.images?.[0] || "https://via.placeholder.com/400x300?text=No+Image"} 
                  alt={prop.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                
                {/* Status Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 shadow-sm ${prop.isApproved ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}`}>
                  {prop.isApproved ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  {prop.isApproved ? "Live" : "Awaiting Approval"}
                </div>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold truncate text-neutral-800">{prop.title}</h3>
                  <ExternalLink className="w-4 h-4 text-neutral-300 group-hover:text-brand-600 transition-colors" />
                </div>
                
                <p className="text-neutral-500 flex items-center gap-1 text-sm">
                  <MapPin className="w-4 h-4 text-brand-500" /> {prop.location}
                </p>
                
                <div className="flex justify-between items-center pt-4 border-t border-neutral-50">
                  <span className="text-xl font-black text-brand-600">${prop.price}<span className="text-xs text-neutral-400 font-normal">/mo</span></span>
                  
                  {/* Delete Button - Stopped propagation to prevent triggering the Link */}
                  <button 
                    onClick={(e) => handleDelete(e, prop._id)} 
                    className="p-2.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all z-10"
                    title="Delete Listing"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;