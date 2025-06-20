import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ROUTES from '../../../../../core/routing/routeConstants';
import './RecruiterHeader.css';
import AccountDropdown from '../RecruiterAccountDropdown/RecruiterAccountDropdown';

const RecruiterHeader = ({ onNavigate, onCreateJob }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = () => {
    const path = location.pathname;

    if (path.startsWith('/recruiter/dashboard/jobs/active')) return 'Active Jobs';
    if (path.startsWith('/recruiter/dashboard/jobs/drafts')) return 'Draft Jobs';
    if (path.startsWith('/recruiter/dashboard/jobs/expired')) return 'Expired Jobs';
    if (path.startsWith('/recruiter/dashboard/jobs/archived')) return 'Archived Jobs';
    if (path.startsWith('/recruiter/dashboard/candidates')) return 'Candidates';
    if (path.startsWith('/recruiter/dashboard/company/profile')) return 'Company Profile';
    if (path.startsWith('/recruiter/dashboard/company/reports')) return 'Reports & Analytics';
    if (path.startsWith('/recruiter/dashboard/account/profile')) return 'User Profile';
    if (path.startsWith('/recruiter/dashboard/account/settings')) return 'Account Settings';
    if (path.startsWith('/recruiter/dashboard/account/team')) return 'Team Management';
    if (path.startsWith('/recruiter/dashboard/account/billing')) return 'Billing & Packages';
    return 'Recruiter Dashboard';
  };

  const handleCreateJob = () => {
    if (onCreateJob) {
      onCreateJob();
    } else {
      // ✅ Added direct navigation if onCreateJob isn't provided
      navigate(ROUTES.RECRUITER.CREATE_JOB);
    }
  };

  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo">
            <Link to={ROUTES.RECRUITER.DASHBOARD} className="logo-link">
              <span className="logo-text">WorkHub®</span>
            </Link>
          </div>
        </div>
        
        <div className="header-center">
          <h1 className="dashboard-title">{getPageTitle()}</h1>
        </div>
        
        <div className="header-right">
          {/* ✅ Added Create Job button with direct navigation */}
          <button 
            className="create-job-btn"
            onClick={handleCreateJob}
            title="Create new job posting"
          >
            + Create Job
          </button>
          <AccountDropdown />
        </div>
      </div>
    </header>
  );
};

export default RecruiterHeader;