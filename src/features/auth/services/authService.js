import api from '../../../shared/utils/helpers/api';
import { jwtUtils } from '../../../shared/utils/helpers/jwtUtils';

class AuthService {
  constructor() {
    this.TOKEN_KEY = 'authToken';
    this.USER_KEY = 'user';
    this.REFRESH_KEY = 'refreshToken';
    this.isInitialized = false;
    this.authState = {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false
    };
  }

  // ✅ Initialize auth state from storage
  initialize() {
    try {
      console.log('🔄 AuthService: Initializing...');
      
      const token = this.getStoredToken();
      const user = this.getStoredUser();
      
      if (token && user && this.isValidToken(token)) {
        this.authState = {
          user,
          token,
          isAuthenticated: true,
          isLoading: false
        };
        console.log('✅ AuthService: Restored auth state from storage');
        return { success: true, user, token };
      } else {
        this.clearStorage();
        this.authState = {
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        };
        console.log('ℹ️ AuthService: No valid stored auth found');
        return { success: false, reason: 'No valid auth data' };
      }
    } catch (error) {
      console.error('❌ AuthService: Initialize error:', error);
      this.clearStorage();
      return { success: false, reason: error.message };
    } finally {
      this.isInitialized = true;
    }
  }

  // ✅ Login method with comprehensive error handling
  async login(credentials) {
    try {
      this.authState.isLoading = true;
      console.log('🔐 AuthService: Starting login for:', credentials.email);

      // Validate credentials
      if (!this.validateCredentials(credentials)) {
        throw new Error('Invalid credentials format');
      }

      // Clear any existing auth data
      this.clearStorage();

      // Build request
      const params = new URLSearchParams({
        email: credentials.email.trim(),
        password: credentials.password
      });

      const loginUrl = `/recruiter/login?${params.toString()}`;
      console.log('📡 AuthService: Making login request...');

      // Make API call
      const response = await api.post(loginUrl, {});
      console.log('📨 AuthService: Received response:', typeof response);

      // Process response
      const { token, user } = this.processLoginResponse(response, credentials);

      // Store auth data with atomic operation
      const stored = this.storeAuthData(token, user);
      if (!stored) {
        throw new Error('Failed to store authentication data');
      }

      // Update auth state
      this.authState = {
        user,
        token,
        isAuthenticated: true,
        isLoading: false
      };

      console.log('✅ AuthService: Login successful');
      return {
        success: true,
        user,
        token,
        message: 'Login successful'
      };

    } catch (error) {
      console.error('❌ AuthService: Login failed:', error);
      this.clearStorage();
      this.authState = {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      };
      throw this.processError(error);
    }
  }

  // ✅ Register method
  async register(userData) {
    try {
      this.authState.isLoading = true;
      console.log('� AuthService: Starting registration for:', userData.email);

      const response = await api.post('/recruiter/register', userData);
      
      console.log('✅ AuthService: Registration successful');
      return {
        success: true,
        user: response.user || response.data,
        message: response.message || 'Registration successful'
      };

    } catch (error) {
      console.error('❌ AuthService: Registration failed:', error);
      throw this.processError(error);
    } finally {
      this.authState.isLoading = false;
    }
  }

  // ✅ Logout method
  logout() {
    try {
      console.log('� AuthService: Logging out...');
      
      this.clearStorage();
      this.authState = {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      };
      
      console.log('✅ AuthService: Logout successful');
      return { success: true };
    } catch (error) {
      console.error('❌ AuthService: Logout error:', error);
      // Force clear even on error
      this.clearStorage();
      this.authState = {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      };
      return { success: true }; // Always succeed logout
    }
  }

  // ✅ Get current auth state
  getAuthState() {
    return { ...this.authState };
  }

  // ✅ Check if user is authenticated
  isAuthenticated() {
    return this.authState.isAuthenticated && 
           !!this.authState.user && 
           !!this.authState.token && 
           this.isValidToken(this.authState.token);
  }

  // ✅ Get current user
  getCurrentUser() {
    return this.authState.user;
  }

  // ✅ Get current token
  getCurrentToken() {
    return this.authState.token;
  }

  // ========== PRIVATE METHODS ==========

