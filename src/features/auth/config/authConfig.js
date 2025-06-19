// Authentication configuration

export const authConfig = {
  // Environment settings
  useMockData: process.env.REACT_APP_USE_MOCK_AUTH === 'true' || process.env.NODE_ENV === 'development',
  
  // API endpoints - Updated to match new specification
  endpoints: {
    candidate: {
      login: '/candidate/login',
      register: '/candidate/register'
    },
    recruiter: {
      login: '/recruiter/login', 
      register: '/recruiter/register'
    },
    admin: {
      login: '/admin/login'
    },
    common: {
        logout: '/logout',
      forgotPassword: '/forgot-password',
      resetPassword: '/reset-password',
      changePassword: '/users/password',
      updateProfile: '/users/profile',
      activate: '/activate'
    }
  },
  
  // Token settings
  token: {
    storageKey: 'authToken',
    userStorageKey: 'user',
    expireHours: 24
  },
  
  // Mock settings
  mock: {
    networkDelay: {
      min: 500,
      max: 1500
    },
    enableNetworkSimulation: true,
    enableConsoleLogging: true
  },
  
  // Role mappings - Updated with only 3 main roles
  roles: {
    ADMIN: 'admin',
    RECRUITER: 'recruiter',
    CANDIDATE: 'candidate'
  },
  
  // Account status mapping - Updated with 4 states
  accountStatus: {
    UNVERIFIED: 'unverified',
    VERIFIED: 'verified', 
    SUSPENDED: 'suspended',
    BANNED: 'banned'
  },
  
  // Route mappings - Updated for recruiter role
  dashboardRoutes: {
    admin: '/admin/dashboard',
    recruiter: '/recruiter/dashboard/jobs/active',
    candidate: '/candidate/dashboard'
  },
  
  // Validation rules
  validation: {
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    },
    password: {
      minLength: 6,
      message: 'Password must be at least 6 characters'
    },
    strongPassword: {
      minLength: 8,
      requireNumber: true,
      requireUppercase: true,
      requireLowercase: true,
      requireSpecialChar: true,
      message: 'Password must be at least 8 characters with uppercase, lowercase, number and special character'
    },
    // ✅ Add fullname validation config
    fullname: {
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-ZÀ-ỹ\s'.-]+$/,
      message: 'Full name must contain only letters, spaces, apostrophes, dots and hyphens'
    }
  },
  
  api: {
    endpoints: {
      login: '/recruiter/login',
      register: '/recruiter/register',
      forgotPassword: '/recruiter/forgot-password',
      resetPassword: '/recruiter/reset-password'
    }
  },
  
  storage: {
    tokenKey: 'authToken',
    userKey: 'user'
  }
};

export default authConfig;