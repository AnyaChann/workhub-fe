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

    // Add this method inside useAuthSubmit hook
  const submitForgotPassword = async (email, options = {}) => {
    try {
      setIsLoading(true);
      setError('');
      setMessage('');
      
      console.log('📧 useAuthSubmit: Starting forgot password for:', email);
      
      // ✅ Call AuthService forgot password
      const result = await authService.forgotPassword(email);
      
      console.log('✅ useAuthSubmit: Forgot password result:', result);
      
      if (result.success) {
        const successMsg = result.message || 'Password reset email sent successfully';
        setMessage(successMsg);
        
        if (options.onSuccess) {
          options.onSuccess(result, successMsg);
        }
        
        // ✅ Optional: Navigate to success page or stay on current page
        // No automatic navigation for forgot password
      }
  
      return result;
  
    } catch (error) {
      console.error('❌ useAuthSubmit: Forgot password failed:', error);
      setError(error.message || 'Failed to send reset email');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const submitResetPassword = async (resetData, options = {}) => {
    try {
      setIsLoading(true);
      setError('');
      setMessage('');
      
      console.log('🔑 useAuthSubmit: Starting password reset...');
      
      // ✅ Call AuthService reset password
      const result = await authService.resetPassword(resetData.token, resetData.newPassword);
      
      console.log('✅ useAuthSubmit: Password reset result:', result);
      
      if (result.success) {
        const successMsg = result.message || 'Password reset successfully';
        setMessage(successMsg);
        
        if (options.onSuccess) {
          options.onSuccess(result, successMsg);
        }
        
        // ✅ Optional: Navigate to login page after successful reset
        // No automatic navigation - let component handle it
      }
  
      return result;
  
    } catch (error) {
      console.error('❌ useAuthSubmit: Password reset failed:', error);
      setError(error.message || 'Failed to reset password');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const submitRegister = async (userData, options = {}) => {
    let registrationType = 'recruiter'; // Default registration type
    try {
      setIsLoading(true);
      setError('');
      setMessage('');

      // ✅ Determine registration type
      const registrationType = userData.registrationType || type || 'recruiter';

      console.log(`📝 useAuthSubmit: Starting ${registrationType} registration...`);

      // ✅ Call appropriate AuthService method based on type
      let result;
      if (registrationType === 'candidate') {
        result = await authService.registerCandidate(userData);
      } else {
        result = await authService.registerRecruiter(userData);
      }

      console.log(`✅ useAuthSubmit: ${registrationType} registration result:`, {
        success: result.success,
        hasToken: !!result.token,
        hasUser: !!result.user,
        requiresVerification: result.requiresVerification,
        autoLogin: result.autoLogin,
        userStatus: result.user?.status
      });

      if (result.success) {
        const successMsg = result.message || `${registrationType} account created successfully`;
        setMessage(successMsg);

        if (options.onSuccess) {
          options.onSuccess(result, successMsg);
        }

        // ✅ Handle different registration outcomes
        if (result.autoLogin && result.token && result.user) {
          // ✅ Auto-login for verified accounts
          console.log(`🔄 Auto-login verified ${registrationType}...`);

          // Refresh auth context to sync with AuthService
          refreshAuthState();

          // Navigate to appropriate dashboard
          const dashboardPath = registrationType === 'recruiter'
            ? '/recruiter/dashboard'
            : '/candidate/dashboard';

          setTimeout(() => {
            console.log(`🎯 Navigating to ${dashboardPath}`);
            navigate(dashboardPath, { replace: true });
          }, 1500); // Give user time to see success message

        } else if (result.requiresVerification) {
          // ✅ Verification required - redirect to verification page
          console.log('📧 Redirecting to verification flow...');

          setTimeout(() => {
            navigate('/account/unverified', {
              state: {
                message: `Registration successful! Please check your email to verify your ${registrationType} account.`,
                email: userData.email,
                type: registrationType,
                hasToken: !!result.token // Pass token info for debugging
              }
            });
          }, 2000);

        } else {
          // ✅ Fallback: redirect to login
          console.log('🔄 Redirecting to login...');

          setTimeout(() => {
            navigate('/login', {
              state: {
                message: `${registrationType} account created! Please sign in to continue.`,
                email: userData.email
              }
            });
          }, 2000);
        }
      }

      return result;

    } catch (error) {
      console.error(`❌ useAuthSubmit: ${registrationType || 'user'} registration failed:`, error);
      setError(error.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }
  return {
    submitLogin,
    submitForgotPassword,
    submitResetPassword,
    submitRegister,
    isLoading,
    error,
    message
  };
};