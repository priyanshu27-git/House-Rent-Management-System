import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, Home, MessageSquare, Users, 
  CheckCircle, Clock, Loader2, Plus, Trash2, MapPin,
  Heart, ShieldCheck, ExternalLink
} from "lucide-react";
import PropertyCard from "../components/PropertyCard";

const Dashboard = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState({
    inquiries: [],
    properties: [],
    favorites: [], 
    users: [],
    stats: null
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const requests = [
        axios.get("/api/inquiries/my", config)
      ];

      if (user?.role === "owner") {
        requests.push(axios.get(`/api/properties?ownerId=${user.id}&adminMode=true`, config));
      } else if (user?.role === "admin") {
        requests.push(axios.get("/api/admin/users", config));
        requests.push(axios.get("/api/properties?adminMode=true", config));
        requests.push(axios.get("/api/admin/stats", config));
      } else if (user?.role === "tenant") {
        // FIX: Pointing to the consolidated route in favorite.js
        requests.push(axios.get("/api/favorites", config));
      }

      const results = await Promise.all(requests);
      
      const newData = { ...data };
      newData.inquiries = results[0].data;

      if (user?.role === "owner") {
        newData.properties = results[1].data;
      } else if (user?.role === "admin") {
        newData.users = results[1].data;
        newData.properties = results[2].data;
        newData.stats = results[3].data;
      } else if (user?.role === "tenant") {
        newData.favorites = results[1].data;
      }

      setData(newData);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const handleApprove = async (id) => {
    try {
      await axios.patch(`/api/admin/properties/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchData();
    } catch (err) { alert("Approval failed"); }
  };

  const handleSearch = () => {
  if (searchQuery.trim()) {
    // Navigate to explore page with the search term as a query param
    window.location.href = `/properties?location=${searchQuery}`;
  }
};

  const handleDeleteProperty = async (id) => {
    if (!window.confirm("Delete this listing?")) return;
    try {
      await axios.delete(`/api/properties/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchData();
    } catch (err) { alert("Delete failed"); }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR */}
        <aside className="w-full md:w-64 space-y-2">
          <div className="p-6 bg-green-600 rounded-3xl text-white mb-6 shadow-lg shadow-green-100">
            <p className="text-sm opacity-80">Welcome back,</p>
            <h2 className="text-xl font-bold truncate">{user?.name}</h2>
            <p className="text-[10px] mt-2 px-2 py-0.5 bg-white/20 rounded-full inline-block uppercase font-bold tracking-wider">{user?.role}</p>
          </div>
          
          <nav className="space-y-1">
            <button onClick={() => setActiveTab("overview")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "overview" ? "bg-green-50 text-green-600 font-bold" : "text-neutral-500 hover:bg-neutral-50"}`}>
              <LayoutDashboard className="w-5 h-5" /> Overview
            </button>
            
            {(user?.role === "owner" || user?.role === "admin") && (
              <button onClick={() => setActiveTab("properties")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "properties" ? "bg-green-50 text-green-600 font-bold" : "text-neutral-500 hover:bg-neutral-50"}`}>
                <Home className="w-5 h-5" /> {user?.role === "admin" ? "Manage Listings" : "My Listings"}
              </button>
            )}
            
            <button onClick={() => setActiveTab("inquiries")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "inquiries" ? "bg-green-50 text-green-600 font-bold" : "text-neutral-500 hover:bg-neutral-50"}`}>
              <MessageSquare className="w-5 h-5" /> Inquiries
            </button>

            {user?.role === "tenant" && (
              <button onClick={() => setActiveTab("favorites")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "favorites" ? "bg-green-50 text-green-600 font-bold" : "text-neutral-500 hover:bg-neutral-50"}`}>
                <Heart className="w-5 h-5" /> Favorites
              </button>
            )}

            {user?.role === "admin" && (
              <button onClick={() => setActiveTab("users")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "users" ? "bg-green-50 text-green-600 font-bold" : "text-neutral-500 hover:bg-neutral-50"}`}>
                <Users className="w-5 h-5" /> Manage Users
              </button>
            )}
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1">
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-3xl border-l-4 border-green-500 shadow-sm">
                  <p className="text-neutral-500 text-xs font-bold uppercase tracking-wider">Total Inquiries</p>
                  <h3 className="text-3xl font-black mt-1 text-neutral-800">{data.inquiries.length}</h3>
                </div>
                
                {user?.role === "tenant" ? (
                  <div className="glass p-6 rounded-3xl border-l-4 border-red-500 shadow-sm">
                    <p className="text-neutral-500 text-xs font-bold uppercase tracking-wider">Favorites</p>
                    <h3 className="text-3xl font-black mt-1 text-neutral-800">{data.favorites.length}</h3>
                  </div>
                ) : (
                  <div className="glass p-6 rounded-3xl border-l-4 border-blue-500 shadow-sm">
                    <p className="text-neutral-500 text-xs font-bold uppercase tracking-wider">Total Listings</p>
                    <h3 className="text-3xl font-black mt-1 text-neutral-800">{data.properties.length}</h3>
                  </div>
                )}

                <div className="glass p-6 rounded-3xl border-l-4 border-orange-400 shadow-sm">
                  <p className="text-neutral-500 text-xs font-bold uppercase tracking-wider">Pending Tasks</p>
                  <h3 className="text-3xl font-black mt-1 text-neutral-800">
                    {user?.role === "admin" 
                      ? data.properties.filter(p => !p.isApproved).length 
                      : data.inquiries.filter(i => i.status === "pending").length}
                  </h3>
                </div>
              </div>
              
              <div className="glass p-8 rounded-3xl border border-neutral-100">
                <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                <p className="text-neutral-500 italic text-sm">
                   Welcome back! You have {user?.role === 'tenant' ? `${data.favorites.length} saved properties` : `${data.properties.length} total listings`}.
                </p>
              </div>
            </div>
          )}

          {activeTab === "favorites" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">My Favorite Properties</h2>
              {data.favorites.length === 0 ? (
                <div className="text-center py-20 glass rounded-3xl">
                  <Heart className="w-12 h-12 mx-auto text-neutral-200 mb-2" />
                  <p className="text-neutral-500">No favorites yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.favorites.map(prop => (
                    <PropertyCard key={prop._id} property={prop} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "properties" && (
             <div className="space-y-6">
                <h2 className="text-2xl font-bold">Property Management</h2>
                <div className="grid gap-4">
                   {data.properties.map(prop => (
                      <div key={prop._id} className="glass p-4 rounded-2xl flex items-center justify-between border border-neutral-100">
                         <div className="flex items-center gap-4">
                            <img src={prop.images[0]} className="w-16 h-16 rounded-xl object-cover" alt="" />
                            <div>
                               <h4 className="font-bold">{prop.title}</h4>
                               <p className="text-xs text-neutral-500">{prop.location}</p>
                            </div>
                         </div>
                         <div className="flex gap-2">
                            {user?.role === 'admin' && !prop.isApproved && (
                               <button onClick={() => handleApprove(prop._id)} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold">Approve</button>
                            )}
                            <button onClick={() => handleDeleteProperty(prop._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {activeTab === "inquiries" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Respective Inquiries</h2>
              <div className="grid gap-4">
                {data.inquiries.map(inq => (
                  <div key={inq._id} className="glass p-5 rounded-2xl flex items-center justify-between border border-neutral-100">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 p-3 rounded-xl text-green-600"><MessageSquare className="w-6 h-6" /></div>
                      <div>
                        <h4 className="font-bold">{inq.propertyId?.title || "Property Inquiry"}</h4>
                        <p className="text-xs text-neutral-500">{new Date(inq.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${inq.status === 'responded' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                      {inq.status || 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;