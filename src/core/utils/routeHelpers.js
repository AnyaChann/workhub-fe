import ROUTES, { getDefaultDashboard, getRoleBasePath } from './routeConstants';

export const routeHelpers = {
  // ✅ Navigation helpers
  goToDashboard: (role, navigate) => {
    const dashboardUrl = getDefaultDashboard(role);
    navigate(dashboardUrl);
  },

  goToRoleBase: (role, navigate) => {
    const basePath = getRoleBasePath(role);
    navigate(basePath);
  },

  // ✅ URL builders
  buildJobUrl: (role, jobId, action = 'view') => {
    const baseJobsPath = role === 'recruiter' 
      ? ROUTES.RECRUITER.JOBS.BASE 
      : ROUTES.CANDIDATE.JOBS.BASE;
    
    switch (action) {
      case 'edit':
        return `${baseJobsPath}/edit/${jobId}`;
      case 'view':
        return `${baseJobsPath}/view/${jobId}`;
      case 'applications':
        return `${baseJobsPath}/${jobId}/applications`;
      default:
        return `${baseJobsPath}/view/${jobId}`;
    }
  },

  buildUserUrl: (role, userId, action = 'view') => {
    if (role !== 'admin') return null;
    
    switch (action) {
      case 'edit':
        return `${ROUTES.ADMIN.USERS.BASE}/edit/${userId}`;
      case 'view':
        return `${ROUTES.ADMIN.USERS.BASE}/view/${userId}`;
      default:
        return `${ROUTES.ADMIN.USERS.BASE}/view/${userId}`;
    }
  },

  // ✅ Route validation
  isValidRoleRoute: (path, userRole) => {
    const roleBasePath = getRoleBasePath(userRole);
    return path.startsWith(roleBasePath);
  },

  isPublicRoute: (path) => {
    const publicPaths = [
      ROUTES.HOME,
      ROUTES.PRICING,
      ROUTES.ABOUT,
      ROUTES.CONTACT,
      ROUTES.LOGIN,
      ROUTES.REGISTER,
      ROUTES.FORGOT_PASSWORD,
      ROUTES.RESET_PASSWORD,
      ROUTES.ACTIVATE_ACCOUNT
    ];
    
    return publicPaths.includes(path) || path.startsWith('/public/');
  },

  isAuthRoute: (path) => {
    const authPaths = [
      ROUTES.LOGIN,
      ROUTES.REGISTER,
      ROUTES.FORGOT_PASSWORD,
      ROUTES.RESET_PASSWORD,
      ROUTES.ACTIVATE_ACCOUNT
    ];
    
    return authPaths.includes(path);
  },

  isAccountStatusRoute: (path) => {
    return Object.values(ROUTES.ACCOUNT_STATUS).includes(path);
  },

  // ✅ Redirect logic
  getRedirectPath: (user, intendedPath = null) => {
    if (!user) return ROUTES.LOGIN;

    // Check account status first
    if (user.status === 'banned') {
      return ROUTES.ACCOUNT_STATUS.BANNED;
    }
    
    if (user.status === 'suspended') {
      return ROUTES.ACCOUNT_STATUS.SUSPENDED;
    }
    
    if (user.status === 'unverified') {
      return ROUTES.ACCOUNT_STATUS.UNVERIFIED;
    }

    // If intended path is valid for user role, use it
    if (intendedPath && routeHelpers.isValidRoleRoute(intendedPath, user.role?.toLowerCase())) {
      return intendedPath;
    }

    // Otherwise redirect to default dashboard
    return getDefaultDashboard(user.role);
  },

  // ✅ Breadcrumb helpers
  getBreadcrumbs: (path, userRole) => {
    const segments = path.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Home', path: '/' }];

    if (segments.length >= 2) {
      const roleSegment = segments[0]; // recruiter, candidate, admin
      const sectionSegment = segments[1]; // dashboard

      if (sectionSegment === 'dashboard') {
        breadcrumbs.push({
          label: `${roleSegment.charAt(0).toUpperCase() + roleSegment.slice(1)} Dashboard`,
          path: `/${roleSegment}/dashboard`
        });

        // Add sub-sections
        if (segments.length >= 3) {
          const subSection = segments[2];
          breadcrumbs.push({
            label: subSection.charAt(0).toUpperCase() + subSection.slice(1),
            path: `/${roleSegment}/dashboard/${subSection}`
          });
        }
      }
    }

    return breadcrumbs;
  },

  // ✅ Permission checks
  canAccessRoute: (path, user) => {
    if (!user) return false;
    
    const userRole = user.role?.toLowerCase();
    
    // Check if it's a role-specific route
    if (path.includes('/dashboard/')) {
      const pathRole = path.split('/')[1]; // Extract role from path
      
      // Map employer to recruiter for backward compatibility
      const normalizedPathRole = pathRole === 'employer' ? 'recruiter' : pathRole;
      
      return normalizedPathRole === userRole;
    }
    
    return true; // Allow public routes
  }
};

export default routeHelpers;