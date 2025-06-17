import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../../features/auth/services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            
            console.log('🔐 Restored user session:', {
              id: parsedUser.id,
              email: parsedUser.email,
              role: parsedUser.role
            });
            
            // Optionally validate with server
            try {
              const currentUser = await authService.getCurrentUser();
              if (currentUser && currentUser.id) {
                setUser(currentUser);
                localStorage.setItem('user', JSON.stringify(currentUser));
              }
            } catch (error) {
              console.log('Server validation failed, using cached user data');
            }
          } catch (error) {
            console.error('Invalid stored user data, clearing session');
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      
      console.log('✅ User logged in successfully:', response.user);
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      console.log('🔐 User logged out');
    }
  };

  // ✅ Fix getDashboardUrl - return EXACT paths
  const getDashboardUrl = () => {
    const role = user?.role?.toLowerCase();
    switch (role) {
      case 'employer':
        return '/employer/dashboard/jobs/active'; // ✅ Direct to jobs/active
      case 'candidate':
        return '/candidate/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  // Helper functions
  const getUserFullName = () => user?.fullname || 'User';
  const getUserEmail = () => user?.email || '';
  const getUserPhone = () => user?.phone || '';
  const getUserAvatar = () => user?.avatar || '';
  const getUserStatus = () => user?.status || 'UNKNOWN';
  const getUserCreatedAt = () => user?.createdAt || null;
  const getUserResumeList = () => user?.resumeList || [];

  const value = {
    user,
    login,
    logout,
    loading,
    initialized,
    isAuthenticated: !!user,
    userRole: user?.role?.toLowerCase() || null,
    
    // User info helpers
    getUserFullName,
    getUserEmail,
    getUserPhone,
    getUserAvatar,
    getUserStatus,
    getUserCreatedAt,
    getUserResumeList,
    getDashboardUrl,
    
    // Direct access to user properties (with fallbacks)
    userId: user?.id || null,
    fullname: user?.fullname || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
    status: user?.status || 'UNKNOWN',
    createdAt: user?.createdAt || null,
    resumeList: user?.resumeList || []
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;