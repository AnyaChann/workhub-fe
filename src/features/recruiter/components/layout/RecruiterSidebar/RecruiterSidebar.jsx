import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ROUTES from '../../../../../core/routing/routeConstants';
import './RecruiterSidebar.css';

const RecruiterSidebar = ({ onTabChange, onCreateJob }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabChange = (route) => {
    console.log('Tab change requested:', route);
    if (onTabChange) {
      onTabChange(route);
    } else {
      navigate(route);
    }
  };

  // ✅ Improved isActiveTab to work with path segments
  const isActiveTab = (route) => {
    // Convert both to lowercase to make comparison case-insensitive
    const currentPath = location.pathname.toLowerCase();
    const routePath = route.toLowerCase();
    return currentPath.startsWith(routePath);
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
    <aside className="dashboard-sidebar">
      <div className="sidebar-section">
        <div className="section-header">
          <span className="section-icon">📁</span>
          <span className="section-title">Jobs</span>
          <button 
            className="create-btn" 
            onClick={handleCreateJob}
            title="Create new job posting"
          >
            + Create
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${isActiveTab(ROUTES.RECRUITER.ACTIVE_JOBS) ? 'active' : ''}`}
            onClick={() => handleTabChange(ROUTES.RECRUITER.ACTIVE_JOBS)}
            title="View active job postings"
          >
            <span className="nav-icon">✅</span>
            <span className="nav-text">Active jobs</span>
          </button>
          <button 
            className={`nav-item ${isActiveTab(ROUTES.RECRUITER.DRAFTS) ? 'active' : ''}`}
            onClick={() => handleTabChange(ROUTES.RECRUITER.DRAFTS)}
            title="View draft job postings"
          >
            <span className="nav-icon">📝</span>
            <span className="nav-text">Drafts</span>
          </button>
          <button 
            className={`nav-item ${isActiveTab(ROUTES.RECRUITER.EXPIRED_JOBS) ? 'active' : ''}`}
            onClick={() => handleTabChange(ROUTES.RECRUITER.EXPIRED_JOBS)}
            title="View expired job postings"
          >
            <span className="nav-icon">⏰</span>
            <span className="nav-text">Expired</span>
          </button>
          {/* <button 
            className={`nav-item ${isActiveTab(ROUTES.RECRUITER.ARCHIVED_JOBS) ? 'active' : ''}`}
            onClick={() => handleTabChange(ROUTES.RECRUITER.ARCHIVED_JOBS)}
            title="View archived job postings"
          >
            <span className="nav-icon">📦</span>
            <span className="nav-text">Archived</span>
          </button> */}
        </nav>
      </div>

      {/* <div className="sidebar-section">
        <div className="section-header">
          <span className="section-icon">👥</span>
          <span className="section-title">Talent</span>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${isActiveTab(ROUTES.RECRUITER.CANDIDATES) ? 'active' : ''}`}
            onClick={() => handleTabChange(ROUTES.RECRUITER.CANDIDATES)}
            title="Manage candidates"
          >
            <span className="nav-icon">🎯</span>
            <span className="nav-text">Candidates</span>
          </button>
        </nav>
      </div> */}

      {/* <div className="sidebar-section">
        <div className="section-header">
          <span className="section-icon">🏢</span>
          <span className="section-title">Account</span>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${isActiveTab(ROUTES.RECRUITER.ACCOUNT.PROFILE) ? 'active' : ''}`}
            onClick={() => handleTabChange(ROUTES.RECRUITER.ACCOUNT.PROFILE)}
            title="Manage your user profile"
          >
            <span className="nav-icon">👤</span>
            <span className="nav-text">Profile</span>
          </button>
          <button 
            className={`nav-item ${isActiveTab(ROUTES.RECRUITER.ACCOUNT.SETTINGS) ? 'active' : ''}`}
            onClick={() => handleTabChange(ROUTES.RECRUITER.ACCOUNT.SETTINGS)}
            title="Manage account settings"
          >
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">Settings</span>
          </button>
          <button 
            className={`nav-item ${isActiveTab(ROUTES.RECRUITER.ACCOUNT.BILLING) ? 'active' : ''}`}
            onClick={() => handleTabChange(ROUTES.RECRUITER.ACCOUNT.BILLING)}
            title="Manage packages and billing"
          >
            <span className="nav-icon">�</span>
            <span className="nav-text">Billing</span>
          </button>
          <button 
            className={`nav-item ${isActiveTab(ROUTES.RECRUITER.ACCOUNT.TEAM) ? 'active' : ''}`}
            onClick={() => handleTabChange(ROUTES.RECRUITER.ACCOUNT.TEAM)}
            title="Manage team members"
          >
            <span className="nav-icon">👥</span>
            <span className="nav-text">Team</span>
          </button>
        </nav>
      </div> */}
    </aside>
  );
};

export default RecruiterSidebar;