import React from 'react';
import './DashboardHeader.css';

const DashboardHeader = () => {
  return (
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
  );
};

export default DashboardHeader;