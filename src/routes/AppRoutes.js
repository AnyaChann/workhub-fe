import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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

// Dashboard Layouts
import EmployerDashboardLayout from '../pages/Employer/Dashboard/DashboardLayout';

// Temp Dashboard for other roles
import TempDashboard from '../components/TempDashboard/TempDashboard';

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

      {/* Employer Dashboard Routes */}
      <Route 
        path={ROUTES.EMPLOYER.DASHBOARD} 
        element={
          <ProtectedRoute allowedRoles={['employer']}>
            <EmployerDashboardLayout />
          </ProtectedRoute>
        } 
      />

      {/* Employer Base Route Redirect */}
      <Route 
        path={ROUTES.EMPLOYER.BASE} 
        element={<Navigate to={ROUTES.EMPLOYER.JOBS.ACTIVE} replace />} 
      />

      {/* Candidate Dashboard Routes */}
      <Route 
        path={ROUTES.CANDIDATE.DASHBOARD} 
        element={
          <ProtectedRoute allowedRoles={['candidate']}>
            <CandidateDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Candidate Base Route Redirect */}
      <Route 
        path={ROUTES.CANDIDATE.BASE} 
        element={<Navigate to={ROUTES.CANDIDATE.DASHBOARD_BASE} replace />} 
      />

      {/* Admin Dashboard Routes */}
      <Route 
        path={ROUTES.ADMIN.DASHBOARD} 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Admin Base Route Redirect */}
      <Route 
        path={ROUTES.ADMIN.BASE} 
        element={<Navigate to={ROUTES.ADMIN.DASHBOARD_BASE} replace />} 
      />

      {/* Error routes */}
      <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
      
      {/* 404 route - Must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;