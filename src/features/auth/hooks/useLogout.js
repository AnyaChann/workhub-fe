import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export const useLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const logout = async (options = {}) => {
    const {
      redirectTo = '/login',
      showConfirmation = false,
      confirmationMessage = 'Are you sure you want to log out?',
      force = false,
      onSuccess,
      onError
    } = options;

    // Show confirmation if requested
    if (showConfirmation && !window.confirm(confirmationMessage)) {
      return { cancelled: true };
    }

    setIsLoggingOut(true);

    try {
      console.log('🚪 Starting logout process...');

      // Use force logout if requested
      const result = force ? authService.forceLogout() : authService.logout();

      if (result.success) {
        console.log('✅ Logout successful');

        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess(result);
        }

        // Handle redirection
        if (redirectTo) {
          if (typeof redirectTo === 'function') {
            redirectTo(navigate);
          } else if (redirectTo.startsWith('/')) {
            navigate(redirectTo, { replace: true });
          } else {
            window.location.href = redirectTo;
          }
        }

        return result;
      } else {
        throw new Error(result.message || 'Logout failed');
      }

    } catch (error) {
      console.error('❌ Logout error:', error);

      // Call onError callback if provided
      if (onError) {
        onError(error);
      }

      // Still redirect even if there's an error
      if (redirectTo) {
        navigate(redirectTo, { replace: true });
      }

      return {
        success: false,
        error: error.message
      };

    } finally {
      setIsLoggingOut(false);
    }
  };

  const quickLogout = () => {
    return logout({ redirectTo: '/login' });
  };

  const forceLogout = () => {
    return logout({ force: true, redirectTo: '/login' });
  };

  const logoutWithConfirmation = () => {
    return logout({ 
      showConfirmation: true,
      confirmationMessage: 'Are you sure you want to log out?',
      redirectTo: '/login'
    });
  };

  return {
    logout,
    quickLogout,
    forceLogout,
    logoutWithConfirmation,
    isLoggingOut
  };
};

export default useLogout;