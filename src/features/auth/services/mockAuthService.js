// Mock authentication service for development and testing

export const mockUsers = {
  'recruiter@test.com': {
    id: 105,
    fullname: 'Senior Recruiter',
    email: 'recruiter@test.com',
    password: 'password',
    role: 'RECRUITER', // Updated role
    phone: '+84123456789',
    avatar: 'https://via.placeholder.com/150/17a2b8/ffffff?text=R',
    status: 'verified', // Updated status
    createdAt: '2024-01-15T10:30:00Z',
    companyName: 'TechCorp Solutions',
    position: 'Lead Recruiter',
    resumeList: []
  },
  'employer@test.com': {
    id: 101,
    fullname: 'WorkHub Employer',
    email: 'employer@test.com',
    password: 'password',
    role: 'RECRUITER', // Employer is actually recruiter role
    phone: '+84123456789',
    avatar: 'https://via.placeholder.com/150/007bff/ffffff?text=E',
    status: 'verified',
    createdAt: '2024-01-15T10:30:00Z',
    companyName: 'WorkHub Technology',
    position: 'HR Manager',
    resumeList: []
  },
  'candidate@test.com': {
    id: 102,
    fullname: 'Tech Professional',
    email: 'candidate@test.com',
    password: 'password',
    role: 'CANDIDATE',
    phone: '+84987654321',
    avatar: 'https://via.placeholder.com/150/28a745/ffffff?text=C',
    status: 'verified',
    createdAt: '2024-01-10T08:15:00Z',
    skills: ['React', 'Node.js', 'Python'],
    experience: '3 years',
    resumeList: [
      {
        id: 1,
        name: 'Resume_TechProfessional_2024.pdf',
        uploadDate: '2024-01-10',
        isDefault: true
      }
    ]
  },
  'candidate.unverified@test.com': {
    id: 106,
    fullname: 'Unverified Candidate',
    email: 'candidate.unverified@test.com',
    password: 'password',
    role: 'CANDIDATE',
    phone: '+84987654322',
    avatar: 'https://via.placeholder.com/150/ffc107/ffffff?text=U',
    status: 'unverified', // Unverified status
    createdAt: '2024-01-20T08:15:00Z',
    resumeList: []
  },
  'candidate.suspended@test.com': {
    id: 107,
    fullname: 'Suspended Candidate',
    email: 'candidate.suspended@test.com',
    password: 'password',
    role: 'CANDIDATE',
    phone: '+84987654323',
    avatar: 'https://via.placeholder.com/150/fd7e14/ffffff?text=S',
    status: 'suspended', // Suspended status
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
    status: 'verified',
    createdAt: '2024-01-01T00:00:00Z',
    permissions: ['users', 'jobs', 'companies', 'reports'],
    resumeList: []
  }
};

