import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ROUTES from './routeConstants';
import ProtectedRoute, { RecruiterRoute, CandidateRoute, AdminRoute } from './ProtectedRoute';
import { PageLoadingSpinner } from '../../shared/components/LoadingSpinner/LoadingSpinner';

// ✅ Lazy load components for better performance
const Home = React.lazy(() => import('../../features/marketing/pages/Home/Home'));
const Pricing = React.lazy(() => import('../../features/marketing/pages/Pricing/Pricing'));

// ✅ Sửa import path cho ApplicationsPage - đúng thư mục
const ApplicationsPage = React.lazy(() => import('../../features/recruiter/components/applications/ApplicationPage/ApplicationsPage'));

// ✅ Thêm import cho JobApplicationsPage
const JobApplicationsPage = React.lazy(() => import('../../features/recruiter/pages/Jobs/JobApplicationsPage/JobApplicationsPage'));

// Auth pages
const Login = React.lazy(() => import('../../features/auth/pages/Login/Login'));
const Register = React.lazy(() => import('../../features/auth/pages/Register/Register'));
const ForgotPassword = React.lazy(() => import('../../features/auth/pages/ForgotPassword/ForgotPassword'));
const ResetPassword = React.lazy(() => import('../../features/auth/pages/ResetPassword/ResetPassword'));

// Account status pages
const UnverifiedAccount = React.lazy(() => import('../../features/auth/pages/UnverifiedAccount/UnverifiedAccount'));
const SuspendedAccount = React.lazy(() => import('../../features/auth/pages/SuspendedAccount/SuspendedAccount'));
const BannedAccount = React.lazy(() => import('../../features/auth/pages/BannedAccount/BannedAccount'));

// Dashboard Layouts
const RecruiterDashboardLayout = React.lazy(() => import('../../features/recruiter/components/layout/RecruiterLayout/RecruiterLayout'));
const CandidateDashboardLayout = React.lazy(() => import('../../features/dashboard/layouts/CandidateDashboardLayout'));
const AdminDashboardLayout = React.lazy(() => import('../../features/dashboard/layouts/AdminDashboardLayout'));

// Error pages
const NotFound = React.lazy(() => import('../../features/common/components/NotFound/NotFound'));
const Unauthorized = React.lazy(() => import('../../features/common/components/Unauthorized/Unauthorized'));
const Forbidden = React.lazy(() => import('../../features/common/components/Forbidden/Forbidden'));
const ServerError = React.lazy(() => import('../../features/common/components/ServerError/ServerError'));

// ✅ Temp Dashboard for development
const TempDashboard = React.lazy(() => import('../../shared/components/TempDashboard/TempDashboard'));

// ✅ Suspense wrapper component
const SuspenseWrapper = ({ children, fallback = <PageLoadingSpinner /> }) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
);

// ✅ Role-based dashboard components
const TempRecruiterDashboard = () => (
  <SuspenseWrapper>
    <TempDashboard userType="Recruiter" title="Recruiter Dashboard" />
  </SuspenseWrapper>
);

const TempCandidateDashboard = () => (
  <SuspenseWrapper>
    <TempDashboard userType="Candidate" title="Candidate Dashboard" />
  </SuspenseWrapper>
);

