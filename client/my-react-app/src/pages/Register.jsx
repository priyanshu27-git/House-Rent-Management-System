import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { User, Mail, Lock, Phone, ArrowRight, Loader2 } from "lucide-react";

const Register = () => {
  const { login } = useAuth(); // Assuming login updates your AuthContext state
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Added to show backend errors in your UI

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "tenant", // Matches our Backend enum: ["tenant", "owner", "admin"]
  });

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const response = await axios.post("/api/auth/register", formData);
    
    // Extract both token and user from the backend response
    const { token, user } = response.data;

    // Call your Context's login function with BOTH arguments
    login(token, user); 
    
    navigate("/dashboard");
  } catch (err) {
    setError(err.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="glass max-w-md w-full p-8 rounded-3xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold">Create Account</h1>
          <p className="text-neutral-600 mt-2">Join HouseHunt to find your next home.</p>
        </div>

        {/* --- ERROR MESSAGE DISPLAY --- */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <User className="absolute left-3 top-3.5 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-neutral-400" />
            <input
              type="email"
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-3.5 w-5 h-5 text-neutral-400" />
            <input
              type="tel"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
              placeholder="Phone Number (Optional)"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-neutral-400" />
            <input
              type="password"
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
              placeholder="Password (Min 6 characters)"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-neutral-700">I am a:</label>
            <div className="flex gap-4">
              {["tenant", "owner"].map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`flex-1 py-3 rounded-xl border font-semibold transition-all ${
                    formData.role === r 
                      ? "bg-brand-50 border-brand-500 text-brand-600" 
                      : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
                  }`}
                  onClick={() => setFormData({ ...formData, role: r })}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-4 flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Sign Up 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-neutral-600">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-600 font-bold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;