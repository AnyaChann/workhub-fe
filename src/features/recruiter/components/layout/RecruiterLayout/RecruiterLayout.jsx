import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../core/contexts/AuthContext';
import ROUTES from '../../../../../core/routing/routeConstants';
import './RecruiterLayout.css';

// Layout Components
import RecruiterHeader from '../RecruiterHeader/RecruiterHeader';
import RecruiterSidebar from '../RecruiterSidebar/RecruiterSidebar';

// Page Components
import ActiveJobsPage from '../../../pages/Jobs/ActiveJobs/ActiveJobsPage';
import DraftJobsPage from '../../../pages/Jobs/DraftJobs/DraftJobsPage';
import ExpiredJobsPage from '../../../pages/Jobs/ExpiredJobs/ExpiredJobsPage';
import CreateJobPage from '../../../pages/Jobs/CreateJob/CreateJobPage';

// Account Pages
import AccountSettingsPage from '../../../pages/Account/Settings/AccountSettingsPage';
import UserProfilePage from '../../../pages/Account/Profile/UserProfilePage';
import TeamManagementPage from '../../../pages/Account/Team/TeamManagementPage';
import BillingPage from '../../../pages/Account/Billing/BillingPage';

// Other Pages
import CandidatesPage from '../../../pages/Candidates/CandidatesPage';
import CompanyProfilePage from '../../../pages/Company/CompanyProfilePage';
import AnalyticsPage from '../../../pages/Analytics/AnalyticsPage';

// Shared Components
import SupportButton from '../../../../../shared/components/SupportButton/SupportButton';

const RecruiterLayout = () => {
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
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

  // ✅ Enhanced modal handlers
  const handleCreateJob = () => {
    navigate(ROUTES.RECRUITER.JOBS.CREATE);
  };

  const handleCreateJobModal = () => {
    setShowCreateJobModal(true);
    setError(null);
  };

  const handleCloseCreateJob = () => {
    setShowCreateJobModal(false);
    setError(null);
    navigate(ROUTES.RECRUITER.JOBS.ACTIVE);
  };

  const handleSaveJob = async (jobData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('💾 Job saved:', jobData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setShowCreateJobModal(false);
      
      if (jobData.status === 'draft') {
        navigate(ROUTES.RECRUITER.JOBS.DRAFTS);
      } else {
        navigate(ROUTES.RECRUITER.JOBS.ACTIVE);
      }
    } catch (err) {
      setError(err.message || 'Failed to save job');
    } finally {
      setIsLoading(false);
    }
  };

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

  // ✅ Modal keyboard handler
  const handleModalKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleCloseCreateJob();
    }
  };

  // ✅ Modal click outside handler
  const handleModalOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseCreateJob();
    }
  };

  if (!user) {
    return (
      <div className="content-loading">
        <div className="spinner"></div>
        <p>Loading user...</p>
      </div>
    );
  }

  return (
    <div className="recruiter-layout">
      {/* ✅ Enhanced Create Job Modal */}
      {showCreateJobModal && (
        <div 
          className="modal-overlay"
          onClick={handleModalOverlayClick}
          onKeyDown={handleModalKeyDown}
          tabIndex={-1}
        >
          <div className="modal-content" tabIndex={0}>
            {/* Close Button */}
            <button 
              className="modal-close"
              onClick={handleCloseCreateJob}
              aria-label="Close modal"
              title="Close (Esc)"
            >
              ✕
            </button>
            
            {/* Modal Body */}
            <div className="modal-body">
              {error ? (
                <div className="content-error">
                  <div className="error-icon">⚠️</div>
                  <h3 className="error-title">Error</h3>
                  <p className="error-message">{error}</p>
                  <button 
                    className="retry-button"
                    onClick={() => setError(null)}
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <CreateJobPage 
                  onClose={handleCloseCreateJob}
                  onSave={handleSaveJob}
                  isModal={true}
                  isLoading={isLoading}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <RecruiterHeader 
        onNavigate={handlePageChange}
        onCreateJob={handleCreateJobModal}
        currentPage={currentPage}
      />
      
      {/* Main Layout Content */}
      <div className="layout-content">
        <RecruiterSidebar 
          selectedPage={currentPage} 
          onPageChange={handlePageChange}
          onCreateJob={handleCreateJob}
        />
        
        <main className="main-content">
          <div className="page-container">
            <Routes>
              {/* Default redirect to active jobs */}
              <Route 
                index
                element={<Navigate to="jobs/active" replace />} 
              />
              
              {/* Job Management Routes */}
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
              
              {/* Talent Management */}
              <Route path="candidates" element={<CandidatesPage />} />
              
              {/* Business Management */}
              <Route path="company" element={<CompanyProfilePage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              
              {/* Account Management Routes */}
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
          </div>
        </main>
      </div>

      {/* Support Button */}
      <SupportButton />
      
      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info">
          <strong>Path:</strong> {location.pathname}<br />
          <strong>Page:</strong> {currentPage}<br />
          <strong>Role:</strong> {userRole}<br />
          <strong>Modal:</strong> {showCreateJobModal ? 'Open' : 'Closed'}
        </div>
      )}
    </div>
  );
};

export default RecruiterLayout;