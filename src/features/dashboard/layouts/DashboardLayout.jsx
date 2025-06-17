import React, { useState, useEffect } from 'react';
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
import SupportButton from '../../../components/SupportButton/SupportButton';

const DashboardLayout = () => {
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Debug current path
  useEffect(() => {
    console.log('📍 DashboardLayout - Current path:', location.pathname);
  }, [location.pathname]);

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
    
    return 'active-jobs';
  };

  const currentTab = getCurrentTab();

  const handleCreateJob = () => {
    navigate('/employer/dashboard/jobs/create');
  };

  const handleCreateJobModal = () => {
    setShowCreateJobModal(true);
  };

  const handleCloseCreateJob = () => {
    setShowCreateJobModal(false);
    navigate('/employer/dashboard/jobs/active');
  };

  const handleSaveJob = (jobData) => {
    console.log('Job saved:', jobData);
    setShowCreateJobModal(false);
    
    if (jobData.status === 'draft') {
      navigate('/employer/dashboard/jobs/drafts');
    } else {
      navigate('/employer/dashboard/jobs/active');
    }
  };

  const handleTabChange = (tab) => {
    const tabRoutes = {
      'active-jobs': '/employer/dashboard/jobs/active',
      'drafts': '/employer/dashboard/jobs/drafts',
      'expired': '/employer/dashboard/jobs/expired',
      'brands': '/employer/dashboard/brands',
      'account': '/employer/dashboard/account',
      'profile': '/employer/dashboard/account/profile',
      'manage-users': '/employer/dashboard/account/users',
      'inventory': '/employer/dashboard/account/inventory'
    };

    const route = tabRoutes[tab];
    if (route) {
      console.log('📍 Navigating to:', route);
      navigate(route);
    }
  };

  const handleContinuePosting = (jobData) => {
    console.log('Continue posting job:', jobData);
    navigate('/employer/dashboard/jobs/create', { state: { jobData } });
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
          {/* ✅ Fix nested routing - remove redundant redirects */}
          <Routes>
            {/* ✅ Default to jobs/active - NO LOOP */}
            <Route 
              index
              element={<Navigate to="jobs/active" replace />} 
            />
            
            {/* ✅ Jobs routes - relative paths work correctly */}
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
            
            {/* Other routes */}
            <Route path="brands" element={<Brands />} />
            <Route path="account" element={<Account />} />
            <Route path="account/profile" element={<Profile />} />
            <Route path="account/users" element={<ManageUsers />} />
            <Route path="account/inventory" element={<Inventory />} />
            
            {/* ✅ Fallback redirect - ONLY once */}
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
        <div style={{
          position: 'fixed',
          bottom: '10px',
          left: '10px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '10px',
          zIndex: 9999,
          fontFamily: 'monospace'
        }}>
          Path: {location.pathname} | Tab: {currentTab}
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;