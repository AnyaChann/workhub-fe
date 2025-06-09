import React from 'react';
import './DashboardSidebar.css';

const DashboardSidebar = ({ selectedTab, onTabChange }) => {
  const handleCreateJob = () => {
    console.log('Create new job');
  };

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-section">
        <div className="section-header">
          <span className="section-icon">📁</span>
          <span className="section-title">Jobs</span>
          <button className="create-btn" onClick={handleCreateJob}>
            + Create
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${selectedTab === 'active-jobs' ? 'active' : ''}`}
            onClick={() => onTabChange('active-jobs')}
          >
            Active jobs
          </button>
          <button 
            className={`nav-item ${selectedTab === 'drafts' ? 'active' : ''}`}
            onClick={() => onTabChange('drafts')}
          >
            Drafts
          </button>
          <button 
            className={`nav-item ${selectedTab === 'expired' ? 'active' : ''}`}
            onClick={() => onTabChange('expired')}
          >
            Expired
          </button>
        </nav>
      </div>
      
      <div className="sidebar-section">
        <button 
          className={`sidebar-brand-section ${selectedTab === 'brands' ? 'active' : ''}`}
          onClick={() => onTabChange('brands')}
        >
          <span className="section-icon">🏢</span>
          <span className="section-title">Brands</span>
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;