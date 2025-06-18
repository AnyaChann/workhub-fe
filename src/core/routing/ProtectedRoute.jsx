import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PageLoadingSpinner } from '../../shared/components/LoadingSpinner/LoadingSpinner';
import ROUTES, { getDefaultDashboard } from './routeConstants';

const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  requireVerified = false,
  fallbackPath = null 
}) => {
  const location = useLocation();
  const { 
    user, 
    isAuthenticated, 
    isLoading,
    isInitialized,
    isAccountActive,
    isAccountUnverified,
    isAccountSuspended,
    isAccountBanned,
    userRole
  } = useAuth();

  console.log('🛡️ ProtectedRoute check:', {
    path: location.pathname,
    isAuthenticated,
    isLoading,
    isInitialized,
    userRole,
    allowedRoles,
    hasUser: !!user
  });

  // ✅ Show loading while initializing authentication
  if (!isInitialized || isLoading) {
    return <PageLoadingSpinner message="Checking authentication..." />;
  }

  // ✅ Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    console.log('🔄 Redirecting to login - not authenticated');
    return <Navigate 
      to={ROUTES.LOGIN} 
      state={{ from: location.pathname }} 
      replace 
    />;
  }

  // ✅ Handle account status restrictions
  if (isAccountBanned && isAccountBanned()) {
    console.log('🚫 Account banned, redirecting');
    return <Navigate to={ROUTES.ACCOUNT_STATUS.BANNED} replace />;
  }

  if (isAccountSuspended && isAccountSuspended()) {
    console.log('⏸️ Account suspended, redirecting');
    return <Navigate to={ROUTES.ACCOUNT_STATUS.SUSPENDED} replace />;
  }

  // ✅ Handle unverified accounts
  if (isAccountUnverified && isAccountUnverified()) {
    // Some routes might be accessible for unverified users
    const allowedForUnverified = [
      ROUTES.ACCOUNT_STATUS.UNVERIFIED,
      ROUTES.ACTIVATE_ACCOUNT,
      '/candidate/dashboard/account',
      '/recruiter/dashboard/account'
    ];

    const isAllowedPath = allowedForUnverified.some(path => 
      location.pathname.startsWith(path)
    );

    if (!isAllowedPath) {
      console.log('📧 Account unverified, redirecting');
      return <Navigate to={ROUTES.ACCOUNT_STATUS.UNVERIFIED} replace />;
    }
  }

  // ✅ Check if verified account is required for this route
  if (requireVerified && isAccountActive && !isAccountActive()) {
    console.log('✅ Verified account required, redirecting');
    return <Navigate to={ROUTES.ACCOUNT_STATUS.UNVERIFIED} replace />;
  }

  // ✅ Check role-based access
  if (allowedRoles.length > 0 && user) {
    const currentUserRole = userRole || user.role?.toLowerCase();
    
    console.log('🔑 Role check:', { currentUserRole, allowedRoles });
    
    if (!allowedRoles.includes(currentUserRole)) {
      // Use fallback path if provided, otherwise redirect to user's dashboard
      const redirectPath = fallbackPath || getDefaultDashboard(user.role);
      
      console.log('🔄 Role not allowed, redirecting to:', redirectPath);
      return <Navigate to={redirectPath} replace />;
    }
  }

  console.log('✅ ProtectedRoute: Access granted');
  return children;
};

// ✅ Role-specific route components
export const RecruiterRoute = ({ children, requireVerified = false }) => (
  <ProtectedRoute allowedRoles={['recruiter']} requireVerified={requireVerified}>
    {children}
  </ProtectedRoute>
);

export const CandidateRoute = ({ children, requireVerified = false }) => (
  <ProtectedRoute allowedRoles={['candidate']} requireVerified={requireVerified}>
    {children}
  </ProtectedRoute>
);

export const AdminRoute = ({ children, requireVerified = true }) => (
  <ProtectedRoute allowedRoles={['admin']} requireVerified={requireVerified}>
    {children}
  </ProtectedRoute>
);

export const StaffRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;