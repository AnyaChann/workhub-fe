export const ROUTES = {
  // Public routes
  HOME: '/',
  PRICING: '/pricing',
  
  // Auth routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  
  // Protected routes
  DASHBOARD: '/dashboard',
  DASHBOARD_ACTIVE_JOBS: '/dashboard/active-jobs',
  DASHBOARD_DRAFTS: '/dashboard/drafts',
  DASHBOARD_EXPIRED: '/dashboard/expired',
  DASHBOARD_BRANDS: '/dashboard/brands',
  
  // Future routes
  TERMS: '/terms',
  PRIVACY: '/privacy',
  CONTACT: '/contact',
  ABOUT: '/about',
  
  // Job related routes
  CREATE_JOB: '/dashboard/jobs/create',
  EDIT_JOB: '/dashboard/jobs/edit/:id',
  VIEW_JOB: '/dashboard/jobs/:id',
  
  // Brand related routes
  CREATE_BRAND: '/dashboard/brands/create',
  EDIT_BRAND: '/dashboard/brands/edit/:id',
  VIEW_BRAND: '/dashboard/brands/:id',
  
  // Profile routes
  PROFILE: '/profile',
  SETTINGS: '/settings'
};

export default ROUTES;