import React, { useState } from 'react';
import '../ActiveJobs/ActiveJobs.css';

const Drafts = () => {
  const [showOnlyMyJobs, setShowOnlyMyJobs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handlePostNewJob = () => {
    console.log('Post new job');
  };

  return (
    <main className="dashboard-main">
      <div className="main-header">
        <h1 className="page-title">Drafts</h1>
        
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
            placeholder="Search draft jobs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      
      <div className="jobs-content">
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h2 className="empty-title">You have no drafts</h2>
          <p className="empty-description">
            Save job drafts to publish later when you're ready.
          </p>
          <button className="post-job-btn" onClick={handlePostNewJob}>
            + Post a new job
          </button>
        </div>
      </div>
    </main>
  );
};

export default Drafts;