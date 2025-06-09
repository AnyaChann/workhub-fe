import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState('active-jobs');
  const [showOnlyMyJobs, setShowOnlyMyJobs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateJob = () => {
    // Navigate to create job page
    console.log('Create new job');
  };

  const handlePostNewJob = () => {
    // Navigate to post job page
    console.log('Post new job');
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo">
            WorkHub®
          </div>
          
          <div className="header-actions">
            <div className="help-dropdown">
              <button className="help-btn">
                <span className="help-icon">🎧</span>
                Help
                <span className="dropdown-arrow">▼</span>
              </button>
            </div>
            
            <div className="user-dropdown">
              <button className="user-btn">
                <div className="user-avatar">
                  <span>👤</span>
                </div>
                <span className="dropdown-arrow">▼</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Sidebar */}
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
                onClick={() => setSelectedTab('active-jobs')}
              >
                Active jobs
              </button>
              <button 
                className={`nav-item ${selectedTab === 'drafts' ? 'active' : ''}`}
                onClick={() => setSelectedTab('drafts')}
              >
                Drafts
              </button>
              <button 
                className={`nav-item ${selectedTab === 'expired' ? 'active' : ''}`}
                onClick={() => setSelectedTab('expired')}
              >
                Expired
              </button>
            </nav>
          </div>
          
          <div className="sidebar-section">
            <div className="section-header">
              <span className="section-icon">🏢</span>
              <span className="section-title">Brands</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          <div className="main-header">
            <h1 className="page-title">Active jobs</h1>
            
            <div className="page-controls">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={showOnlyMyJobs}
                  onChange={(e) => setShowOnlyMyJobs(e.target.checked)}
                />
                <span className="toggle-slider"></span>
                <span className="toggle-label">Only jobs posted by me</span>
              </label>
            </div>
          </div>
          
          <div className="search-section">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input 
                type="text"
                placeholder="Search active jobs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="jobs-content">
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h2 className="empty-title">You have no active jobs</h2>
              <p className="empty-description">
                Start by posting your first job to find great candidates.
              </p>
              <button className="post-job-btn" onClick={handlePostNewJob}>
                + Post a new job
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Support Button */}
      <div className="support-floating">
        <button className="support-btn">
          <span className="support-icon">❓</span>
          Support
        </button>
      </div>
    </div>
  );
};

export default Dashboard;