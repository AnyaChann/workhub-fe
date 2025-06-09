import React, { useState } from 'react';
import './DashboardLayout.css';
import DashboardHeader from './components/DashboardHeader/DashboardHeader';
import DashboardSidebar from './components/DashboardSidebar/DashboardSidebar';
import ActiveJobs from './components/ActiveJobs/ActiveJobs';
import Drafts from './components/Drafts/Drafts';
import Expired from './components/Expired/Expired';
import Brands from './components/Brands/Brands';
import Account from './components/Account/Account';
import ManageUsers from './components/ManageUsers/ManageUsers';
import SupportButton from './components/SupportButton/SupportButton';

const DashboardLayout = () => {
  const [selectedTab, setSelectedTab] = useState('active-jobs');

  const renderMainContent = () => {
    switch(selectedTab) {
      case 'active-jobs':
        return <ActiveJobs />;
      case 'drafts':
        return <Drafts />;
      case 'expired':
        return <Expired />;
      case 'brands':
        return <Brands />;
      case 'account':
        return <Account />;
      case 'manage-users':
        return <ManageUsers />;
      default:
        return <ActiveJobs />;
    }
  };

  return (
    <div className="dashboard">
      <DashboardHeader onNavigate={setSelectedTab} />
      
      <div className="dashboard-content">
        <DashboardSidebar 
          selectedTab={selectedTab} 
          onTabChange={setSelectedTab} 
        />
        
        {renderMainContent()}
      </div>

      <SupportButton />
    </div>
  );
};

export default DashboardLayout;