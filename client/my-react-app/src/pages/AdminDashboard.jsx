import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Users, Home, CheckCircle, XCircle, Clock, 
  Trash2, Shield, Search, Loader2, MapPin 
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("properties");
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // 1. Fetch properties with adminMode=true to see Pending + Approved
      const propsRes = await axios.get("/api/properties?adminMode=true", config);
      setProperties(propsRes.data);
      
      // 2. Fetch all users
      const usersRes = await axios.get("/api/admin/users", config);
      setUsers(usersRes.data);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- APPROVE PROPERTY ---
  const handleApprove = async (id) => {
    try {
      await axios.patch(`/api/admin/properties/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setProperties(properties.map(p => p._id === id ? { ...p, isApproved: true } : p));
      alert("Property approved successfully!");
    } catch (err) {
      alert("Approval failed");
    }
  };

  // --- DELETE PROPERTY ---
  const handleDeleteProperty = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property? This will also remove images from storage.")) return;
    try {
      await axios.delete(`/api/properties/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setProperties(properties.filter(p => p._id !== id));
      alert("Property deleted.");
    } catch (err) {
      alert("Delete failed");
    }
  };

  // --- DELETE USER ---
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      await axios.delete(`/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setUsers(users.filter(u => u._id !== id));
      alert("User removed.");
    } catch (err) {
      alert("Failed to delete user.");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin w-10 h-10 text-brand-600" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Shield className="text-brand-600" /> Admin Control Panel
        </h1>
        
        <div className="flex bg-neutral-100 p-1 rounded-xl shadow-inner">
          <button 
            onClick={() => setActiveTab("properties")}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${activeTab === "properties" ? "bg-white shadow-sm text-brand-600" : "text-neutral-500 hover:text-neutral-700"}`}
          >
            Properties ({properties.length})
          </button>
          <button 
            onClick={() => setActiveTab("users")}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${activeTab === "users" ? "bg-white shadow-sm text-brand-600" : "text-neutral-500 hover:text-neutral-700"}`}
          >
            Users ({users.length})
          </button>
        </div>
      </div>

      {activeTab === "properties" ? (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-neutral-700">Manage Listings</h2>
          <div className="grid gap-4">
            {properties.map(prop => (
              <div key={prop._id} className="glass p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-neutral-100">
                <div className="flex items-center gap-5 w-full md:w-auto">
                  <img src={prop.images[0]} className="w-24 h-20 rounded-xl object-cover shadow-sm" alt="" />
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{prop.title}</h3>
                    <p className="text-neutral-500 text-sm flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" /> {prop.location}
                    </p>
                    <div className="mt-3 flex gap-2">
                      {prop.isApproved ? (
                        <span className="bg-green-50 text-green-600 text-[10px] font-bold uppercase px-2.5 py-1 rounded-md border border-green-100 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Live
                        </span>
                      ) : (
                        <span className="bg-amber-50 text-amber-600 text-[10px] font-bold uppercase px-2.5 py-1 rounded-md border border-amber-100 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Pending Approval
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                  {!prop.isApproved && (
                    <button 
                      onClick={() => handleApprove(prop._id)}
                      className="flex-1 md:flex-none bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-green-700 transition-all flex items-center gap-2"
                    >
                      Approve
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeleteProperty(prop._id)}
                    className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Delete Property"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-neutral-700">Manage Users</h2>
          <div className="overflow-x-auto glass rounded-3xl border border-neutral-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 text-neutral-500 text-sm">
                  <th className="p-5 font-semibold">User</th>
                  <th className="p-5 font-semibold">Email</th>
                  <th className="p-5 font-semibold">Role</th>
                  <th className="p-5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="p-5">
                      <div className="font-bold text-neutral-800">{u.name}</div>
                    </td>
                    <td className="p-5 text-neutral-600">{u.email}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        u.role === 'admin' ? 'bg-red-100 text-red-600' : 
                        u.role === 'owner' ? 'bg-blue-100 text-blue-600' : 
                        'bg-neutral-100 text-neutral-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      {u.role !== 'admin' && (
                        <button 
                          onClick={() => handleDeleteUser(u._id)}
                          className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;