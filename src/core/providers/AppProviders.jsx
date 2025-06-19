import React from 'react';
import { AuthProvider as AuthContextProvider } from '../contexts/AuthContext';
import AuthTestPanel from '../../shared/components/AuthTestPanel/AuthTestPanel';

// Main App Providers wrapper
export const AppProviders = ({ children }) => {
  return (
    <AuthContextProvider>
      {children}
      {process.env.NODE_ENV === 'development' && (
          <AuthTestPanel />
        )}
    </AuthContextProvider>
  );
};

// Export individual providers for flexibility
export { AuthProvider } from '../contexts/AuthContext';

export default AppProviders;