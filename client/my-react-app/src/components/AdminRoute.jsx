import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { Loader2 } from 'lucide-react';

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-brand-600" /></div>;

  // If user exists and is an admin, show the dashboard (Outlet)
  // Otherwise, kick them back to the Home page
  return user && user.role === 'admin' ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;