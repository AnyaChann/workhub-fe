import React, { createContext, useContext, useState } from 'react';
import { PageLoadingSpinner } from '@components/ui/LoadingSpinner/LoadingSpinner';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [globalLoading, setGlobalLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  const showGlobalLoading = (message = 'Loading...') => {
    setLoadingMessage(message);
    setGlobalLoading(true);
  };

  const hideGlobalLoading = () => {
    setGlobalLoading(false);
  };

  return (
    <LoadingContext.Provider value={{
      showGlobalLoading,
      hideGlobalLoading,
      globalLoading
    }}>
      {children}
      {globalLoading && (
        <PageLoadingSpinner message={loadingMessage} />
      )}
    </LoadingContext.Provider>
  );
};

export const useGlobalLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within LoadingProvider');
  }
  return context;
};
