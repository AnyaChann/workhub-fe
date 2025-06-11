import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './DashboardLayout.css';
import DashboardHeader from './components/DashboardHeader/DashboardHeader';
import DashboardSidebar from './components/DashboardSidebar/DashboardSidebar';
import ActiveJobs from './components/ActiveJobs/ActiveJobs';
import Drafts from './components/Drafts/Drafts';
import Expired from './components/Expired/Expired';
import Brands from './components/Brands/Brands';
import Account from './components/Account/Account';
import ManageUsers from './components/Account/ManageUsers/ManageUsers';
import Inventory from './components/Account/Inventory/Inventory';
import Profile from './components/Account/Profile/Profile';
import CreateJob from './components/CreateJob/CreateJob';
import SupportButton from './components/SupportButton/SupportButton';

const DashboardLayout = () => {
  const [selectedTab, setSelectedTab] = useState('active-jobs');
  const [showCreateJob, setShowCreateJob] = useState(false);
  const location = useLocation();

  // Handle initial tab based on URL hash or query params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');
    const hashTab = location.hash.replace('#', '');
    
    if (tabParam) {
      setSelectedTab(tabParam);
    } else if (hashTab) {
      setSelectedTab(hashTab);
    }
  }, [location]);

  const handleCreateJob = () => {
    setShowCreateJob(true);
  };

  const handleCloseCreateJob = () => {
    setShowCreateJob(false);
  };

  const handleSaveJob = (jobData) => {
    console.log('Job saved:', jobData);
    // TODO: Save job to backend
    setShowCreateJob(false);
    
    // Navigate to appropriate tab based on job status
    if (jobData.status === 'draft') {
      setSelectedTab('drafts');
    } else {
      setSelectedTab('active-jobs');
    }
  };

  const handleTabChange = (newTab) => {
    setSelectedTab(newTab);
    
    // Update URL without full page reload
    const url = new URL(window.location);
    url.searchParams.set('tab', newTab);
    window.history.pushState({}, '', url);
    
    console.log(`✅ Tab changed to: ${newTab}`);
  };

  const renderMainContent = () => {
    if (showCreateJob) {
      return (
        <CreateJob 
          onClose={handleCloseCreateJob}
          onSave={handleSaveJob}
        />
      );
    }

    console.log(`🔄 Rendering content for tab: ${selectedTab}`);

    switch(selectedTab) {
      case 'active-jobs':
        return <ActiveJobs onCreateJob={handleCreateJob} />;
      case 'drafts':
        return <Drafts onCreateJob={handleCreateJob} />;
      case 'expired':
        return <Expired />;
      case 'brands':
        return <Brands />;
      case 'account':
        return <Account />;
      case 'manage-users':
        return <ManageUsers />;
      case 'inventory':
        return <Inventory />;
      case 'profile':
        return <Profile />;
      default:
        console.log(`⚠️ Unknown tab: ${selectedTab}, showing active-jobs`);
        return <ActiveJobs onCreateJob={handleCreateJob} />;
    }
  };

  return (
    <div className="dashboard">
      <DashboardHeader 
        onNavigate={handleTabChange}
        onCreateJob={handleCreateJob}
        currentTab={selectedTab}
      />
      
      <div className="dashboard-content">
        {!showCreateJob && (
          <DashboardSidebar 
            selectedTab={selectedTab} 
            onTabChange={handleTabChange} 
          />
        )}
        
        {/* <div className="main-content-area">
           Debug info - remove in production 
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
            display: process.env.NODE_ENV === 'development' ? 'block' : 'none'
          }}>
            Current Tab: {selectedTab}
          </div> */}
          
          {renderMainContent()}
        </div>
      </div>

    //   {!showCreateJob && <SupportButton />}
    // </div>
  );
};

export default DashboardLayout;