import React from 'react';
import { AuthProvider as AuthContextProvider } from '../contexts/AuthContext';

// Main App Providers wrapper
export const AppProviders = ({ children }) => {
  return (
    <AuthContextProvider>
      {children}
    </AuthContextProvider>
  );
};

// Export individual providers for flexibility
export { AuthProvider } from '../contexts/AuthContext';

export default AppProviders;