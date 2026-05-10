import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

export default function ProtectedRoute({ adminOnly = false }) {
  const { currentUser, userProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader />;
  if (!currentUser) return <Navigate to="/login" replace state={{ from: location }} />;
  if (adminOnly && userProfile?.role !== 'Admin') return <Navigate to="/" replace />;

  return <Outlet />;
}
