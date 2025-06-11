import React from 'react';
import { Routes, Route } from 'react-router-dom';
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

// Temporary Dashboard Components for other roles
const TemporaryDashboard = ({ userType }) => (
  <div style={{
    padding: '2rem',
    textAlign: 'center',
    background: '#f8f9fa',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <h1 style={{ color: '#28a745', marginBottom: '1rem' }}>
      🎉 Login Successful!
    </h1>
    <h2 style={{ color: '#333', marginBottom: '2rem' }}>
      Welcome to {userType} Dashboard
    </h2>
    <div style={{
      background: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      maxWidth: '600px'
    }}>
      <h3 style={{ color: '#666', marginBottom: '1rem' }}>
        Dashboard Features Coming Soon:
      </h3>
      <ul style={{
        textAlign: 'left',
        color: '#666',
        lineHeight: '1.8'
      }}>
        {userType === 'Candidate' && (
          <>
            <li>🎯 Personalized Job Recommendations</li>
            <li>📄 Resume Builder & Management</li>
            <li>📋 Application Tracking</li>
            <li>⭐ Saved Jobs & Favorites</li>
            <li>👤 Profile Management</li>
            <li>💬 Employer Communications</li>
          </>
        )}
        {userType === 'Admin' && (
          <>
            <li>👥 User Management</li>
            <li>🏢 Company Management</li>
            <li>💼 Job Oversight</li>
            <li>📊 System Analytics</li>
            <li>📦 Package Management</li>
            <li>⚙️ System Settings</li>
          </>
        )}
      </ul>
    </div>
    <button 
      onClick={() => window.location.href = '/'}
      style={{
        marginTop: '2rem',
        padding: '0.75rem 2rem',
        background: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1rem',
        cursor: 'pointer'
      }}
    >
      🏠 Back to Home
    </button>
  </div>
);

const CandidateDashboard = () => <TemporaryDashboard userType="Candidate" />;
const AdminDashboard = () => <TemporaryDashboard userType="Admin" />;

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