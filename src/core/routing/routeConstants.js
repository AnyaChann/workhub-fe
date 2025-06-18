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
    JOBS: {
      BASE: '/recruiter/dashboard/jobs',
      ACTIVE: '/recruiter/dashboard/jobs/active',
      DRAFTS: '/recruiter/dashboard/jobs/drafts',
      EXPIRED: '/recruiter/dashboard/jobs/expired',
      ARCHIVED: '/recruiter/dashboard/jobs/archived',
      CREATE: '/recruiter/dashboard/jobs/create',
      EDIT: '/recruiter/dashboard/jobs/edit/:id',
      VIEW: '/recruiter/dashboard/jobs/view/:id',
      APPLICATIONS: '/recruiter/dashboard/jobs/:id/applications'
    },
    CANDIDATES: {
      BASE: '/recruiter/dashboard/candidates',
      SEARCH: '/recruiter/dashboard/candidates/search',
      SHORTLISTED: '/recruiter/dashboard/candidates/shortlisted',
      INTERVIEWS: '/recruiter/dashboard/candidates/interviews',
      HIRED: '/recruiter/dashboard/candidates/hired'
    },
    COMPANY: {
      BASE: '/recruiter/dashboard/company',
      PROFILE: '/recruiter/dashboard/company/profile',
      SETTINGS: '/recruiter/dashboard/company/settings',
      TEAM: '/recruiter/dashboard/company/team',
      BILLING: '/recruiter/dashboard/company/billing'
    },
    ACCOUNT: {
      BASE: '/recruiter/dashboard/account',
      PROFILE: '/recruiter/dashboard/account/profile',
      SETTINGS: '/recruiter/dashboard/account/settings',
      SECURITY: '/recruiter/dashboard/account/security'
    }
  },
  
  // Candidate routes
  CANDIDATE: {
    BASE: '/candidate',
    DASHBOARD_BASE: '/candidate/dashboard',
    DASHBOARD: '/candidate/dashboard', // ✅ Default candidate dashboard
    JOBS: {
      BASE: '/candidate/dashboard/jobs',
      SEARCH: '/candidate/dashboard/jobs/search',
      SAVED: '/candidate/dashboard/jobs/saved',
      APPLIED: '/candidate/dashboard/jobs/applied',
      RECOMMENDED: '/candidate/dashboard/jobs/recommended',
      VIEW: '/candidate/dashboard/jobs/view/:id'
    },
    APPLICATIONS: {
      BASE: '/candidate/dashboard/applications',
      PENDING: '/candidate/dashboard/applications/pending',
      INTERVIEWS: '/candidate/dashboard/applications/interviews',
      OFFERS: '/candidate/dashboard/applications/offers',
      REJECTED: '/candidate/dashboard/applications/rejected'
    },
    PROFILE: {
      BASE: '/candidate/dashboard/profile',
      EDIT: '/candidate/dashboard/profile/edit',
      RESUME: '/candidate/dashboard/profile/resume',
      SKILLS: '/candidate/dashboard/profile/skills',
      EXPERIENCE: '/candidate/dashboard/profile/experience'
    },
    ACCOUNT: {
      BASE: '/candidate/dashboard/account',
      SETTINGS: '/candidate/dashboard/account/settings',
      PRIVACY: '/candidate/dashboard/account/privacy',
      NOTIFICATIONS: '/candidate/dashboard/account/notifications'
    }
  },
  
  // Admin routes
  ADMIN: {
    BASE: '/admin',
    DASHBOARD_BASE: '/admin/dashboard',
    DASHBOARD: '/admin/dashboard', // ✅ Default admin dashboard
    USERS: {
      BASE: '/admin/dashboard/users',
      CANDIDATES: '/admin/dashboard/users/candidates',
      RECRUITERS: '/admin/dashboard/users/recruiters',
      ADMINS: '/admin/dashboard/users/admins',
      PENDING: '/admin/dashboard/users/pending',
      SUSPENDED: '/admin/dashboard/users/suspended',
      BANNED: '/admin/dashboard/users/banned'
    },
    JOBS: {
      BASE: '/admin/dashboard/jobs',
      ACTIVE: '/admin/dashboard/jobs/active',
      PENDING: '/admin/dashboard/jobs/pending',
      REPORTED: '/admin/dashboard/jobs/reported',
      EXPIRED: '/admin/dashboard/jobs/expired'
    },
    COMPANIES: {
      BASE: '/admin/dashboard/companies',
      VERIFIED: '/admin/dashboard/companies/verified',
      PENDING: '/admin/dashboard/companies/pending',
      SUSPENDED: '/admin/dashboard/companies/suspended'
    },
    SETTINGS: {
      BASE: '/admin/dashboard/settings',
      SYSTEM: '/admin/dashboard/settings/system',
      PERMISSIONS: '/admin/dashboard/settings/permissions',
      MAINTENANCE: '/admin/dashboard/settings/maintenance'
    }
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

export default ROUTES;