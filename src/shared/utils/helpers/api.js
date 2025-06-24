import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/workhub/api/v1';

// ✅ Enhanced debugging
console.log('🔧 Environment check:', {
  NODE_ENV: process.env.NODE_ENV,
  REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  BASE_URL: BASE_URL,
  currentOrigin: window.location.origin
});

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Track retry attempts to prevent infinite loops
const retryTracker = new Map();

// Helper function to check if token exists and is valid format
const getValidToken = () => {
  const token = localStorage.getItem('authToken');
  if (!token || token === 'null' || token === 'undefined') {
    return null;
  }

  // Basic JWT format validation (should have 3 parts separated by dots)
  const parts = token.split('.');
  if (parts.length !== 3) {
    console.warn('⚠️ Invalid token format detected, removing...');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return null;
  }

  return token;
};

// ✅ Updated to match backend SecurityConfig exactly
const requiresAuth = (url) => {
  const publicEndpoints = [
    '/recruiter/login',
    '/candidate/login',
    '/admin/login',
    '/recruiter/register',
    '/candidate/register',
    '/activate',
    '/reset-password',
    '/forgot-password',
    '/join/interview/',
    '/interview-sessions/join/',
    '/error/',
    '/swagger-ui/',
    '/v3/',
    '/public/',
    '/health',
    '/status'
  ];

  return !publicEndpoints.some(endpoint => url.includes(endpoint));
};

// Request interceptor to add auth token and log requests
api.interceptors.request.use(
  (config) => {
    const requestId = `${Date.now()}-${Math.random()}`;
    config.metadata = { requestId, startTime: Date.now() };

    // Add auth token for protected endpoints
    if (requiresAuth(config.url)) {
      const token = getValidToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else if (!config.url.includes('/logout')) {
        console.warn('⚠️ No valid token found for protected endpoint:', config.url);
      }
    }

    // Security headers
    config.headers['X-Requested-With'] = 'XMLHttpRequest';

    // ✅ Enhanced logging for query parameters
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 API Request:', {
        id: requestId,
        method: config.method?.toUpperCase(),
        url: config.url,
        fullURL: `${config.baseURL}${config.url}`,
        baseURL: config.baseURL,
        queryParams: config.url.includes('?') ? config.url.split('?')[1] : 'none',
        data: config.data ? (config.url.includes('/login') ? '[HIDDEN]' : config.data) : undefined,
        isPublicEndpoint: !requiresAuth(config.url),
        headers: {
          ...config.headers,
          Authorization: config.headers.Authorization ? '[BEARER TOKEN]' : undefined
        }
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and logging
api.interceptors.response.use(
  (response) => {
    const requestId = response.config.metadata?.requestId;
    const duration = Date.now() - (response.config.metadata?.startTime || 0);

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ API Response:', {
        id: requestId,
        status: response.status,
        duration: `${duration}ms`,
        url: response.config.url,
        fullURL: `${response.config.baseURL}${response.config.url}`,
        data: response.data
      });
    }

    // Clear retry tracker on success
    if (requestId) {
      retryTracker.delete(requestId);
    }

    return response.data;
  },
  async (error) => {
    const config = error.config;
    const requestId = config?.metadata?.requestId;
    const duration = Date.now() - (config?.metadata?.startTime || 0);

    console.error('❌ API Error Details:', {
      id: requestId,
      status: error.response?.status,
      duration: `${duration}ms`,
      url: config?.url,
      fullURL: config ? `${config.baseURL}${config.url}` : 'unknown',
      message: error.message,
      code: error.code,
      data: error.response?.data,
      // ✅ Enhanced debugging info
      securityInfo: {
        baseURL: config?.baseURL,
        actualURL: config?.url,
        method: config?.method,
        isPublicEndpoint: config?.url ? !requiresAuth(config.url) : false,
        shouldBePermitted: config?.url ? !requiresAuth(config.url) : false,
        hasAuthHeader: !!config?.headers?.Authorization
      }
    });

    // ✅ Specific handling for login 403 errors
    if (error.response?.status === 403 && config?.url?.includes('/login')) {
      console.error('🚨 Login endpoint returning 403!');
      console.error('🔍 Backend Security Check:');
      console.error(`   Expected URL: ${config.baseURL}${config.url}`);
      console.error('   Backend permits: /workhub/api/v1/recruiter/login');
      console.error('   Match status:', config?.url?.includes('/recruiter/login') ? '✅ Should match' : '❌ URL mismatch');
    }

    // Handle different error scenarios
    if (error.response?.status === 401) {
      await handleUnauthorized(config);
    } else if (error.response?.status === 403) {
      handleForbidden(config);
    } else if (error.response?.status === 500) {
      // ✅ UPDATED: Pass config to handleServerError but don't redirect
      handleServerError(config);
    } else if (error.response?.status >= 500 && error.response?.status < 600) {
      // ✅ UPDATED: Pass config to handleServerError but don't redirect
      handleServerError(config);
    } else if (error.code === 'ECONNABORTED') {
      console.error('⏰ Request timeout:', config?.url);
    } else if (!error.response) {
      console.error('🌐 Network error or server unreachable');
    }

    // ✅ Always reject the error so components can handle it
    return Promise.reject(error);
  }
);

