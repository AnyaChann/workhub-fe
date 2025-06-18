// filepath: d:\Semester4\workHub\workhub-fe\src\features\auth\hooks\useAuthSubmit.js
import { useState } from 'react';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export const useAuthSubmit = (type) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { login, refreshAuthState } = useAuth();
  const navigate = useNavigate();

  const submitLogin = async (credentials, options = {}) => {
    try {
      setIsLoading(true);
      setError('');
      setMessage('');
      
      console.log('🚀 useAuthSubmit: Starting login process...');

      // ✅ Step 1: Check AuthService state before login
      const beforeState = authService.getAuthState();
      console.log('📊 STEP 1: AuthService state BEFORE login:', beforeState);

      // ✅ Step 2: Call login through AuthContext (which uses AuthService)
      console.log('📊 STEP 2: Calling AuthContext login...');
      const result = await login(credentials);
      
      // ✅ Step 3: Check AuthService state after login
      const afterState = authService.getAuthState();
      console.log('📊 STEP 3: AuthService state AFTER login:', afterState);

      if (!afterState.isAuthenticated || !afterState.user) {
        console.error('❌ CRITICAL: AuthService not authenticated after login!');
        throw new Error('Authentication failed - service state not updated');
      }

      // ✅ Step 4: Force AuthContext to sync with AuthService
      console.log('📊 STEP 4: Syncing AuthContext with AuthService...');
      refreshAuthState();

      // ✅ Step 5: Wait for React state updates
      await new Promise(resolve => setTimeout(resolve, 100));

      // ✅ Step 6: Final verification
      const finalState = authService.getAuthState();
      console.log('📊 STEP 6: Final AuthService state:', finalState);

      if (!finalState.isAuthenticated || !finalState.user) {
        console.error('❌ CRITICAL: Final state check failed!');
        throw new Error('Authentication state lost after login');
      }

      // ✅ Step 7: Success callback
      if (options.onSuccess) {
        console.log('📊 STEP 7: Calling success callback');
        options.onSuccess(result, 'Login successful');
      }

      setMessage('Login successful');

      // ✅ Step 8: Navigate based on user role
      const userData = finalState.user;
      const dashboardPath = userData.role?.toLowerCase() === 'recruiter' 
        ? '/recruiter/dashboard' 
        : userData.role?.toLowerCase() === 'candidate'
        ? '/candidate/dashboard'
        : userData.role?.toLowerCase() === 'admin'
        ? '/admin/dashboard'
        : '/dashboard';
      
      console.log('📊 STEP 8: Navigation to:', dashboardPath);
      console.log('👤 User role:', userData.role);

      // Navigate with slight delay
      setTimeout(() => {
        console.log('🔄 Executing navigation to:', dashboardPath);
        navigate(dashboardPath, { replace: true });
      }, 200);

      return result;

    } catch (error) {
      console.error('❌ useAuthSubmit: Login failed:', error.message);
      console.error('📊 Final AuthService state on error:', authService.getAuthState());
      
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const submitRegister = async (userData, options = {}) => {
    try {
      setIsLoading(true);
      setError('');
      setMessage('');
      
      console.log('📝 useAuthSubmit: Starting registration...');
      
      // Call AuthService directly for registration
      const result = await authService.register(userData);
      
      setMessage('Registration successful');
      
      if (options.onSuccess) {
        options.onSuccess(result, 'Registration successful');
      }

      return result;

    } catch (error) {
      console.error('❌ useAuthSubmit: Registration failed:', error);
      setError(error.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitLogin,
    submitRegister,
    isLoading,
    error,
    message
  };
};