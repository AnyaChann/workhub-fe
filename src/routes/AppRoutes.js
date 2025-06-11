import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ROUTES from './routeConstants';
import ProtectedRoute from './ProtectedRoute';

// Public pages
import Home from '../pages/Employer/Home/Home';
import Pricing from '../pages/Employer/Pricing/Pricing';
// import About from '../pages/Public/About/About';
// import Contact from '../pages/Public/Contact/Contact';
// import Terms from '../pages/Public/Terms/Terms';
// import Privacy from '../pages/Public/Privacy/Privacy';

// Auth pages
import Login from '../pages/Auth/Login/Login';
// import Register from '../pages/Auth/Register/Register';
// import ForgotPassword from '../pages/Auth/ForgotPassword/ForgotPassword';
// import ResetPassword from '../pages/Auth/ResetPassword/ResetPassword';

// Error pages
import NotFound from '../pages/NotFound/NotFound';
// import Unauthorized from '../pages/Error/Unauthorized/Unauthorized';
// import ServerError from '../pages/Error/ServerError/ServerError';

// Employer pages - Tạm thời comment out các trang chưa tồn tại
// import EmployerLayout from '../pages/Employer/Layout/EmployerLayout';
// import EmployerDashboard from '../pages/Employer/Dashboard/Dashboard';
// import EmployerJobs from '../pages/Employer/Jobs/Jobs';
// import CreateJob from '../pages/Employer/Jobs/CreateJob';
// import EditJob from '../pages/Employer/Jobs/EditJob';
// import ViewJob from '../pages/Employer/Jobs/ViewJob';
// import Applications from '../pages/Employer/Applications/Applications';
// import ViewApplication from '../pages/Employer/Applications/ViewApplication';
// import CompanyProfile from '../pages/Employer/Company/CompanyProfile';
// import EditCompany from '../pages/Employer/Company/EditCompany';
// import Packages from '../pages/Employer/Packages/Packages';
// import Billing from '../pages/Employer/Billing/Billing';
// import EmployerMessages from '../pages/Employer/Messages/Messages';
// import EmployerSettings from '../pages/Employer/Settings/Settings';

// Candidate pages - Tạm thời comment out các trang chưa tồn tại
// import CandidateLayout from '../pages/Candidate/Layout/CandidateLayout';
// import CandidateDashboard from '../pages/Candidate/Dashboard/Dashboard';
// import CandidateJobs from '../pages/Candidate/Jobs/Jobs';
// import CandidateViewJob from '../pages/Candidate/Jobs/ViewJob';
// import CandidateApplications from '../pages/Candidate/Applications/Applications';
// import SavedJobs from '../pages/Candidate/SavedJobs/SavedJobs';
// import CandidateProfile from '../pages/Candidate/Profile/Profile';
// import Resume from '../pages/Candidate/Resume/Resume';
// import CreateResume from '../pages/Candidate/Resume/CreateResume';
// import EditResume from '../pages/Candidate/Resume/EditResume';
// import CandidateMessages from '../pages/Candidate/Messages/Messages';
// import CandidateSettings from '../pages/Candidate/Settings/Settings';

// Admin pages - Tạm thời comment out các trang chưa tồn tại
// import AdminLayout from '../pages/Admin/Layout/AdminLayout';
// import AdminDashboard from '../pages/Admin/Dashboard/Dashboard';
// import AdminUsers from '../pages/Admin/Users/Users';
// import AdminEmployers from '../pages/Admin/Employers/Employers';
// import AdminCandidates from '../pages/Admin/Candidates/Candidates';
// import AdminJobs from '../pages/Admin/Jobs/Jobs';
// import AdminPackages from '../pages/Admin/Packages/Packages';
// import CreatePackage from '../pages/Admin/Packages/CreatePackage';
// import EditPackage from '../pages/Admin/Packages/EditPackage';
// import AdminCategories from '../pages/Admin/Categories/Categories';
// import AdminSkills from '../pages/Admin/Skills/Skills';
// import AdminReports from '../pages/Admin/Reports/Reports';
// import AdminSettings from '../pages/Admin/Settings/Settings';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path={ROUTES.PRICING} element={<Pricing />} />
      
      {/* Tạm thời comment out các trang chưa tồn tại */}
      {/* <Route path={ROUTES.ABOUT} element={<About />} />
      <Route path={ROUTES.CONTACT} element={<Contact />} />
      <Route path={ROUTES.TERMS} element={<Terms />} />
      <Route path={ROUTES.PRIVACY} element={<Privacy />} /> */}

      {/* Auth routes */}
      <Route path={ROUTES.LOGIN} element={<Login />} />
      
      {/* Tạm thời comment out các trang auth chưa tồn tại */}
      {/* <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
      <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} /> */}

      {/* Employer protected routes - Tạm thời comment out */}
      {/* <Route 
        path={ROUTES.EMPLOYER.HOME} 
        element={
          <ProtectedRoute allowedRoles={['employer']}>
            <EmployerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<EmployerDashboard />} />
        <Route path="dashboard" element={<EmployerDashboard />} />
        <Route path="jobs" element={<EmployerJobs />} />
        <Route path="jobs/create" element={<CreateJob />} />
        <Route path="jobs/:id/edit" element={<EditJob />} />
        <Route path="jobs/:id" element={<ViewJob />} />
        <Route path="applications" element={<Applications />} />
        <Route path="applications/:id" element={<ViewApplication />} />
        <Route path="company" element={<CompanyProfile />} />
        <Route path="company/edit" element={<EditCompany />} />
        <Route path="packages" element={<Packages />} />
        <Route path="billing" element={<Billing />} />
        <Route path="messages" element={<EmployerMessages />} />
        <Route path="settings" element={<EmployerSettings />} />
      </Route> */}

      {/* Candidate protected routes - Tạm thời comment out */}
      {/* <Route 
        path={ROUTES.CANDIDATE.HOME} 
        element={
          <ProtectedRoute allowedRoles={['candidate']}>
            <CandidateLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CandidateDashboard />} />
        <Route path="dashboard" element={<CandidateDashboard />} />
        <Route path="jobs" element={<CandidateJobs />} />
        <Route path="jobs/:id" element={<CandidateViewJob />} />
        <Route path="applications" element={<CandidateApplications />} />
        <Route path="saved-jobs" element={<SavedJobs />} />
        <Route path="profile" element={<CandidateProfile />} />
        <Route path="resume" element={<Resume />} />
        <Route path="resume/create" element={<CreateResume />} />
        <Route path="resume/:id/edit" element={<EditResume />} />
        <Route path="messages" element={<CandidateMessages />} />
        <Route path="settings" element={<CandidateSettings />} />
      </Route> */}

      {/* Admin protected routes - Tạm thời comment out */}
      {/* <Route 
        path={ROUTES.ADMIN.HOME} 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="employers" element={<AdminEmployers />} />
        <Route path="candidates" element={<AdminCandidates />} />
        <Route path="jobs" element={<AdminJobs />} />
        <Route path="packages" element={<AdminPackages />} />
        <Route path="packages/create" element={<CreatePackage />} />
        <Route path="packages/:id/edit" element={<EditPackage />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="skills" element={<AdminSkills />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route> */}

      {/* Error routes */}
      {/* <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />
      <Route path={ROUTES.SERVER_ERROR} element={<ServerError />} /> */}
      <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
      
      {/* 404 route - Must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;