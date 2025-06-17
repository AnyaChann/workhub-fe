import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ROUTES from './routeConstants';
import ProtectedRoute from './ProtectedRoute';

// Public pages
import Home from '../../features/marketing/pages/Home/Home';
import Pricing from '../../features/marketing/pages/Pricing/Pricing';

// Auth pages
import Login from '../../features/auth/pages/Login/Login';
import Register from '../../features/auth/pages/Register/Register';
import ForgotPassword from '../../features/auth/pages/ForgotPassword/ForgotPassword';

// Error pages
import NotFound from '../../features/common/components/NotFound/NotFound';

// Dashboard Layouts
import EmployerDashboardLayout from '../../features/dashboard/layouts/DashboardLayout';

// Temp Dashboard for other roles
import TempDashboard from '../../shared/components/TempDashboard/TempDashboard';

const CandidateDashboard = () => <TempDashboard userType="Candidate" title="Candidate Dashboard" />;
const AdminDashboard = () => <TempDashboard userType="Admin" title="Admin Dashboard" />;

const AppRoutes = () => {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Home />} />

      {/* Public routes */}
      <Route path={ROUTES.PRICING} element={<Pricing />} />

      {/* Auth routes */}
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />

      {/* ✅ Employer Dashboard Routes - Properly nested */}
      <Route 
        path="/employer/dashboard/*" 
        element={
          <ProtectedRoute allowedRoles={['employer']}>
            <EmployerDashboardLayout />
          </ProtectedRoute>
        } 
      />

      {/* ✅ Employer base redirects */}
      <Route 
        path="/employer/dashboard" 
        element={<Navigate to="/employer/dashboard/jobs/active" replace />} 
      />
      <Route 
        path="/employer" 
        element={<Navigate to="/employer/dashboard/jobs/active" replace />} 
      />

      {/* Candidate Dashboard Routes */}
      <Route 
        path="/candidate/dashboard/*" 
        element={
          <ProtectedRoute allowedRoles={['candidate']}>
            <CandidateDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/candidate" 
        element={<Navigate to="/candidate/dashboard" replace />} 
      />

      {/* Admin Dashboard Routes */}
      <Route 
        path="/admin/dashboard/*" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={<Navigate to="/admin/dashboard" replace />} 
      />

      {/* Error routes */}
      <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
      
      {/* 404 route - Must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;