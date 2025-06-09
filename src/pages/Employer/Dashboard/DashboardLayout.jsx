import React, { useState } from 'react';
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

  const renderMainContent = () => {
    if (showCreateJob) {
      return (
        <CreateJob 
          onClose={handleCloseCreateJob}
          onSave={handleSaveJob}
        />
      );
    }

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
        return <ActiveJobs onCreateJob={handleCreateJob} />;
    }
  };

  return (
    <div className="dashboard">
      <DashboardHeader 
        onNavigate={setSelectedTab}
        onCreateJob={handleCreateJob}
      />
      
      <div className="dashboard-content">
        {!showCreateJob && (
          <DashboardSidebar 
            selectedTab={selectedTab} 
            onTabChange={setSelectedTab} 
          />
        )}
        
        {renderMainContent()}
      </div>

      {!showCreateJob && <SupportButton />}
    </div>
  );
};

export default DashboardLayout;