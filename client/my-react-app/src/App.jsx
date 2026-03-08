import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./Context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';
import AddProperty from "./pages/AddProperty";
import Dashboard from "./pages/Dashboard";
import MyListings from "./pages/MyListings";


const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

  return <>{children}</>;
};

const AppContent = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route element={<AdminRoute />}></Route>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route 
            path="/add-property" 
            element={
              <ProtectedRoute roles={["owner", "admin"]}>
                <AddProperty />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      
      <footer className="bg-neutral-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <h3 className="text-xl font-bold tracking-tight">
                HOUSE<span className="text-brand-500">HUNT</span>
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Making house hunting simple, secure, and stress-free for everyone. Find your next home with confidence.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-neutral-400 text-sm">
                <li><a href="/properties" className="hover:text-brand-500 transition-colors">Browse Homes</a></li>
                <li><a href="/register?role=owner" className="hover:text-brand-500 transition-colors">List Property</a></li>
                <li><a href="/dashboard" className="hover:text-brand-500 transition-colors">My Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-neutral-400 text-sm">
                <li><a href="#" className="hover:text-brand-500 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-brand-500 transition-colors">Safety Tips</a></li>
                <li><a href="#" className="hover:text-brand-500 transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Newsletter</h4>
              <p className="text-neutral-400 text-sm mb-4">Get the latest listings and news delivered to your inbox.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Email" className="bg-neutral-800 border-none rounded-lg px-3 py-2 text-sm w-full outline-none focus:ring-1 focus:ring-brand-500" />
                <button className="bg-brand-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-700 transition-colors">Join</button>
              </div>
            </div>
          </div>
          <div className="border-t border-neutral-800 mt-12 pt-8 text-center text-neutral-500 text-xs">
            &copy; {new Date().getFullYear()} HOUSEHUNT. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}