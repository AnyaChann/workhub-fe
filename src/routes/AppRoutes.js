import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ROUTES from './routeConstants';
import ProtectedRoute from './ProtectedRoute';

// Public pages
import Home from '../pages/Employer/Home/Home';
import Pricing from '../pages/Employer/Pricing/Pricing';

// Auth pages
import Login from '../pages/Auth/Login/Login';
import Register from '../pages/Auth/Register/Register';
import ForgotPassword from '../pages/Auth/ForgotPassword/ForgotPassword';

// Error pages
import NotFound from '../pages/NotFound/NotFound';

// Real Dashboard Components
import DashboardLayout from '../pages/Employer/Dashboard/DashboardLayout';

// Import TempDashboard component
import TempDashboard from '../components/TempDashboard/TempDashboard';

const CandidateDashboard = () => <TempDashboard userType="Candidate" title="Candidate Dashboard" />;
const AdminDashboard = () => <TempDashboard userType="Admin" title="Admin Dashboard" />;

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path={ROUTES.PRICING} element={<Pricing />} />

      {/* Auth routes */}
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />

      {/* Employer protected routes - Using real DashboardLayout */}
      <Route 
        path={ROUTES.EMPLOYER.DASHBOARD} 
        element={
          <ProtectedRoute allowedRoles={['employer']}>
            <DashboardLayout />
          </ProtectedRoute>
        } 
      />

      {/* Alternative employer routes */}
      <Route 
        path="/employer" 
        element={
          <ProtectedRoute allowedRoles={['employer']}>
            <DashboardLayout />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/employer/home" 
        element={
          <ProtectedRoute allowedRoles={['employer']}>
            <DashboardLayout />
          </ProtectedRoute>
        } 
      />

      {/* Candidate protected routes */}
      <Route 
        path={ROUTES.CANDIDATE.DASHBOARD} 
        element={
          <ProtectedRoute allowedRoles={['candidate']}>
            <CandidateDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Admin protected routes */}
      <Route 
        path={ROUTES.ADMIN.DASHBOARD} 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Error routes */}
      <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
      
      {/* 404 route - Must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;