  validateCredentials(credentials) {
    if (!credentials.email || !credentials.password) {
      return false;
    }
    if (!credentials.email.includes('@')) {
      return false;
    }
    if (credentials.password.length < 6) {
      return false;
    }
    return true;
  }

  processLoginResponse(response, credentials) {
    if (typeof response === 'string' && response.length > 20) {
      // Backend returns JWT token directly
      const token = response.trim();
      
      // Decode JWT to extract user info
      const decoded = jwtUtils.decode(token);
      if (!decoded || !decoded.payload) {
        throw new Error('Invalid JWT token received');
      }
      
      const user = {
        id: decoded.payload.id,
        email: decoded.payload.sub || credentials.email,
        role: (decoded.payload.role || 'RECRUITER').toUpperCase(),
        status: 'VERIFIED',
        fullname: decoded.payload.name || decoded.payload.fullname || 'User',
        exp: decoded.payload.exp,
        iat: decoded.payload.iat
      };
      
      return { token, user };
    } else if (response && typeof response === 'object') {
      // Backend returns object
      const token = response.token || response.accessToken;
      const user = response.user || response.data;
      
      if (!token || !user) {
        throw new Error('Invalid response format from server');
      }
      
      return { token, user };
    } else {
      throw new Error('Unexpected response format from server');
    }
  }

  storeAuthData(token, user) {
    try {
      // Validate data before storing
      if (!token || !user || !user.id || !user.email) {
        console.error('❌ Invalid auth data for storage:', { hasToken: !!token, hasUser: !!user });
        return false;
      }

      // Validate token format
      if (!this.isValidTokenFormat(token)) {
        console.error('❌ Invalid token format');
        return false;
      }

      // Clear existing data first
      this.clearStorage();

      // Store with error handling
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));

      // Immediate verification
      const storedToken = localStorage.getItem(this.TOKEN_KEY);
      const storedUserStr = localStorage.getItem(this.USER_KEY);

      if (!storedToken || !storedUserStr || storedUserStr === 'undefined') {
        console.error('❌ Storage verification failed');
        this.clearStorage();
        return false;
      }

      // Verify JSON integrity
      try {
        const parsedUser = JSON.parse(storedUserStr);
        if (!parsedUser || !parsedUser.id || !parsedUser.email) {
          console.error('❌ Stored user data invalid');
          this.clearStorage();
          return false;
        }
      } catch (parseError) {
        console.error('❌ Stored user data parse error:', parseError);
        this.clearStorage();
        return false;
      }

      console.log('✅ Auth data stored successfully');
      return true;

    } catch (error) {
      console.error('❌ Storage error:', error);
      this.clearStorage();
      return false;
    }
  }

  getStoredToken() {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('❌ Error getting stored token:', error);
      return null;
    }
  }

  getStoredUser() {
    try {
      const userStr = localStorage.getItem(this.USER_KEY);
      if (!userStr || userStr === 'undefined' || userStr === 'null') {
        return null;
      }
      return JSON.parse(userStr);
    } catch (error) {
      console.error('❌ Error getting stored user:', error);
      return null;
    }
  }

  isValidTokenFormat(token) {
    if (!token || typeof token !== 'string') {
      return false;
    }
    const parts = token.split('.');
    return parts.length === 3;
  }

  isValidToken(token) {
    try {
      if (!this.isValidTokenFormat(token)) {
        return false;
      }
      
      const tokenInfo = jwtUtils.getTokenInfo(token);
      return tokenInfo && !tokenInfo.expired;
    } catch (error) {
      console.error('❌ Token validation error:', error);
      return false;
    }
  }

  clearStorage() {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.REFRESH_KEY);
    } catch (error) {
      console.error('❌ Error clearing storage:', error);
    }
  }

  processError(error) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    
    switch (status) {
      case 401:
        return new Error('Invalid email or password');
      case 403:
        return new Error('Access denied');
      case 404:
        return new Error('Service not found');
      case 409:
        return new Error('User already exists');
      case 500:
        return new Error('Server error. Please try again later');
      default:
        return new Error(message || 'Authentication failed');
    }
  }
}

// Create singleton instance
export const authService = new AuthService();
export default authService;