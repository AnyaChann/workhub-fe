const ROUTES = {
  // Public routes
  HOME: '/',
  PRICING: '/pricing',
  
  // Auth routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  
  // Employer routes
  EMPLOYER: {
    BASE: '/employer',
    DASHBOARD: '/employer/dashboard/*',
    DASHBOARD_BASE: '/employer/dashboard',
    JOBS: {
      BASE: '/employer/dashboard/jobs',
      ACTIVE: '/employer/dashboard/jobs/active',
      DRAFTS: '/employer/dashboard/jobs/drafts',
      EXPIRED: '/employer/dashboard/jobs/expired',
      CREATE: '/employer/dashboard/jobs/create'
    },
    BRANDS: '/employer/dashboard/brands',
    ACCOUNT: {
      BASE: '/employer/dashboard/account',
      PROFILE: '/employer/dashboard/account/profile',
      USERS: '/employer/dashboard/account/users',
      INVENTORY: '/employer/dashboard/account/inventory'
    }
  },
  
  // Candidate routes
  CANDIDATE: {
    BASE: '/candidate',
    DASHBOARD: '/candidate/dashboard/*',
    DASHBOARD_BASE: '/candidate/dashboard'
  },
  
  // Admin routes
  ADMIN: {
    BASE: '/admin',
    DASHBOARD: '/admin/dashboard/*',
    DASHBOARD_BASE: '/admin/dashboard'
  },
  
  // Error routes
  NOT_FOUND: '/404'
};

export default ROUTES;