// Mock API delay simulation
const mockDelay = (min = 500, max = 1500) => {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Mock login function
export const mockLogin = async (credentials, specificRole = null) => {
  console.log(`🎭 Using mock login for: ${credentials.email} (role: ${specificRole || 'auto-detect'})`);
  
  // Simulate network delay
  await mockDelay(600, 1200);
  
  const { email, password } = credentials;
  
  let user = mockUsers[email];
  
  // If specific role provided, validate role matches
  if (specificRole && user && user.role !== specificRole) {
    const error = new Error('Invalid credentials for this role');
    error.response = { status: 401 };
    error.code = 'ROLE_MISMATCH';
    throw error;
  }
  
  if (!user || user.password !== password) {
    const error = new Error('Invalid email or password');
    error.response = { status: 401 };
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  // Check account status
  if (user.status === 'banned') {
    const error = new Error('Account has been banned');
    error.response = { status: 403 };
    error.code = 'ACCOUNT_BANNED';
    throw error;
  }

  if (user.status === 'suspended') {
    const error = new Error('Account has been suspended');
    error.response = { status: 403 };
    error.code = 'ACCOUNT_SUSPENDED'; 
    throw error;
  }
  
  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;
  
  const mockToken = `mock-jwt-${user.role.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const mockResponse = {
    token: mockToken,
    user: userWithoutPassword,
    message: `Login successful (Mock Data - ${specificRole || user.role})`,
    mockData: true
  };
  
  // Store in localStorage
  localStorage.setItem('authToken', mockResponse.token);
  localStorage.setItem('user', JSON.stringify(userWithoutPassword));
  
  return mockResponse;
};

// Mock registration function - Updated with new status
export const mockRegister = async (userData) => {
  console.log('🎭 Using mock registration for:', userData.email);
  
  await mockDelay(800, 1500);
  
  // Check if user already exists
  if (mockUsers[userData.email]) {
    const error = new Error('User already exists');
    error.response = { status: 409 };
    error.code = 'USER_EXISTS';
    throw error;
  }
  
  // Create new mock user
  const newUser = {
    id: Date.now(),
    fullname: userData.businessName || userData.fullname || 'New User',
    email: userData.email,
    role: userData.role || 'CANDIDATE',
    phone: userData.phone || '',
    avatar: `https://via.placeholder.com/150/6c757d/ffffff?text=${userData.email.charAt(0).toUpperCase()}`,
    status: 'unverified', // New accounts start as unverified
    createdAt: new Date().toISOString(),
    resumeList: []
  };
  
  // Temporarily add to mock users (in real app, this would be persisted)
  mockUsers[userData.email] = { ...newUser, password: userData.password };
  
  return {
    user: newUser,
    message: 'Registration successful (Mock). Check your email for activation link.',
    mockData: true
  };
};

// Mock account activation - Updated to change status
export const mockActivateAccount = async (token) => {
  console.log('🎭 Using mock account activation for token:', token);
  
  await mockDelay(300, 600);
  
  if (!token) {
    const error = new Error('Invalid activation token');
    error.response = { status: 400 };
    error.code = 'INVALID_TOKEN';
    throw error;
  }

  // In a real app, you would decode the token to find the user
  // For mock, we'll just return success
  return {
    message: 'Account activated successfully (Mock). You can now login.',
    mockData: true
  };
};

// Other existing mock functions remain the same...
export const mockForgotPassword = async (email) => {
  console.log('🎭 Using mock forgot password for:', email);
  
  await mockDelay(500, 1000);
  
  if (!mockUsers[email]) {
    const error = new Error('Email not found');
    error.response = { status: 404 };
    error.code = 'EMAIL_NOT_FOUND';
    throw error;
  }
  
  return {
    message: 'Password reset instructions sent to your email (Mock)',
    mockData: true
  };
};

export const mockResetPassword = async (resetData) => {
  console.log('🎭 Using mock reset password');
  
  await mockDelay(500, 1000);
  
  if (!resetData.token || !resetData.password) {
    const error = new Error('Invalid reset token or password');
    error.response = { status: 400 };
    error.code = 'INVALID_RESET_DATA';
    throw error;
  }
  
  return {
    message: 'Password reset successful (Mock)',
    mockData: true
  };
};

export const mockUpdateProfile = async (profileData) => {
  console.log('🎭 Using mock profile update');
  
  await mockDelay(400, 800);
  
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  const updatedUser = {
    ...currentUser,
    ...profileData,
    updatedAt: new Date().toISOString()
  };
  
  // Update localStorage
  localStorage.setItem('user', JSON.stringify(updatedUser));
  
  return {
    user: updatedUser,
    message: 'Profile updated successfully (Mock)',
    mockData: true
  };
};

export const mockGetCurrentUser = async () => {
  console.log('🎭 Using mock get current user');
  
  await mockDelay(200, 400);
  
  const userData = localStorage.getItem('user');
  const token = localStorage.getItem('authToken');
  
  if (!userData || !token) {
    const error = new Error('No user data found');
    error.response = { status: 401 };
    error.code = 'NO_USER_DATA';
    throw error;
  }
  
  const user = JSON.parse(userData);
  
  // Simulate token expiration (optional)
  if (token.includes('expired')) {
    const error = new Error('Token expired');
    error.response = { status: 401 };
    error.code = 'TOKEN_EXPIRED';
    throw error;
  }
  
  return user;
};

// Helper functions
export const getMockUserByEmail = (email) => {
  return mockUsers[email] || null;
};

export const addMockUser = (email, userData) => {
  mockUsers[email] = userData;
};

export const removeMockUser = (email) => {
  delete mockUsers[email];
};

export const resetMockUsers = () => {
  Object.keys(mockUsers).forEach(email => {
    if (!['recruiter@test.com', 'employer@test.com', 'candidate@test.com', 'admin@test.com'].includes(email)) {
      delete mockUsers[email];
    }
  });
};

// Export all mock functions
export const mockAuthService = {
  login: mockLogin,
  register: mockRegister,
  forgotPassword: mockForgotPassword,
  resetPassword: mockResetPassword,
  updateProfile: mockUpdateProfile,
  activateAccount: mockActivateAccount,
  getCurrentUser: mockGetCurrentUser,
  
  // Utility functions
  getMockUserByEmail,
  addMockUser,
  removeMockUser,
  resetMockUsers,
  mockUsers
};

export default mockAuthService;