import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../core/contexts/AuthContext';
// import { PageLoadingSpinner } from '@components/ui/LoadingSpinner/LoadingSpinner';
import ROUTES from './routeConstants';


const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  // Show loading while checking authentication
  // if (loading) {
  //   return <PageLoadingSpinner message="Checking authentication..." />;
  // }

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
