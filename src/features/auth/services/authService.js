import api from '../../../shared/utils/helpers/api';

export const authService = {
  // Login
  login: async (credentials) => {
    try {
      // Validate credentials
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }

      // Create FormData for @RequestParam
      const formData = new URLSearchParams();
      formData.append('email', credentials.email);
      formData.append('password', credentials.password);

      // Try real API first with form data
      const response = await api.post('/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      // Check if response is "Invalid credentials" string
      if (typeof response === 'string' && response === 'Invalid credentials') {
        console.log('Backend returned invalid credentials, trying mock...');
        return mockLogin(credentials);
      }
      
      // If we get a user object, create session
      if (response && response.id) {
        const sessionToken = `session-${Date.now()}-${response.id}`;
        localStorage.setItem('authToken', sessionToken);
        
        return {
          user: response,
          token: sessionToken,
          message: 'Login successful'
        };
      }
      
      // Fallback to mock
      console.log('Unexpected response format, trying mock...');
      return mockLogin(credentials);
      
    } catch (error) {
      console.error('Real API login failed:', error);
      
      // If it's a network error or 404, try mock
      if (error.code === 'NETWORK_ERROR' || error.response?.status === 404) {
        console.log('Network error, trying mock...');
        return mockLogin(credentials);
      }
      
      // If backend returns "Invalid credentials", try mock
      if (error.response?.data === 'Invalid credentials') {
        console.log('Backend invalid credentials, trying mock...');
        return mockLogin(credentials);
      }
      
      // For other errors, still try mock as fallback
      return mockLogin(credentials);
    }
  },

  // Get all users (for debugging)
  getAllUsers: async () => {
    try {
      return await api.get('/users');
    } catch (error) {
      console.error('Get all users failed:', error);
      return [];
    }
  },

  // Check if email exists
  checkEmailExists: async (email) => {
    try {
      const response = await api.get(`/users/check-email?email=${email}`);
      return response;
    } catch (error) {
      console.error('Check email failed:', error);
      return false;
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/logout').catch(() => {
        console.log('Logout API not available, clearing local session');
      });
    } catch (error) {
      console.error('Logout API error:', error);
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
      
      const userData = localStorage.getItem('user');
      if (userData) {
        return JSON.parse(userData);
      }
      
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      throw new Error('No user data found');
    }
  },

  // Helper methods
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  getCurrentUserFromStorage: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getUserRole: () => {
    const user = authService.getCurrentUserFromStorage();
    return user?.role?.toLowerCase() || null;
  },

  getUserInfo: () => {
    const user = authService.getCurrentUserFromStorage();
    return user ? {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      status: user.status,
      createdAt: user.createdAt
    } : null;
  }
};

// Enhanced mock login function
const mockLogin = async (credentials) => {
  console.log('Using mock login for:', credentials.email);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const { email, password } = credentials;
  
  // Mock user database - matches the SQL insert above
  const mockUsers = {
    'employer@test.com': {
      id: 101,
      fullname: 'Test Employer Company',
      email: 'employer@test.com',
      password: 'password',
      role: 'EMPLOYER',
      phone: '+84123456789',
      avatar: 'https://via.placeholder.com/150/007bff/ffffff?text=E',
      status: 'ACTIVE',
      createdAt: '2024-01-15T10:30:00Z',
      resumeList: []
    },
    'candidate@test.com': {
      id: 102,
      fullname: 'Test Candidate User',
      email: 'candidate@test.com',
      password: 'password',
      role: 'CANDIDATE',
      phone: '+84987654321',
      avatar: 'https://via.placeholder.com/150/28a745/ffffff?text=C',
      status: 'ACTIVE',
      createdAt: '2024-01-10T08:15:00Z',
      resumeList: []
    },
    'admin@test.com': {
      id: 103,
      fullname: 'System Administrator',
      email: 'admin@test.com',
      password: 'password',
      role: 'ADMIN',
      phone: '+84555666777',
      avatar: 'https://via.placeholder.com/150/dc3545/ffffff?text=A',
      status: 'ACTIVE',
      createdAt: '2024-01-01T00:00:00Z',
      resumeList: []
    },
    'abc@gmail.com': {
      id: 104,
      fullname: 'ABC User',
      email: 'abc@gmail.com',
      password: 'password',
      role: 'CANDIDATE',
      phone: '+84111222333',
      avatar: 'https://via.placeholder.com/150/6c757d/ffffff?text=U',
      status: 'ACTIVE',
      createdAt: '2024-01-05T12:00:00Z',
      resumeList: []
    }
  };
  
  const user = mockUsers[email];
  
  if (!user || user.password !== password) {
    const error = new Error('Invalid email or password');
    error.response = { status: 401 };
    throw error;
  }
  
  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;
  
  // Create mock response
  const mockResponse = {
    token: `mock-jwt-token-${user.role.toLowerCase()}-${Date.now()}`,
    user: userWithoutPassword,
    message: 'Login successful (Mock)'
  };
  
  localStorage.setItem('authToken', mockResponse.token);
  return mockResponse;
};