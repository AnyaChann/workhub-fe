import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './DashboardSidebar.css';

const DashboardSidebar = ({ selectedTab, onTabChange, onCreateJob }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleCreateJob = () => {
    console.log('Navigate to create job');
    if (onCreateJob) {
      onCreateJob();
    }
  };

  const handleTabChange = (tab) => {
    console.log('Tab change requested:', tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  // Get active state based on current URL
  const isActiveTab = (tabName) => {
    const path = location.pathname;
    
    switch (tabName) {
      case 'active-jobs':
        return path.includes('/jobs/active');
      case 'drafts':
        return path.includes('/jobs/drafts');
      case 'expired':
        return path.includes('/jobs/expired');
      case 'brands':
        return path.includes('/brands');
      default:
        return false;
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
            className={`nav-item ${isActiveTab('active-jobs') ? 'active' : ''}`}
            onClick={() => handleTabChange('active-jobs')}
            title="View active job postings"
          >
            <span className="nav-icon">✅</span>
            <span className="nav-text">Active jobs</span>
          </button>
          <button 
            className={`nav-item ${isActiveTab('drafts') ? 'active' : ''}`}
            onClick={() => handleTabChange('drafts')}
            title="View draft job postings"
          >
            <span className="nav-icon">📝</span>
            <span className="nav-text">Drafts</span>
          </button>
          <button 
            className={`nav-item ${isActiveTab('expired') ? 'active' : ''}`}
            onClick={() => handleTabChange('expired')}
            title="View expired job postings"
          >
            <span className="nav-icon">⏰</span>
            <span className="nav-text">Expired</span>
          </button>
        </nav>
      </div>

      {/* Footer section */}
      {/* <div className="sidebar-section">
        <div className="section-divider"></div>
        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-icon">👤</span>
            <span className="user-name">Employer Dashboard</span>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <div className="current-path">
              <small>{location.pathname}</small>
            </div>
          )}
        </div>
      </div> */}
    </aside>
  );
};

export default DashboardSidebar;