// Handle 401 Unauthorized
const handleUnauthorized = async (config) => {
  console.log('🔒 Handling 401 Unauthorized');

  // Clear invalid auth data
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');

  // Avoid redirect loops for auth pages
  if (config?.url && !requiresAuth(config.url)) {
    return;
  }

  // Check if we're already on auth page to prevent redirect loops
  const currentPath = window.location.pathname;
  const isAuthPage = ['/login', '/register', '/forgot-password'].some(path =>
    currentPath.startsWith(path)
  );

  if (!isAuthPage) {
    console.log('🔄 Redirecting to login due to 401');
    setTimeout(() => {
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
    }, 100);
  }
};

// ✅ Enhanced 403 handling for login endpoints
const handleForbidden = (config) => {
  console.log('🚫 Handling 403 Forbidden');
  console.log('🔍 Request details:', {
    url: config?.url,
    fullURL: config ? `${config.baseURL}${config.url}` : 'unknown',
    method: config?.method,
    isPublicEndpoint: config?.url ? !requiresAuth(config.url) : false
  });

  // Special handling for login endpoints
  if (config?.url && config.url.includes('/login')) {
    console.error('🚨 Login endpoint blocked by server!');
    console.error('💡 Checking SecurityConfig match...');

    // Don't redirect to forbidden page for login attempts
    // Instead, let the login form handle the error
    return;
  }

  const currentPath = window.location.pathname;
  if (!currentPath.includes('/forbidden')) {
    setTimeout(() => {
      window.location.href = '/forbidden';
    }, 100);
  }
};

// Handle 5xx Server Errors
const handleServerError = (config) => {
  console.log('🔧 Handling Server Error');
  console.error('🚨 Server Error Details:', {
    url: config?.url,
    method: config?.method,
    status: 'Server Error (5xx)',
    message: 'Let components handle the error locally'
  });

  // ✅ DON'T REDIRECT - Let components handle errors themselves
  // ❌ REMOVED: Automatic redirect to /500 page
  // const currentPath = window.location.pathname;
  // if (!currentPath.includes('/500')) {
  //   setTimeout(() => {
  //     window.location.href = '/500';
  //   }, 100);
  // }
};

// ✅ Add connection test utility with correct URL
export const testConnection = async () => {
  try {
    console.log('� Testing connection to:', BASE_URL);

    // Try login endpoint to test security config
    const testUrl = `${BASE_URL}/recruiter/login?email=test&password=test`;
    const response = await fetch(testUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: ''
    });

    console.log('✅ Connection test result:', {
      url: testUrl,
      status: response.status,
      ok: response.ok,
      expectation: 'Should return 401 (unauthorized) or 400 (bad request), not 403 (forbidden)'
    });

    return { success: true, status: response.status };
  } catch (error) {
    console.error('❌ Connection test failed:', {
      url: `${BASE_URL}/recruiter/login`,
      error: error.message
    });

    return { success: false, error: error.message };
  }
};

// Export configured axios instance
export default api;

// Export additional utilities
export {
  BASE_URL,
  getValidToken,
  requiresAuth
};