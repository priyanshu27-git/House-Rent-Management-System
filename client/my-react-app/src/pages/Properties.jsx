import React, { useState, useEffect } from "react";
import axios from "axios";
import PropertyCard from "../components/PropertyCard";
import { Search, MapPin, DollarSign, Home, Filter, Loader2 } from "lucide-react";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    type: "",
  });

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters);
      const res = await axios.get(`/api/properties?${params.toString()}`);
      setProperties(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
   // Inside Properties.jsx

  // ... existing state (properties, loading, filters) ...


    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* --- NEW SEARCH & FILTER SECTION --- */}
      <div className="glass p-8 rounded-[2rem] border border-neutral-100 shadow-xl shadow-neutral-100/50 bg-white/70 backdrop-blur-lg">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Location Search */}
            <div className="relative flex-1 w-full">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-600" />
              <input
                type="text"
                name="location"
                placeholder="Where are you looking? (e.g. Jabalpur)"
                value={filters.location}
                onChange={handleFilterChange}
                className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition-all font-medium"
              />
            </div>
            
            {/* Search Button */}
            <button 
              onClick={fetchProperties}
              className="w-full md:w-auto bg-brand-600 hover:bg-brand-700 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-brand-100 flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" /> Find Homes
            </button>
          </div>

          {/* Advanced Filters Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-neutral-100">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-black text-neutral-400 ml-2">Property Type</label>
              <select 
                name="type" 
                value={filters.type} 
                onChange={handleFilterChange}
                className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none focus:border-brand-500"
              >
                <option value="">All Types</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Studio">Studio</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-black text-neutral-400 ml-2">Min Price</label>
              <input 
                type="number" 
                name="minPrice" 
                placeholder="$ Min" 
                value={filters.minPrice} 
                onChange={handleFilterChange}
                className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-black text-neutral-400 ml-2">Max Price</label>
              <input 
                type="number" 
                name="maxPrice" 
                placeholder="$ Max" 
                value={filters.maxPrice} 
                onChange={handleFilterChange}
                className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none"
              />
            </div>

            <div className="flex items-end">
              <button 
                onClick={() => {
                  setFilters({ location: "", minPrice: "", maxPrice: "", type: "" });
                  // Re-fetch after clearing
                  setTimeout(fetchProperties, 0);
                }}
                className="w-full p-3 text-neutral-400 hover:text-red-500 text-xs font-bold transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- PROPERTY GRID --- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-12 h-12 text-brand-600 animate-spin" />
          <p className="text-neutral-400 font-medium italic">Searching for properties...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {properties.length > 0 ? (
            properties.map((p) => <PropertyCard key={p._id} property={p} />)
          ) : (
            <div className="col-span-full py-20 text-center glass rounded-3xl">
              <Home className="w-16 h-16 mx-auto text-neutral-200 mb-4" />
              <p className="text-neutral-500 text-lg">No properties found matching your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Properties;