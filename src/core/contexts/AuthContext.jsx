import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../../features/auth/services/authService';
import ROUTES from '../routing/routeConstants';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    isInitialized: false,
    error: null
  });

  // ... existing methods (initialize, login, register, logout) ...

  // ✅ Add missing helper methods for user data
  const getUserAvatar = useCallback(() => {
    if (!authState.user) return null;
    
    // Check various possible avatar fields
    return authState.user.avatar || 
           authState.user.profilePicture || 
           authState.user.picture || 
           authState.user.photo ||
           authState.user.avatarUrl ||
           null;
  }, [authState.user]);

  const getFullname = useCallback(() => {
    if (!authState.user) return '';
    
    // Check various possible name fields
    return authState.user.fullname || 
           authState.user.fullName || 
           authState.user.name || 
           authState.user.displayName ||
           `${authState.user.firstName || ''} ${authState.user.lastName || ''}`.trim() ||
           authState.user.email?.split('@')[0] ||
           'User';
  }, [authState.user]);

  const getEmail = useCallback(() => {
    return authState.user?.email || '';
  }, [authState.user]);

  const getCompanyName = useCallback(() => {
    if (!authState.user) return '';
    
    return authState.user.companyName || 
           authState.user.company?.name || 
           authState.user.organizationName ||
           'Company';
  }, [authState.user]);

  const getUserRole = useCallback(() => {
    return authState.user?.role?.toLowerCase() || '';
  }, [authState.user]);

  const getUserStatus = useCallback(() => {
    return authState.user?.status?.toLowerCase() || '';
  }, [authState.user]);

  // ✅ Initialize authentication with AuthService
  const initialize = useCallback(async () => {
    try {
      console.log('🔄 AuthContext: Initializing with AuthService...');
      
      const result = authService.initialize();
      
      if (result.success) {
        setAuthState({
          user: result.user,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
          error: null
        });
        console.log('✅ AuthContext: User restored from AuthService');
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
          error: null
        });
        console.log('ℹ️ AuthContext: No stored auth found');
      }
    } catch (error) {
      console.error('❌ AuthContext: Initialize error:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
        error: error.message
      });
    }
  }, []);

  // ✅ Login with AuthService
  const login = useCallback(async (credentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      console.log('🔐 AuthContext: Starting login with AuthService...');

      const result = await authService.login(credentials);

      if (result.success) {
        // Get the updated auth state from AuthService
        const currentState = authService.getAuthState();
        
        setAuthState({
          user: currentState.user,
          isAuthenticated: currentState.isAuthenticated,
          isLoading: false,
          isInitialized: true,
          error: null
        });
        
        console.log('✅ AuthContext: Login successful, state synced with AuthService');
        return result;
      } else {
        throw new Error('Login failed: Invalid response');
      }
    } catch (error) {
      console.error('❌ AuthContext: Login failed:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message
      }));
      throw error;
    }
  }, []);

  // ✅ Register with AuthService
  const register = useCallback(async (userData) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      console.log('📝 AuthContext: Starting registration with AuthService...');

      const result = await authService.register(userData);
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
      console.log('✅ AuthContext: Registration successful');
      return result;
    } catch (error) {
      console.error('❌ AuthContext: Registration failed:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message
      }));
      throw error;
    }
  }, []);

  // ✅ Logout with AuthService
  const logout = useCallback(() => {
    try {
      console.log('🚪 AuthContext: Logging out with AuthService...');
      
      authService.logout();
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
        error: null
      });
      
      console.log('✅ AuthContext: Logout successful');
      
      // Redirect to login
      setTimeout(() => {
        window.location.href = '/login';
      }, 100);
      
    } catch (error) {
      console.error('❌ AuthContext: Logout error:', error);
      // Force logout anyway
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
        error: null
      });
      window.location.href = '/login';
    }
  }, []);

  // ✅ Refresh auth state from AuthService
  const refreshAuthState = useCallback(() => {
    const currentState = authService.getAuthState();
    setAuthState(prev => ({
      ...prev,
      user: currentState.user,
      isAuthenticated: currentState.isAuthenticated
    }));
  }, []);

  // ✅ Account status methods
  const isAccountActive = useCallback(() => {
    return authState.user?.status === 'VERIFIED' || authState.user?.status === 'ACTIVE';
  }, [authState.user]);

  const isAccountUnverified = useCallback(() => {
    return authState.user?.status === 'UNVERIFIED' || authState.user?.status === 'PENDING';
  }, [authState.user]);

  const isAccountSuspended = useCallback(() => {
    return authState.user?.status === 'SUSPENDED';
  }, [authState.user]);

  const isAccountBanned = useCallback(() => {
    return authState.user?.status === 'BANNED';
  }, [authState.user]);

  // ✅ Role checking methods
  const isRecruiter = useCallback(() => {
    return authState.user?.role === 'RECRUITER' || authState.user?.role === 'recruiter';
  }, [authState.user]);

  const isCandidate = useCallback(() => {
    return authState.user?.role === 'CANDIDATE' || authState.user?.role === 'candidate';
  }, [authState.user]);

  const isAdmin = useCallback(() => {
    return authState.user?.role === 'ADMIN' || authState.user?.role === 'admin';
  }, [authState.user]);

  const isVerified = useCallback(() => {
    return authState.user?.status === 'VERIFIED' || 
           authState.user?.status === 'verified' || 
           authState.user?.verified === true;
  }, [authState.user]);

  // ✅ Dashboard URL helper
  const getDashboardUrl = useCallback(() => {
    if (!authState.user?.role) return '/login';
    
    switch (authState.user.role.toLowerCase()) {
      case 'recruiter':
        return ROUTES.RECRUITER.DASHBOARD;
      case 'candidate':
        return ROUTES.CANDIDATE.DASHBOARD;
      case 'admin':
        return ROUTES.ADMIN.DASHBOARD;
      default:
        console.warn('Unknown role:', authState.user.role);
        return '/login';
    }
  }, [authState.user]);

  // ✅ Initialize on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // ✅ Sync with AuthService state periodically (optional)
  useEffect(() => {
    if (authState.isInitialized) {
      const interval = setInterval(() => {
        const serviceState = authService.getAuthState();
        
        // Only update if there's a discrepancy
        if (serviceState.isAuthenticated !== authState.isAuthenticated ||
            serviceState.user?.id !== authState.user?.id) {
          console.log('🔄 AuthContext: Syncing with AuthService state');
          refreshAuthState();
        }
      }, 5000); // Check every 5 seconds

      return () => clearInterval(interval);
    }
  }, [authState.isInitialized, authState.isAuthenticated, authState.user?.id, refreshAuthState]);

  // ✅ Context value with all required properties
  const contextValue = {
    // Core state
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    loading: authState.isLoading,
    isLoading: authState.isLoading,
    initialized: authState.isInitialized,
    isInitialized: authState.isInitialized,
    error: authState.error,
    
    // Actions
    login,
    register,
    logout,
    refreshAuthState,
    
    // Account status helpers
    isAccountActive,
    isAccountUnverified, 
    isAccountSuspended,
    isAccountBanned,
    
    // Role helpers
    isRecruiter,
    isCandidate,
    isAdmin,
    isVerified,
    getDashboardUrl,
    
    // ✅ User data helpers
    getUserAvatar,
    getFullname,
    getEmail,
    getCompanyName,
    getUserRole,
    getUserStatus,
    
    // ✅ Convenience properties (for backward compatibility)
    userRole: getUserRole(),
    userId: authState.user?.id,
    userEmail: getEmail(),
    fullname: getFullname(),
    email: getEmail(),
    isReady: authState.isInitialized && !authState.isLoading,
    
    // Direct access to AuthService
    authService
  };

  // ✅ Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 AuthContext state:', {
      hasUser: !!authState.user,
      isAuthenticated: authState.isAuthenticated,
      isLoading: authState.isLoading,
      isInitialized: authState.isInitialized,
      userRole: getUserRole(),
      userStatus: getUserStatus(),
      fullname: getFullname(),
      email: getEmail(),
      error: authState.error,
      serviceAuth: authService.isAuthenticated(),
      timestamp: new Date().toISOString()
    });
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};