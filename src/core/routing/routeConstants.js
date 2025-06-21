const ROUTES = {
  // Public routes
  HOME: '/',
  PRICING: '/pricing',
  ABOUT: '/about',
  CONTACT: '/contact',
  
  // Auth routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  ACTIVATE_ACCOUNT: '/activate',
  
  // Recruiter routes
  RECRUITER: {
    BASE: '/recruiter',
    DASHBOARD_BASE: '/recruiter/dashboard',
    DASHBOARD: '/recruiter/dashboard/jobs/active', // ✅ Default dashboard
    
    // Jobs routes
    ACTIVE_JOBS: '/recruiter/dashboard/jobs/active',
    DRAFTS: '/recruiter/dashboard/jobs/drafts',
    EXPIRED_JOBS: '/recruiter/dashboard/jobs/expired',
    ARCHIVED_JOBS: '/recruiter/dashboard/jobs/archived',
    CREATE_JOB: '/recruiter/dashboard/jobs/create',
    EDIT_JOB: '/recruiter/dashboard/jobs/edit/:id',
    VIEW_JOB: '/recruiter/dashboard/jobs/view/:id',
    
    // ✅ Applications routes
    APPLICATIONS: '/recruiter/dashboard/jobs/:id/applications', // Job-specific applications
    ALL_APPLICATIONS: '/recruiter/dashboard/applications', // All applications
    RESUME_REVIEWS: '/recruiter/dashboard/applications/reviews',
    
    // Candidates routes
    CANDIDATES: '/recruiter/dashboard/candidates',
    
    // Company routes
    COMPANY_PROFILE: '/recruiter/dashboard/company/profile',
    REPORTS: '/recruiter/dashboard/company/reports',
    
    // Account routes 
    ACCOUNT: {
      BASE: '/recruiter/dashboard/account',
      PROFILE: '/recruiter/dashboard/account/profile',
      SETTINGS: '/recruiter/dashboard/account/settings',
      SECURITY: '/recruiter/dashboard/account/security', 
      BILLING: '/recruiter/dashboard/account/billing',
      TEAM: '/recruiter/dashboard/account/team'
    }
  },
  
  // Candidate routes
  CANDIDATE: {
    BASE: '/candidate',
    DASHBOARD_BASE: '/candidate/dashboard',
    DASHBOARD: '/candidate/dashboard',
  },
  
  // Admin routes
  ADMIN: {
    BASE: '/admin',
    DASHBOARD_BASE: '/admin/dashboard',
    DASHBOARD: '/admin/dashboard',
  },
  
  // Account status routes
  ACCOUNT_STATUS: {
    UNVERIFIED: '/account/unverified',
    SUSPENDED: '/account/suspended', 
    BANNED: '/account/banned'
  },
  
  // Error routes
  UNAUTHORIZED: '/unauthorized',
  FORBIDDEN: '/forbidden',
  NOT_FOUND: '/404',
  SERVER_ERROR: '/500'
};

// ✅ Enhanced helper functions
export const getDefaultDashboard = (role) => {
  if (!role) return ROUTES.HOME;
  
  switch (role.toLowerCase()) {
    case 'recruiter':
      return ROUTES.RECRUITER.DASHBOARD;
    case 'candidate':
      return ROUTES.CANDIDATE.DASHBOARD;
    case 'admin':
      return ROUTES.ADMIN.DASHBOARD;
    default:
      console.warn('Unknown role for dashboard:', role);
      return ROUTES.HOME;
  }
};

export const getRoleBasePath = (role) => {
  if (!role) return ROUTES.HOME;
  
  switch (role.toLowerCase()) {
    case 'recruiter':
      return ROUTES.RECRUITER.BASE;
    case 'candidate':
      return ROUTES.CANDIDATE.BASE;
    case 'admin':
      return ROUTES.ADMIN.BASE;
    default:
      return ROUTES.HOME;
  }
};

// ✅ Helper functions cho Applications routes
export const getApplicationsRoutes = () => ({
  ALL: ROUTES.RECRUITER.ALL_APPLICATIONS,
  REVIEWS: ROUTES.RECRUITER.RESUME_REVIEWS,
  JOB_SPECIFIC: (jobId) => ROUTES.RECRUITER.APPLICATIONS.replace(':id', jobId)
});

// ✅ Helper function để generate job applications URL
export const getJobApplicationsUrl = (jobId, jobTitle) => {
  const baseUrl = `/recruiter/dashboard/jobs/${jobId}/applications`;
  if (jobTitle) {
    return `${baseUrl}?jobTitle=${encodeURIComponent(jobTitle)}`;
  }
  return baseUrl;
};

export default ROUTES;