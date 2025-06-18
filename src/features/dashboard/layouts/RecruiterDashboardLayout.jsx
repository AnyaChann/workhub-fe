import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/contexts/AuthContext';
import ROUTES from '../../../core/routing/routeConstants';
import './DashboardLayout.css';

// Recruiter Components
import DashboardHeader from '../components/recruiter/DashboardHeader/DashboardHeader';
import DashboardSidebar from '../components/recruiter/DashboardSidebar/DashboardSidebar';
import ActiveJobs from '../../jobs/components/manage/ActiveJobs/ActiveJobs';
import Drafts from '../../jobs/components/manage/Drafts/Drafts';
import Expired from '../../jobs/components/manage/Expired/Expired';
import CreateJob from '../../jobs/components/create/CreateJob';
import Brands from '../components/recruiter/Brands/Brands';
import Account from '../components/recruiter/Account/Account';
import ManageUsers from '../components/recruiter/Account/ManageUsers/ManageUsers';
import Inventory from '../components/recruiter/Account/Inventory/Inventory';
import Profile from '../components/recruiter/Account/Profile/Profile';
import SupportButton from '../../../shared/components/SupportButton/SupportButton';

const RecruiterDashboardLayout = () => {
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isRecruiter, userRole } = useAuth();

  // Debug current path
  useEffect(() => {
    console.log('📍 RecruiterDashboardLayout - Current path:', location.pathname);
    console.log('👤 User role:', userRole);
  }, [location.pathname, userRole]);

  // Security check - only recruiters can access
  useEffect(() => {
    if (!isRecruiter()) {
      console.warn('❌ Non-recruiter trying to access recruiter dashboard');
      navigate('/unauthorized', { replace: true });
    }
  }, [isRecruiter, navigate]);

  // Determine current tab from URL
  const getCurrentTab = () => {
    const path = location.pathname;
    
    if (path.includes('/jobs/active')) return 'active-jobs';
    if (path.includes('/jobs/drafts')) return 'drafts';
    if (path.includes('/jobs/expired')) return 'expired';
    if (path.includes('/jobs/archived')) return 'archived';
    if (path.includes('/jobs/create')) return 'create-job';
    if (path.includes('/candidates')) return 'candidates';
    if (path.includes('/company')) return 'company';
    if (path.includes('/reports')) return 'reports';
    if (path.includes('/account/profile')) return 'profile';
    if (path.includes('/account/users')) return 'manage-users';
    if (path.includes('/account/inventory')) return 'inventory';
    if (path.includes('/account')) return 'account';
    
    return 'active-jobs';
  };

  const currentTab = getCurrentTab();

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
    console.log('Job saved:', jobData);
    setShowCreateJobModal(false);
    
    if (jobData.status === 'draft') {
      navigate(ROUTES.RECRUITER.JOBS.DRAFTS);
    } else {
      navigate(ROUTES.RECRUITER.JOBS.ACTIVE);
    }
  };

  const handleTabChange = (tab) => {
    const tabRoutes = {
      'active-jobs': ROUTES.RECRUITER.JOBS.ACTIVE,
      'drafts': ROUTES.RECRUITER.JOBS.DRAFTS,
      'expired': ROUTES.RECRUITER.JOBS.EXPIRED,
      'archived': ROUTES.RECRUITER.JOBS.ARCHIVED,
      'candidates': ROUTES.RECRUITER.CANDIDATES.BASE,
      'company': ROUTES.RECRUITER.COMPANY.PROFILE,
      'reports': ROUTES.RECRUITER.REPORTS.ANALYTICS,
      'account': ROUTES.RECRUITER.ACCOUNT.PROFILE,
      'profile': ROUTES.RECRUITER.ACCOUNT.PROFILE,
      'manage-users': `${ROUTES.RECRUITER.COMPANY.TEAM}`,
      'inventory': `${ROUTES.RECRUITER.COMPANY.BILLING}`
    };

    const route = tabRoutes[tab];
    if (route) {
      console.log('📍 Navigating to:', route);
      navigate(route);
    }
  };

  const handleContinuePosting = (jobData) => {
    console.log('Continue posting job:', jobData);
    navigate(ROUTES.RECRUITER.JOBS.CREATE, { state: { jobData } });
  };

  if (!user) {
    return null; // ProtectedRoute should handle this
  }

  return (
    <div className="dashboard">
      {/* Create Job Modal */}
      {showCreateJobModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <CreateJob 
              onClose={() => setShowCreateJobModal(false)}
              onSave={handleSaveJob}
            />
          </div>
        </div>
      )}

      <DashboardHeader 
        onNavigate={handleTabChange}
        onCreateJob={handleCreateJobModal}
        currentTab={currentTab}
        userType="recruiter"
      />
      
      <div className="dashboard-content">
        <DashboardSidebar 
          selectedTab={currentTab} 
          onTabChange={handleTabChange}
          onCreateJob={handleCreateJob}
          userType="recruiter"
        />
        
        <div className="main-content-area">
          <Routes>
            {/* Default redirect to active jobs */}
            <Route 
              index
              element={<Navigate to="jobs/active" replace />} 
            />
            
            {/* Jobs Management Routes */}
            <Route 
              path="jobs/active" 
              element={<ActiveJobs onCreateJob={handleCreateJob} />} 
            />
            <Route 
              path="jobs/drafts" 
              element={
                <Drafts 
                  onCreateJob={handleCreateJob}
                  onContinuePosting={handleContinuePosting}
                />
              } 
            />
            <Route 
              path="jobs/expired" 
              element={<Expired onCreateJob={handleCreateJob} />} 
            />
            <Route 
              path="jobs/create" 
              element={
                <CreateJob 
                  onClose={handleCloseCreateJob}
                  onSave={handleSaveJob}
                />
              } 
            />
            
            {/* Company Management Routes */}
            <Route path="company/*" element={<Brands />} />
            
            {/* Account Management Routes */}
            <Route path="account" element={<Account />} />
            <Route path="account/profile" element={<Profile />} />
            <Route path="account/team" element={<ManageUsers />} />
            <Route path="account/billing" element={<Inventory />} />
            
            {/* Fallback redirect */}
            <Route 
              path="*" 
              element={<Navigate to="jobs/active" replace />} 
            />
          </Routes>
        </div>
      </div>

      <SupportButton />
      
      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info">
          Path: {location.pathname} | Tab: {currentTab} | Role: {userRole}
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboardLayout;