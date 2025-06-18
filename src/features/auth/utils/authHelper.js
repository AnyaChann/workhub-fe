// Auth helper utilities

export const authHelper = {
  // ✅ Storage management
  clearAuthStorage: () => {
    const keysToRemove = [
      'authToken',
      'user',
      'refreshToken',
      'authExpiry',
      'userPreferences'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  },

  // ✅ Check if user needs to logout (expired token, etc.)
  shouldLogout: () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      return true;
    }
    
    // Add token expiry check if you have it
    const expiry = localStorage.getItem('authExpiry');
    if (expiry && new Date() > new Date(expiry)) {
      return true;
    }
    
    return false;
  },

  // ✅ Auto logout if needed
  autoLogoutIfNeeded: () => {
    if (authHelper.shouldLogout()) {
      console.log('🔄 Auto logout triggered');
      authHelper.clearAuthStorage();
      window.location.href = '/login';
      return true;
    }
    return false;
  },

  // ✅ Safe logout (handles errors gracefully)
  safeLogout: (redirectTo = '/login') => {
    try {
      authHelper.clearAuthStorage();
      console.log('✅ Safe logout completed');
    } catch (error) {
      console.error('❌ Safe logout error:', error);
    } finally {
      window.location.href = redirectTo;
    }
  }
};



export default authHelper;