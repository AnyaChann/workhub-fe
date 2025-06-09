import React from 'react';
import { Navigate } from 'react-router-dom';
import ROUTES from './routeConstants';

// Component để bảo vệ các route cần đăng nhập
const ProtectedRoute = ({ children }) => {
  // Kiểm tra authentication (tạm thời return true)
  const isAuthenticated = true; // TODO: Implement actual auth logic
  
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
};

export default ProtectedRoute;