import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { 
  Home, 
  Search, 
  PlusCircle, 
  LayoutDashboard, 
  LogOut, 
  User, 
  ShieldCheck, 
  List 
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-brand-600 p-1.5 rounded-lg shadow-sm">
              <Home className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-neutral-900">
              HOUSE<span className="text-brand-600">HUNT</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/properties" className="text-neutral-600 hover:text-brand-600 font-medium transition-colors flex items-center gap-2">
              <Search className="w-4 h-4" /> Explore
            </Link>

            {/* Admin Specific Link */}
            {user?.role === "admin" && (
              <Link to="/admin-dashboard" className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Admin Panel
              </Link>
            )}

            {/* Owner Specific Links */}
            {user?.role === "owner" && (
              <>
                <Link to="/my-listings" className="text-neutral-600 hover:text-brand-600 font-medium transition-colors flex items-center gap-2">
                  <List className="w-4 h-4" /> My Listings
                </Link>
                <Link to="/add-property" className="text-neutral-600 hover:text-brand-600 font-medium transition-colors flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" /> List Property
                </Link>
              </>
            )}

            {/* General Dashboard for Logged-in Users */}
            {user && user.role !== "admin" && (
              <Link to="/dashboard" className="text-neutral-600 hover:text-brand-600 font-medium transition-colors flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-neutral-100 rounded-full border border-neutral-200">
                  <User className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm font-semibold text-neutral-700">
                    {user.name} <span className="text-[10px] uppercase text-neutral-400 ml-1">({user.role})</span>
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-neutral-600 hover:text-brand-600 font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn-primary py-2 px-5 text-sm font-bold">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;