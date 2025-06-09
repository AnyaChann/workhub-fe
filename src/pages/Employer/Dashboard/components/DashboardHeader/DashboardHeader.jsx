import React from 'react';
import { Link } from 'react-router-dom';
import './DashboardHeader.css';
import HelpDropdown from '../Dropdowns/HelpDropdown/HelpDropdown';
import AccountDropdown from '../Dropdowns/AccountDropdown/AccountDropdown';

const DashboardHeader = ({ onNavigate }) => {
    return (
        <header className="dashboard-header">
            <div className="header-content">
                <Link to="/dashboard" className="logo-link">
                    <div className="logo">
                        WorkHub®
                    </div>
                </Link>
                <div className="header-actions">
                    <HelpDropdown />
                    <AccountDropdown onNavigate={onNavigate} />
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;