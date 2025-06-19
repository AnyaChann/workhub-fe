import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../core/contexts/AuthContext';
import ROUTES from '../../../../../core/routing/routeConstants';
import './RecruiterLayout.css';

// ✅ Fixed Layout Components - Use renamed components
import RecruiterHeader from '../RecruiterHeader/RecruiterHeader';
import RecruiterSidebar from '../RecruiterSidebar/RecruiterSidebar';

// ✅ Fixed Page Components - Use new page structure
import ActiveJobsPage from '../../../pages/Jobs/ActiveJobs/ActiveJobsPage';
import DraftJobsPage from '../../../pages/Jobs/DraftJobs/DraftJobsPage';
import ExpiredJobsPage from '../../../pages/Jobs/ExpiredJobs/ExpiredJobsPage';
import CreateJobPage from '../../../pages/Jobs/CreateJob/CreateJobPage';

// ✅ Fixed Account Pages - Use new account structure
import AccountSettingsPage from '../../../pages/Account/Settings/AccountSettingsPage';
import UserProfilePage from '../../../pages/Account/Profile/UserProfilePage';
import TeamManagementPage from '../../../pages/Account/Team/TeamManagementPage';
import BillingPage from '../../../pages/Account/Billing/BillingPage';

// ✅ Other Pages
import CandidatesPage from '../../../pages/Candidates/CandidatesPage';
import CompanyProfilePage from '../../../pages/Company/CompanyProfilePage';
import AnalyticsPage from '../../../pages/Analytics/AnalyticsPage';

// ✅ Shared Components
import SupportButton from '../../../../../shared/components/SupportButton/SupportButton';

