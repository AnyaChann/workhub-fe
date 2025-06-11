const ROUTES = {
  // Public routes
  HOME: '/',
  PRICING: '/pricing',
  ABOUT: '/about',
  CONTACT: '/contact',
  TERMS: '/terms',
  PRIVACY: '/privacy',

  // Auth routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Employer routes
  EMPLOYER: {
    HOME: '/employer',
    DASHBOARD: '/employer/dashboard',
    JOBS: '/employer/jobs',
    CREATE_JOB: '/employer/jobs/create',
    EDIT_JOB: '/employer/jobs/:id/edit',
    VIEW_JOB: '/employer/jobs/:id',
    APPLICATIONS: '/employer/applications',
    VIEW_APPLICATION: '/employer/applications/:id',
    COMPANY: '/employer/company',
    EDIT_COMPANY: '/employer/company/edit',
    PACKAGES: '/employer/packages',
    BILLING: '/employer/billing',
    MESSAGES: '/employer/messages',
    SETTINGS: '/employer/settings',
  },

  // Candidate routes
  CANDIDATE: {
    HOME: '/candidate',
    DASHBOARD: '/candidate/dashboard',
    JOBS: '/candidate/jobs',
    VIEW_JOB: '/candidate/jobs/:id',
    APPLICATIONS: '/candidate/applications',
    SAVED_JOBS: '/candidate/saved-jobs',
    PROFILE: '/candidate/profile',
    RESUME: '/candidate/resume',
    CREATE_RESUME: '/candidate/resume/create',
    EDIT_RESUME: '/candidate/resume/:id/edit',
    MESSAGES: '/candidate/messages',
    SETTINGS: '/candidate/settings',
  },

  // Admin routes
  ADMIN: {
    HOME: '/admin',
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    EMPLOYERS: '/admin/employers',
    CANDIDATES: '/admin/candidates',
    JOBS: '/admin/jobs',
    PACKAGES: '/admin/packages',
    CREATE_PACKAGE: '/admin/packages/create',
    EDIT_PACKAGE: '/admin/packages/:id/edit',
    CATEGORIES: '/admin/categories',
    SKILLS: '/admin/skills',
    REPORTS: '/admin/reports',
    SETTINGS: '/admin/settings',
  },

  // Error routes
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/unauthorized',
  SERVER_ERROR: '/500',
};

export default ROUTES;