const TempAdminDashboard = () => (
  <SuspenseWrapper>
    <TempDashboard userType="Admin" title="Admin Dashboard" />
  </SuspenseWrapper>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* ✅ Public routes with lazy loading */}
      <Route
        path="/"
        element={
          <SuspenseWrapper>
            <Home />
          </SuspenseWrapper>
        }
      />
      <Route
        path={ROUTES.PRICING}
        element={
          <SuspenseWrapper>
            <Pricing />
          </SuspenseWrapper>
        }
      />

      {/* ✅ Auth routes with lazy loading */}
      <Route
        path={ROUTES.LOGIN}
        element={
          <SuspenseWrapper>
            <Login />
          </SuspenseWrapper>
        }
      />
      <Route
        path="/register"
        element={
          <SuspenseWrapper>
            <Register />
          </SuspenseWrapper>
        }
      />
      <Route
        path="/register/recruiter"
        element={<Navigate to="/register" replace />}
      />
      <Route
        path="/register/candidate"
        element={
          <SuspenseWrapper>
            <Register />
          </SuspenseWrapper>
        }
      />
      <Route
        path={ROUTES.FORGOT_PASSWORD}
        element={
          <SuspenseWrapper>
            <ForgotPassword />
          </SuspenseWrapper>
        }
      />
      <Route 
        path="/reset-password" 
        element={
          <SuspenseWrapper>
            <ResetPassword />
          </SuspenseWrapper>
        } 
      />

      {/* ✅ Account status routes */}
      <Route
        path={ROUTES.ACCOUNT_STATUS.UNVERIFIED}
        element={
          <ProtectedRoute>
            <SuspenseWrapper>
              <UnverifiedAccount />
            </SuspenseWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ACCOUNT_STATUS.SUSPENDED}
        element={
          <ProtectedRoute>
            <SuspenseWrapper>
              <SuspendedAccount />
            </SuspenseWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ACCOUNT_STATUS.BANNED}
        element={
          <ProtectedRoute>
            <SuspenseWrapper>
              <BannedAccount />
            </SuspenseWrapper>
          </ProtectedRoute>
        }
      />

      {/* ✅ Recruiter Dashboard Routes */}
      <Route
        path="/recruiter/dashboard/*"
        element={
          <RecruiterRoute requireVerified={false}>
            <SuspenseWrapper>
              <RecruiterDashboardLayout />
            </SuspenseWrapper>
          </RecruiterRoute>
        }
      />

      {/* ✅ Recruiter redirects with exact paths */}
      <Route
        path="/recruiter/dashboard"
        element={<Navigate to={ROUTES.RECRUITER.DASHBOARD} replace />}
      />
      <Route
        path="/recruiter"
        element={<Navigate to={ROUTES.RECRUITER.DASHBOARD} replace />}
      />

      {/* ✅ Backward compatibility redirects for employer */}
      <Route
        path="/employer/*"
        element={<Navigate to="/recruiter/dashboard" replace />}
      />

      {/* ✅ Candidate Dashboard Routes */}
      <Route
        path="/candidate/dashboard/*"
        element={
          <CandidateRoute requireVerified={false}>
            <SuspenseWrapper>
              <CandidateDashboardLayout />
            </SuspenseWrapper>
          </CandidateRoute>
        }
      />

      {/* ✅ Candidate redirects */}
      <Route
        path="/candidate/dashboard"
        element={<Navigate to={ROUTES.CANDIDATE.DASHBOARD} replace />}
      />
      <Route
        path="/candidate"
        element={<Navigate to={ROUTES.CANDIDATE.DASHBOARD} replace />}
      />

      {/* ✅ Admin Dashboard Routes */}
      <Route
        path="/admin/dashboard/*"
        element={
          <AdminRoute requireVerified={true}>
            <SuspenseWrapper>
              <AdminDashboardLayout />
            </SuspenseWrapper>
          </AdminRoute>
        }
      />

      {/* ✅ Admin redirects */}
      <Route
        path="/admin/dashboard"
        element={<Navigate to={ROUTES.ADMIN.DASHBOARD} replace />}
      />
      <Route
        path="/admin"
        element={<Navigate to={ROUTES.ADMIN.DASHBOARD} replace />}
      />

      {/* ✅ Development temp dashboards - fallback routes */}
      <Route
        path="/temp/recruiter"
        element={
          <RecruiterRoute>
            <TempRecruiterDashboard />
          </RecruiterRoute>
        }
      />
      <Route
        path="/temp/candidate"
        element={
          <CandidateRoute>
            <TempCandidateDashboard />
          </CandidateRoute>
        }
      />
      <Route
        path="/temp/admin"
        element={
          <AdminRoute>
            <TempAdminDashboard />
          </AdminRoute>
        }
      />

      {/* ✅ Error routes */}
      <Route
        path={ROUTES.UNAUTHORIZED}
        element={
          <SuspenseWrapper>
            <Unauthorized />
          </SuspenseWrapper>
        }
      />
      <Route
        path={ROUTES.FORBIDDEN}
        element={
          <SuspenseWrapper>
            <Forbidden />
          </SuspenseWrapper>
        }
      />
      <Route
        path={ROUTES.NOT_FOUND}
        element={
          <SuspenseWrapper>
            <NotFound />
          </SuspenseWrapper>
        }
      />
      <Route
        path={ROUTES.SERVER_ERROR}
        element={
          <SuspenseWrapper>
            <ServerError />
          </SuspenseWrapper>
        }
      />

      {/* ✅ 404 route - Must be last */}
      <Route
        path="*"
        element={
          <SuspenseWrapper>
            <NotFound />
          </SuspenseWrapper>
        }
      />
    </Routes>
  );
};

export default AppRoutes;