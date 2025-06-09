import React from 'react';
import './DashboardHeader.css';
import HelpDropdown from '../Dropdowns/HelpDropdown/HelpDropdown';
import AccountDropdown from '../Dropdowns/AccountDropdown/AccountDropdown';

const DashboardHeader = ({ onNavigate }) => {
  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="logo">
          WorkHub®
        </div>
        
        <div className="header-actions">
          <HelpDropdown />
          <AccountDropdown onNavigate={onNavigate} />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;