const RecruiterLayout = () => {
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isRecruiter, userRole } = useAuth();

  // Debug current path
  useEffect(() => {
    console.log('📍 RecruiterLayout - Current path:', location.pathname);
    console.log('👤 User role:', userRole);
  }, [location.pathname, userRole]);

  // Security check - only recruiters can access
  useEffect(() => {
    if (!isRecruiter()) {
      console.warn('❌ Non-recruiter trying to access recruiter dashboard');
      navigate('/unauthorized', { replace: true });
    }
  }, [isRecruiter, navigate]);

  // ✅ Fixed function name: getCurrentTab → getCurrentPage
  const getCurrentPage = () => {
    const path = location.pathname;
    
    if (path.includes('/jobs/active')) return 'active-jobs';
    if (path.includes('/jobs/drafts')) return 'draft-jobs';
    if (path.includes('/jobs/expired')) return 'expired-jobs';
    if (path.includes('/jobs/archived')) return 'archived-jobs';
    if (path.includes('/jobs/create')) return 'create-job';
    if (path.includes('/candidates')) return 'candidates';
    if (path.includes('/company')) return 'company-profile';
    if (path.includes('/analytics')) return 'analytics';
    if (path.includes('/account/settings')) return 'account-settings';
    if (path.includes('/account/profile')) return 'user-profile';
    if (path.includes('/account/team')) return 'team-management';
    if (path.includes('/account/billing')) return 'billing';
    if (path.includes('/account')) return 'account-settings';
    
    return 'active-jobs';
  };

  const currentPage = getCurrentPage();

  const handleCreateJob = () => {
    navigate(ROUTES.RECRUITER.JOBS.CREATE);
  };

  const handleCreateJobModal = () => {
    setShowCreateJobModal(true);
  };

  const handleCloseCreateJob = () => {
    setShowCreateJobModal(false);
    navigate(ROUTES.RECRUITER.JOBS.ACTIVE);
  };

  const handleSaveJob = (jobData) => {
    console.log('💾 Job saved:', jobData);
    setShowCreateJobModal(false);
    
    if (jobData.status === 'draft') {
      navigate(ROUTES.RECRUITER.JOBS.DRAFTS);
    } else {
      navigate(ROUTES.RECRUITER.JOBS.ACTIVE);
    }
  };

  // ✅ Fixed function name: handleTabChange → handlePageChange
  const handlePageChange = (page) => {
    const pageRoutes = {
      'active-jobs': ROUTES.RECRUITER.JOBS.ACTIVE,
      'draft-jobs': ROUTES.RECRUITER.JOBS.DRAFTS,
      'expired-jobs': ROUTES.RECRUITER.JOBS.EXPIRED,
      'archived-jobs': ROUTES.RECRUITER.JOBS.ARCHIVED,
      'create-job': ROUTES.RECRUITER.JOBS.CREATE,
      'candidates': ROUTES.RECRUITER.CANDIDATES.BASE,
      'company-profile': ROUTES.RECRUITER.COMPANY.PROFILE,
      'analytics': ROUTES.RECRUITER.REPORTS.ANALYTICS,
      'account-settings': ROUTES.RECRUITER.ACCOUNT.BASE,
      'user-profile': ROUTES.RECRUITER.ACCOUNT.PROFILE,
      'team-management': ROUTES.RECRUITER.COMPANY.TEAM,
      'billing': ROUTES.RECRUITER.COMPANY.BILLING
    };

    const route = pageRoutes[page];
    if (route) {
      console.log('📍 Navigating to:', route);
      navigate(route);
    } else {
      console.warn('⚠️ Unknown page:', page, 'Available routes:', Object.keys(pageRoutes));
      navigate(ROUTES.RECRUITER.JOBS.ACTIVE);
    }
  };

  const handleContinuePosting = (jobData) => {
    console.log('📝 Continue posting job:', jobData);
    navigate(ROUTES.RECRUITER.JOBS.CREATE, { state: { jobData } });
  };

  if (!user) {
    return null; // ProtectedRoute should handle this
  }

  return (
    <div className="recruiter-layout">
      {/* Create Job Modal */}
      {showCreateJobModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <CreateJobPage 
              onClose={() => setShowCreateJobModal(false)}
              onSave={handleSaveJob}
              isModal={true}
            />
          </div>
        </div>
      )}

      {/* ✅ Use renamed components */}
      <RecruiterHeader 
        onNavigate={handlePageChange}
        onCreateJob={handleCreateJobModal}
        currentPage={currentPage}
      />
      
      <div className="layout-content">
        <RecruiterSidebar 
          selectedPage={currentPage} 
          onPageChange={handlePageChange}
          onCreateJob={handleCreateJob}
        />
        
        <main className="main-content">
          <Routes>
            {/* Default redirect to active jobs */}
            <Route 
              index
              element={<Navigate to="jobs/active" replace />} 
            />
            
            {/* ✅ Job Management Routes - Use new page components */}
            <Route 
              path="jobs/active" 
              element={<ActiveJobsPage onCreateJob={handleCreateJob} />} 
            />
            <Route 
              path="jobs/drafts" 
              element={
                <DraftJobsPage 
                  onCreateJob={handleCreateJob}
                  onContinuePosting={handleContinuePosting}
                />
              } 
            />
            <Route 
              path="jobs/expired" 
              element={<ExpiredJobsPage onCreateJob={handleCreateJob} />} 
            />
            <Route 
              path="jobs/create" 
              element={
                <CreateJobPage 
                  onClose={handleCloseCreateJob}
                  onSave={handleSaveJob}
                />
              } 
            />
            
            {/* ✅ Talent Management */}
            <Route path="candidates" element={<CandidatesPage />} />
            
            {/* ✅ Business Management */}
            <Route path="company" element={<CompanyProfilePage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            
            {/* ✅ Account Management Routes - Use new page structure */}
            <Route path="account" element={<AccountSettingsPage />} />
            <Route path="account/settings" element={<AccountSettingsPage />} />
            <Route path="account/profile" element={<UserProfilePage />} />
            <Route path="account/team" element={<TeamManagementPage />} />
            <Route path="account/billing" element={<BillingPage />} />
            
            {/* Fallback redirect */}
            <Route 
              path="*" 
              element={<Navigate to="jobs/active" replace />} 
            />
          </Routes>
        </main>
      </div>

      <SupportButton />
      
      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info">
          Path: {location.pathname} | Page: {currentPage} | Role: {userRole}
        </div>
      )}
    </div>
  );
};

export default RecruiterLayout;