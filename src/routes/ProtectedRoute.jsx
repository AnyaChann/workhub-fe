import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ROUTES from './routeConstants';

// Loading component
const LoadingScreen = () => (
  <div className="loading-screen" style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column'
  }}>
    <div className="loading-spinner" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <div className="spinner" style={{
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #00d4aa',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p>Loading...</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const { user, loading, isAuthenticated } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate 
      to={ROUTES.LOGIN} 
      state={{ from: location.pathname }} 
      replace 
    />;
  }

  // Check role-based access
  if (allowedRoles.length > 0 && user) {
    const userRole = user?.role?.toLowerCase();
    
    if (!allowedRoles.includes(userRole)) {
      // Redirect to appropriate dashboard based on user role
      switch (userRole) {
        case 'employer':
          return <Navigate to={ROUTES.EMPLOYER.DASHBOARD} replace />;
        case 'candidate':
          return <Navigate to={ROUTES.CANDIDATE.DASHBOARD} replace />;
        case 'admin':
          return <Navigate to={ROUTES.ADMIN.DASHBOARD} replace />;
        default:
          return <Navigate to={ROUTES.NOT_FOUND} replace />;
      }
    }
  }

  return children;
};

export default ProtectedRoute;