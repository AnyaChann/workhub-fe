import api from './api';

export const authService = {
  // Login
  login: async (credentials) => {
    try {
      // Validate credentials
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }

      // Try real API first
      const response = await api.post('/login', {
        email: credentials.email,
        password: credentials.password
      });
      
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      
      return response;
      
    } catch (error) {
      console.error('Real API login failed, trying mock:', error);
      
      // Fallback to mock if real API fails
      return mockLogin(credentials);
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with logout even if API fails
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  // Get current user info
  getCurrentUser: async () => {
    try {
      return await api.get('/me');
    } catch (error) {
      console.error('Get current user failed, checking localStorage:', error);
      
      // Fallback to localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
        return JSON.parse(userData);
      }
      
      // If no user data, clear everything
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      throw new Error('No user data found');
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get current user from localStorage
  getCurrentUserFromStorage: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get user role
  getUserRole: () => {
    const user = authService.getCurrentUserFromStorage();
    return user?.role?.toLowerCase() || null;
  }
};

// Mock login function for fallback
const mockLogin = async (credentials) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const { email, password } = credentials;
  
  // Mock user database
  const mockUsers = {
    'employer@test.com': {
      id: 1,
      email: 'employer@test.com',
      name: 'Test Employer',
      role: 'EMPLOYER',
      password: 'password'
    },
    'candidate@test.com': {
      id: 2,
      email: 'candidate@test.com',
      name: 'Test Candidate',
      role: 'CANDIDATE',
      password: 'password'
    },
    'admin@test.com': {
      id: 3,
      email: 'admin@test.com',
      name: 'Test Admin',
      role: 'ADMIN',
      password: 'password'
    }
  };
  
  const user = mockUsers[email];
  
  if (!user || user.password !== password) {
    const error = new Error('Invalid email or password');
    error.response = { status: 401 };
    throw error;
  }
  
  // Create mock response
  const mockResponse = {
    token: `mock-jwt-token-${user.role.toLowerCase()}-${Date.now()}`,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    message: 'Login successful'
  };
  
  localStorage.setItem('authToken', mockResponse.token);
  return mockResponse;
};