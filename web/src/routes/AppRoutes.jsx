import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import AdminDashboard from '../pages/AdminDashboard';
import Dashboard from '../pages/Dashboard';
import ForgotPassword from '../pages/ForgotPassword';
import LocationDetails from '../pages/LocationDetails';
import LocationEditor from '../pages/LocationEditor';
import Login from '../pages/Login';
import MapPage from '../pages/MapPage';
import NotFound from '../pages/NotFound';
import Profile from '../pages/Profile';
import Register from '../pages/Register';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>
      <Route element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/locations/:id" element={<LocationDetails />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/locations/new" element={<LocationEditor />} />
          <Route path="/locations/:id/edit" element={<LocationEditor />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
