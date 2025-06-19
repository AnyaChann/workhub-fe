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

      // ✅ Enhanced validation with detailed logging
      if (!this.validateCredentials(credentials)) {
        throw new Error('Invalid credentials format');
      }

      // ✅ Extract and clean credentials
      const cleanCredentials = {
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password.trim()
      };

      console.log('📧 Clean email:', cleanCredentials.email);
      console.log('🔑 Password length:', cleanCredentials.password.length);

      // Clear any existing auth data
      this.clearStorage();

      // Build request - Use clean credentials
      const params = new URLSearchParams({
        email: cleanCredentials.email,
        password: cleanCredentials.password
      });

      const loginUrl = `/recruiter/login?${params.toString()}`;
      console.log('📡 AuthService: Making login request...');
      console.log('🎯 Login URL:', loginUrl);

      // Make API call
      const response = await api.post(loginUrl, {});
      console.log('📨 AuthService: Received response:', typeof response);

      // Process response - pass original credentials for fallback
      const { token, user } = this.processLoginResponse(response, cleanCredentials);

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
  async registerCandidate(userData) {
    try {
      console.log('📝 AuthService: Starting candidate registration...');
      console.log('📋 Candidate data:', {
        fullname: userData.fullname,
        email: userData.email,
        hasPassword: !!userData.password
      });

      // ✅ Validate required fields for candidate
      if (!userData.fullname || !userData.email || !userData.password) {
        throw new Error('Full name, email, and password are required');
      }

      if (userData.fullname.trim().length < 2) {
        throw new Error('Full name must be at least 2 characters');
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
        throw new Error('Please enter a valid email address');
      }

      if (userData.password.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }

      // ✅ Build request for candidate registration
      const params = new URLSearchParams({
        password: userData.password
      });

      const requestBody = {
        fullname: userData.fullname.trim(),
        email: userData.email.trim().toLowerCase(),
        phone: userData.phone || '',
        avatar: userData.avatar || ''
      };

      const registerUrl = `/candidate/register?${params.toString()}`;

      console.log('📡 AuthService: Making candidate registration request...');

      // Make registration request
      const response = await api.post(registerUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      });

      console.log('📨 AuthService: Candidate registration response:', response);

      // ✅ Handle candidate registration response (also returns JWT token)
      let result = {
        success: true,
        message: 'Candidate account created successfully',
        requiresVerification: false,
        token: null,
        user: null
      };

      if (typeof response === 'string' && response.length > 20) {
        // ✅ Backend returns JWT token
        result.token = response.trim();

        console.log('🎯 AuthService: Got JWT token from candidate registration');

        // ✅ Decode token to extract user info
        try {
          const decoded = jwtUtils.decode(result.token);
          if (decoded && decoded.payload) {
            result.user = {
              id: decoded.payload.id,
              fullname: userData.fullname,
              email: userData.email,
              phone: userData.phone || '',
              avatar: userData.avatar || '',
              role: decoded.payload.role || 'candidate',
              status: decoded.payload.status || 'unverified',
              created_at: new Date().toISOString(),
              exp: decoded.payload.exp,
              iat: decoded.payload.iat
            };

            console.log('👤 Candidate created from token:', {
              id: result.user.id,
              role: result.user.role,
              status: result.user.status,
              email: result.user.email
            });

            // ✅ Check verification status
            if (result.user.status === 'unverified') {
              result.requiresVerification = true;
              result.message = 'Candidate account created! Please check your email for verification.';
            } else {
              result.requiresVerification = false;
              result.message = 'Candidate account created and verified!';

              // Store auth data for verified accounts
              const stored = this.storeAuthData(result.token, result.user);
              if (stored) {
                this.authState = {
                  user: result.user,
                  token: result.token,
                  isAuthenticated: true,
                  isLoading: false
                };
                result.autoLogin = true;
              }
            }
          }
        } catch (decodeError) {
          console.warn('⚠️ Could not decode candidate token:', decodeError);
          result.requiresVerification = true;
          result.message = 'Account created! Please check your email for verification.';
        }
      }

      console.log('✅ AuthService: Candidate registration successful', {
        hasToken: !!result.token,
        hasUser: !!result.user,
        requiresVerification: result.requiresVerification,
        autoLogin: result.autoLogin || false
      });

      return result;

    } catch (error) {
      console.error('❌ AuthService: Candidate registration failed:', error);

      if (error.response?.status === 409) {
        throw new Error('A candidate account with this email already exists');
      } else if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData?.message?.includes('password')) {
          throw new Error('Password parameter is missing or invalid');
        } else {
          throw new Error(errorData?.message || 'Invalid registration data');
        }
      } else {
        throw new Error(error.message || 'Candidate registration failed');
      }
    }
  }

  async registerRecruiter(userData) {
    try {
      console.log('📝 AuthService: Starting recruiter registration...');
      console.log('📋 Registration data:', {
        fullname: userData.fullname,
        email: userData.email,
        hasPassword: !!userData.password,
        phone: userData.phone || 'not provided',
        avatar: userData.avatar || 'not provided'
      });

      // ✅ Validate required fields for recruiter
      if (!userData.fullname || !userData.email || !userData.password) {
        throw new Error('Full name, email, and password are required');
      }

      if (userData.fullname.trim().length < 2) {
        throw new Error('Full name must be at least 2 characters');
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
        throw new Error('Please enter a valid work email address');
      }

      if (userData.password.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }

      const params = new URLSearchParams({
        password: userData.password
      });

      const requestBody = {
        fullname: userData.fullname.trim(),
        email: userData.email.trim().toLowerCase(),
        phone: userData.phone || '',
        avatar: userData.avatar || ''
      };

      const registerUrl = `/recruiter/register?${params.toString()}`;

      console.log('📡 AuthService: Making recruiter registration request...');

      // ✅ Make registration request
      const response = await api.post(registerUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      });

      console.log('📨 AuthService: Registration response received');
      console.log('   Type:', typeof response);
      console.log('   Response:', response);

      // ✅ Handle token response from registration
      let result = {
        success: true,
        message: 'Recruiter account created successfully',
        requiresVerification: false, // Will be set based on user status
        token: null,
        user: null
      };

      if (typeof response === 'string' && response.length > 20) {
        // ✅ Backend returns JWT token directly
        result.token = response.trim();

        console.log('🎯 AuthService: Got JWT token from registration');

        // ✅ Decode token to extract user info
        try {
          const decoded = jwtUtils.decode(result.token);
          if (decoded && decoded.payload) {
            result.user = {
              id: decoded.payload.id,
              fullname: userData.fullname,
              email: userData.email,
              phone: userData.phone || '',
              avatar: userData.avatar || '',
              role: decoded.payload.role || 'recruiter',
              status: decoded.payload.status || 'unverified', // Check actual status from token
              created_at: new Date().toISOString(),
              // Include token expiry info
              exp: decoded.payload.exp,
              iat: decoded.payload.iat
            };

            console.log('👤 Recruiter created from token:', {
              id: result.user.id,
              role: result.user.role,
              status: result.user.status,
              email: result.user.email,
              hasToken: !!result.token
            });

            // ✅ Check if user needs verification based on status
            if (result.user.status === 'unverified') {
              result.requiresVerification = true;
              result.message = 'Recruiter account created! Please check your email for verification.';
            } else if (result.user.status === 'verified' || result.user.status === 'active') {
              result.requiresVerification = false;
              result.message = 'Recruiter account created and verified! You can now sign in.';

              // ✅ Store auth data for verified accounts
              const stored = this.storeAuthData(result.token, result.user);
              if (stored) {
                this.authState = {
                  user: result.user,
                  token: result.token,
                  isAuthenticated: true,
                  isLoading: false
                };
                result.autoLogin = true;
                console.log('✅ Auto-login enabled for verified recruiter');
              }
            }
          }
        } catch (decodeError) {
          console.warn('⚠️ Could not decode registration token:', decodeError);
          // Still success, but no auto-login
          result.requiresVerification = true;
          result.message = 'Account created! Please check your email for verification.';
        }
      } else if (response && typeof response === 'object') {
        // Handle object response format
        result.token = response.token || response.data?.token;
        result.user = response.user || response.data?.user;
        result.message = response.message || response.data?.message || result.message;
      }

      console.log('✅ AuthService: Recruiter registration successful', {
        hasToken: !!result.token,
        hasUser: !!result.user,
        requiresVerification: result.requiresVerification,
        autoLogin: result.autoLogin || false
      });

      return result;

    } catch (error) {
      console.error('❌ AuthService: Recruiter registration failed:', error);

      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData?.message?.includes('password')) {
          throw new Error('Password parameter is missing or invalid');
        } else if (errorData?.message?.includes('Required request parameter')) {
          throw new Error('Missing required registration parameters');
        } else {
          throw new Error(errorData?.message || 'Invalid registration data');
        }
      } else if (error.response?.status === 409) {
        throw new Error('A recruiter account with this email already exists');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message || 'Recruiter registration failed. Please try again.');
      }
    }
  }

  async forgotPassword(email) {
    try {
      console.log('📧 AuthService: Starting forgot password for:', email);

      // ✅ Validate email
      if (!email || !email.trim()) {
        throw new Error('Email is required');
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        throw new Error('Please enter a valid email address');
      }

      // ✅ Build request with email as query parameter
      const params = new URLSearchParams({
        email: email.trim().toLowerCase()
      });

      const forgotPasswordUrl = `/forgot-password?${params.toString()}`;

      console.log('📡 AuthService: Making forgot password request...');
      console.log('🎯 Endpoint:', forgotPasswordUrl);
      console.log('📧 Email:', email.trim().toLowerCase());

      // ✅ Make forgot password request
      const response = await api.post(forgotPasswordUrl, {}, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      });

      console.log('📨 AuthService: Forgot password response:', response);

      // ✅ Handle response
      let result = {
        success: true,
        message: 'Password reset email sent successfully',
        email: email.trim().toLowerCase()
      };

      if (typeof response === 'string') {
        result.message = response || result.message;
      } else if (response && typeof response === 'object') {
        result.message = response.message || response.data?.message || result.message;
        result.data = response.data || response;
      }

      console.log('✅ AuthService: Forgot password successful');
      return result;

    } catch (error) {
      console.error('❌ AuthService: Forgot password failed:', error);

      // ✅ Handle specific error types
      if (error.response?.status === 404) {
        throw new Error('No account found with this email address');
      } else if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData?.message?.includes('email')) {
          throw new Error('Invalid email address format');
        } else {
          throw new Error(errorData?.message || 'Invalid request');
        }
      } else if (error.response?.status === 429) {
        throw new Error('Too many requests. Please try again later');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to send password reset email. Please try again.');
      }
    }
  }

  async resetPassword(token, newPassword) {
    try {
      console.log('🔑 AuthService: Starting password reset...');
      console.log('🔍 Token length:', token?.length);
      console.log('🔍 Has password:', !!newPassword);

      // ✅ Validate inputs
      if (!token || !token.trim()) {
        throw new Error('Reset token is required');
      }

      if (!newPassword || !newPassword.trim()) {
        throw new Error('New password is required');
      }

      if (newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }

      // ✅ Validate token format
      if (!this.isValidTokenFormat(token.trim())) {
        throw new Error('Invalid reset token format');
      }

      // ✅ Check if token is expired
      try {
        const decoded = jwtUtils.decode(token);
        if (decoded && decoded.payload) {
          const now = Math.floor(Date.now() / 1000);
          if (decoded.payload.exp < now) {
            throw new Error('Reset token has expired. Please request a new password reset.');
          }
        }
      } catch (decodeError) {
        console.warn('⚠️ Could not decode reset token:', decodeError);
        // Continue anyway - let backend validate
      }

      // ✅ Build request with token and newPassword as query parameters
      const params = new URLSearchParams({
        token: token.trim(),
        newPassword: newPassword.trim()
      });

      const resetPasswordUrl = `/reset-password?${params.toString()}`;

      console.log('📡 AuthService: Making reset password request...');
      console.log('🎯 Endpoint:', resetPasswordUrl);

      // ✅ Make reset password request
      const response = await api.post(resetPasswordUrl, {}, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      });

      console.log('📨 AuthService: Reset password response:', response);

      // ✅ Handle response
      let result = {
        success: true,
        message: 'Password reset successfully'
      };

      if (typeof response === 'string') {
        result.message = response || result.message;
      } else if (response && typeof response === 'object') {
        result.message = response.message || response.data?.message || result.message;
        result.data = response.data || response;
      }

      console.log('✅ AuthService: Password reset successful');
      return result;

    } catch (error) {
      console.error('❌ AuthService: Password reset failed:', error);

      // ✅ Handle specific error types
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData?.message?.includes('token')) {
          throw new Error('Invalid or expired reset token');
        } else if (errorData?.message?.includes('password')) {
          throw new Error('Invalid password format');
        } else {
          throw new Error(errorData?.message || 'Invalid request');
        }
      } else if (error.response?.status === 401) {
        throw new Error('Reset token has expired. Please request a new password reset.');
      } else if (error.response?.status === 404) {
        throw new Error('Reset token not found or already used');
      } else if (error.response?.status === 429) {
        throw new Error('Too many requests. Please try again later');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to reset password. Please try again.');
      }
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
    console.log('🔍 AuthService: Validating credentials:', {
      hasEmail: !!credentials.email,
      hasPassword: !!credentials.password,
      emailValid: credentials.email?.includes('@'),
      passwordLength: credentials.password?.length || 0
    });

    if (!credentials || typeof credentials !== 'object') {
      console.error('❌ Credentials must be an object');
      return false;
    }

    if (!credentials.email || typeof credentials.email !== 'string') {
      console.error('❌ Email is required and must be a string');
      return false;
    }

    if (!credentials.password || typeof credentials.password !== 'string') {
      console.error('❌ Password is required and must be a string');
      return false;
    }

    if (!credentials.email.trim().includes('@')) {
      console.error('❌ Email must contain @ symbol');
      return false;
    }

    if (credentials.password.length < 6) {
      console.error('❌ Password must be at least 6 characters');
      return false;
    }

    console.log('✅ Credentials validation passed');
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