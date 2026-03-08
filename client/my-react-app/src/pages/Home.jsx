import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Search, Shield, Clock, ArrowRight, MapPin, Home as HomeIcon, Loader2 } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [recentProperties, setRecentProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch a few properties to show on the landing page
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await axios.get("/api/properties");
        // Only show the first 3 approved properties
        setRecentProperties(res.data.slice(0, 3));
      } catch (err) {
        console.error("Error fetching properties for home:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Redirect to the properties page with the location as a query param
    navigate(`/properties?location=${searchQuery}`);
  };

  return (
    <div className="space-y-20 pb-20">
      {/* --- HERO SECTION --- */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black">
          <img
            // Updated URL with more stable parameters
            src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Hero Luxury House"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
               Find your dream <span className="text-brand-500 italic">Rental Property</span>
            </h1>
            <p className="text-xl text-neutral-200 mb-8 leading-relaxed">
              Discover premium rental properties tailored to your lifestyle. Verified listings, effortless booking.
            </p>

            {/* --- INTEGRATED SEARCH BAR --- */}
            <form 
              onSubmit={handleSearchSubmit}
              className="flex flex-col sm:flex-row gap-3 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20"
            >
              <div className="flex-1 flex items-center gap-3 px-4 py-2">
                <MapPin className="text-brand-400 w-5 h-5" />
                <input 
                  type="text"
                  placeholder="Enter location (e.g. Jabalpur)..."
                  className="bg-transparent border-none outline-none text-white placeholder:text-neutral-300 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                Search <Search className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* --- FEATURED PROPERTIES SECTION --- */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold">Featured Listings</h2>
            <p className="text-neutral-500">Handpicked properties for you</p>
          </div>
          <Link to="/properties" className="text-brand-600 font-bold flex items-center gap-1 hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin w-10 h-10 text-brand-600" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentProperties.map((prop) => (
              <Link to={`/properties/${prop._id}`} key={prop._id} className="group">
                <div className="glass rounded-3xl overflow-hidden border border-neutral-100 h-full hover:shadow-xl transition-all">
                  <div className="relative h-56">
                    <img 
                      src={prop.images[0]} 
                      alt={prop.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-brand-600">
                      ${prop.price}/mo
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2">{prop.title}</h3>
                    <p className="text-neutral-500 text-sm flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {prop.location}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* --- WHY CHOOSE US SECTION --- */}
      <section className="bg-neutral-900 py-20 rounded-[3rem] text-white mx-4">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-brand-600/20 rounded-2xl flex items-center justify-center mx-auto">
              <Shield className="text-brand-500 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold">Verified Listings</h3>
            <p className="text-neutral-400">Every property is inspected and verified by our admin team.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-brand-600/20 rounded-2xl flex items-center justify-center mx-auto">
              <Clock className="text-brand-500 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold">Instant Booking</h3>
            <p className="text-neutral-400">Message owners directly and get response within 24 hours.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-brand-600/20 rounded-2xl flex items-center justify-center mx-auto">
              <HomeIcon className="text-brand-500 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold">Modern Living</h3>
            <p className="text-neutral-400">From studio apartments to luxury villas, we have it all.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;