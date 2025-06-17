import React from 'react';
import { Link } from 'react-router-dom';
import './DashboardHeader.css';
import AccountDropdown from '../Dropdowns/AccountDropdown/AccountDropdown';
// import CreateJobButton from '../CreateJobButton/CreateJobButton';

const DashboardHeader = ({ onNavigate, onCreateJob, currentTab }) => {
  const handleAccountNavigation = (tab) => {
    console.log(`🔄 AccountDropdown navigation request: ${tab}`);
    if (onNavigate) {
      onNavigate(tab);
    }
  };

//   const handleCreateJobClick = () => {
//     console.log('🔄 Create job button clicked');
//     if (onCreateJob) {
//       onCreateJob();
//     }
//   };

  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo">
            <Link to={'/employer/dashboard'} className='logo-link'><span className="logo-text">WorkHub®</span></Link>
          </div>
        </div>
        
        <div className="header-center">
          <h1 className="dashboard-title">
            {getPageTitle(currentTab)}
          </h1>
        </div>
        
        <div className="header-right">
          {/* <CreateJobButton onClick={handleCreateJobClick} /> */}
          <AccountDropdown onNavigate={handleAccountNavigation} />
        </div>
      </div>
    </header>
  );
};

// Helper function to get page title based on current tab
const getPageTitle = (tab) => {
  const titles = {
    'active-jobs': 'Active Jobs',
    'drafts': 'Draft Jobs',
    'expired': 'Expired Jobs',
    'brands': 'Brand Management',
    'account': 'Account Settings',
    'manage-users': 'Manage Users',
    'inventory': 'Packages & Billing',
    'profile': 'User Profile'
  };
  
  return titles[tab] || 'Dashboard';
};

export default DashboardHeader;