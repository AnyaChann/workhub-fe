import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import './DashboardLayout.css';

// Components
import DashboardHeader from './components/DashboardHeader/DashboardHeader';
import DashboardSidebar from './components/DashboardSidebar/DashboardSidebar';
import ActiveJobs from './components/ActiveJobs/ActiveJobs';
import Drafts from './components/Drafts/Drafts';
import Expired from './components/Expired/Expired';
import CreateJob from './components/CreateJob/CreateJob';
import Brands from './components/Brands/Brands';
import Account from './components/Account/Account';
import ManageUsers from './components/Account/ManageUsers/ManageUsers';
import Inventory from './components/Account/Inventory/Inventory';
import Profile from './components/Account/Profile/Profile';
import SupportButton from './components/SupportButton/SupportButton';

// Constants
import ROUTES from '../../../routes/routeConstants';

const DashboardLayout = () => {
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Determine current tab from URL
  const getCurrentTab = () => {
    const path = location.pathname;
    
    if (path.includes('/jobs/active')) return 'active-jobs';
    if (path.includes('/jobs/drafts')) return 'drafts';
    if (path.includes('/jobs/expired')) return 'expired';
    if (path.includes('/jobs/create')) return 'create-job';
    if (path.includes('/brands')) return 'brands';
    if (path.includes('/account/profile')) return 'profile';
    if (path.includes('/account/users')) return 'manage-users';
    if (path.includes('/account/inventory')) return 'inventory';
    if (path.includes('/account')) return 'account';
    
    return 'active-jobs'; // default
  };

  const currentTab = getCurrentTab();

  const handleCreateJob = () => {
    navigate(ROUTES.EMPLOYER.JOBS.CREATE);
  };

  const handleCreateJobModal = () => {
    setShowCreateJobModal(true);
  };

  const handleCloseCreateJob = () => {
    setShowCreateJobModal(false);
    // Navigate back to jobs list
    navigate(ROUTES.EMPLOYER.JOBS.ACTIVE);
  };

  const handleSaveJob = (jobData) => {
    console.log('Job saved:', jobData);
    setShowCreateJobModal(false);
    
    // Navigate based on job status
    if (jobData.status === 'draft') {
      navigate(ROUTES.EMPLOYER.JOBS.DRAFTS);
    } else {
      navigate(ROUTES.EMPLOYER.JOBS.ACTIVE);
    }
  };

  const handleTabChange = (tab) => {
    const tabRoutes = {
      'active-jobs': ROUTES.EMPLOYER.JOBS.ACTIVE,
      'drafts': ROUTES.EMPLOYER.JOBS.DRAFTS,
      'expired': ROUTES.EMPLOYER.JOBS.EXPIRED,
      'brands': ROUTES.EMPLOYER.BRANDS,
      'account': ROUTES.EMPLOYER.ACCOUNT.BASE,
      'profile': ROUTES.EMPLOYER.ACCOUNT.PROFILE,
      'manage-users': ROUTES.EMPLOYER.ACCOUNT.USERS,
      'inventory': ROUTES.EMPLOYER.ACCOUNT.INVENTORY
    };

    const route = tabRoutes[tab];
    if (route) {
      navigate(route);
    }
  };

  const handleContinuePosting = (jobData) => {
    console.log('Continue posting job:', jobData);
    navigate(ROUTES.EMPLOYER.JOBS.CREATE, { state: { jobData } });
  };

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
      />
      
      <div className="dashboard-content">
        <DashboardSidebar 
          selectedTab={currentTab} 
          onTabChange={handleTabChange}
          onCreateJob={handleCreateJob}
        />
        
        <div className="main-content-area">
          <Routes>
            {/* Default redirect */}
            <Route 
              path="/" 
              element={<Navigate to="jobs/active" replace />} 
            />
            
            {/* Jobs routes */}
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
            
            {/* Brands route */}
            <Route 
              path="brands" 
              element={<Brands />} 
            />
            
            {/* Account routes */}
            <Route 
              path="account" 
              element={<Account />} 
            />
            <Route 
              path="account/profile" 
              element={<Profile />} 
            />
            <Route 
              path="account/users" 
              element={<ManageUsers />} 
            />
            <Route 
              path="account/inventory" 
              element={<Inventory />} 
            />
            
            {/* Fallback */}
            <Route 
              path="*" 
              element={<Navigate to="jobs/active" replace />} 
            />
          </Routes>
        </div>
      </div>

      <SupportButton />
    </div>
  );
};

export default DashboardLayout;