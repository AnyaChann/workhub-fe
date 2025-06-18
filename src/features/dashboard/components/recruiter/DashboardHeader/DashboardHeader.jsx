import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../../../core/contexts/AuthContext';
import ROUTES from '../../../../../core/routing/routeConstants';
import './DashboardHeader.css';
import AccountDropdown from '../Dropdowns/AccountDropdown/AccountDropdown';

const DashboardHeader = ({ onNavigate, onCreateJob, currentTab, userType = 'recruiter' }) => {
  const { getDashboardUrl, userRole } = useAuth();

  const handleAccountNavigation = (tab) => {
    console.log(`🔄 AccountDropdown navigation request: ${tab}`);
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  // Get logo link based on user role
  const getLogoLink = () => {
    switch (userRole) {
      case 'recruiter':
        return ROUTES.RECRUITER.DASHBOARD;
      case 'candidate':
        return ROUTES.CANDIDATE.DASHBOARD;
      case 'admin':
        return ROUTES.ADMIN.DASHBOARD;
      default:
        return getDashboardUrl();
    }
  };

  // Get page title based on current tab and user type
  const getPageTitle = (tab) => {
    const titles = {
      recruiter: {
        'active-jobs': 'Active Jobs',
        'drafts': 'Draft Jobs',
        'expired': 'Expired Jobs',
        'archived': 'Archived Jobs',
        'candidates': 'Candidates',
        'company': 'Company Profile',
        'reports': 'Reports & Analytics',
        'account': 'Account Settings',
        'manage-users': 'Manage Team',
        'inventory': 'Packages & Billing',
        'profile': 'User Profile'
      },
      candidate: {
        'jobs': 'Job Search',
        'applications': 'My Applications',
        'profile': 'My Profile',
        'account': 'Account Settings'
      },
      admin: {
        'users': 'User Management',
        'jobs': 'Job Management',
        'companies': 'Company Management',
        'reports': 'System Reports',
        'settings': 'System Settings'
      }
    };
    
    return titles[userType]?.[tab] || `${userType.charAt(0).toUpperCase() + userType.slice(1)} Dashboard`;
  };

  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo">
            <Link to={getLogoLink()} className='logo-link'>
              <span className="logo-text">WorkHub®</span>
            </Link>
          </div>
        </div>
        
        <div className="header-center">
          <h1 className="dashboard-title">
            {getPageTitle(currentTab)}
          </h1>
        </div>
        
        <div className="header-right">
          {/* Show create job button only for recruiters */}
          {userType === 'recruiter' && onCreateJob && (
            <button 
              className="create-job-btn"
              onClick={onCreateJob}
              title="Create new job posting"
            >
              + Create Job
            </button>
          )}
          
          <AccountDropdown 
            onNavigate={handleAccountNavigation} 
            userType={userType}
          />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;