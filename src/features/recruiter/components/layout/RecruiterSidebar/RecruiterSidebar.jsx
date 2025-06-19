import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../../core/contexts/AuthContext';
import './RecruiterSidebar.css';

const DashboardSidebar = ({ selectedTab, onTabChange, onCreateJob, userType = 'recruiter' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole } = useAuth();

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

  // Get active state based on current URL and user type
  const isActiveTab = (tabName) => {
    const path = location.pathname;
    
    switch (userType) {
      case 'recruiter':
        switch (tabName) {
          case 'active-jobs':
            return path.includes('/jobs/active');
          case 'drafts':
            return path.includes('/jobs/drafts');
          case 'expired':
            return path.includes('/jobs/expired');
          case 'archived':
            return path.includes('/jobs/archived');
          case 'candidates':
            return path.includes('/candidates');
          case 'company':
            return path.includes('/company');
          case 'reports':
            return path.includes('/reports');
          case 'account':
            return path.includes('/account');
          default:
            return false;
        }
      case 'candidate':
        switch (tabName) {
          case 'jobs':
            return path.includes('/jobs/');
          case 'applications':
            return path.includes('/applications/');
          case 'profile':
            return path.includes('/profile/');
          case 'account':
            return path.includes('/account/');
          default:
            return false;
        }
      case 'admin':
        switch (tabName) {
          case 'users':
            return path.includes('/users/');
          case 'jobs':
            return path.includes('/jobs/');
          case 'companies':
            return path.includes('/companies/');
          case 'reports':
            return path.includes('/reports/');
          case 'settings':
            return path.includes('/settings/');
          default:
            return false;
        }
      default:
        return false;
    }
  };

  // Render sidebar based on user type
  const renderSidebarContent = () => {
    switch (userType) {
      case 'recruiter':
        return (
          <>
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
                <button 
                  className={`nav-item ${isActiveTab('archived') ? 'active' : ''}`}
                  onClick={() => handleTabChange('archived')}
                  title="View archived job postings"
                >
                  <span className="nav-icon">📦</span>
                  <span className="nav-text">Archived</span>
                </button>
              </nav>
            </div>

            <div className="sidebar-section">
              <div className="section-header">
                <span className="section-icon">👥</span>
                <span className="section-title">Talent</span>
              </div>
              
              <nav className="sidebar-nav">
                <button 
                  className={`nav-item ${isActiveTab('candidates') ? 'active' : ''}`}
                  onClick={() => handleTabChange('candidates')}
                  title="Manage candidates"
                >
                  <span className="nav-icon">🎯</span>
                  <span className="nav-text">Candidates</span>
                </button>
              </nav>
            </div>

            <div className="sidebar-section">
              <div className="section-header">
                <span className="section-icon">🏢</span>
                <span className="section-title">Company</span>
              </div>
              
              <nav className="sidebar-nav">
                <button 
                  className={`nav-item ${isActiveTab('company') ? 'active' : ''}`}
                  onClick={() => handleTabChange('company')}
                  title="Manage company profile"
                >
                  <span className="nav-icon">🎨</span>
                  <span className="nav-text">Profile</span>
                </button>
                <button 
                  className={`nav-item ${isActiveTab('reports') ? 'active' : ''}`}
                  onClick={() => handleTabChange('reports')}
                  title="View reports and analytics"
                >
                  <span className="nav-icon">📊</span>
                  <span className="nav-text">Reports</span>
                </button>
              </nav>
            </div>
          </>
        );

      case 'candidate':
        return (
          <div className="sidebar-section">
            <div className="section-header">
              <span className="section-icon">🎯</span>
              <span className="section-title">Job Search</span>
            </div>
            
            <nav className="sidebar-nav">
              <button 
                className={`nav-item ${isActiveTab('jobs') ? 'active' : ''}`}
                onClick={() => handleTabChange('jobs')}
              >
                <span className="nav-icon">🔍</span>
                <span className="nav-text">Find Jobs</span>
              </button>
              <button 
                className={`nav-item ${isActiveTab('applications') ? 'active' : ''}`}
                onClick={() => handleTabChange('applications')}
              >
                <span className="nav-icon">📋</span>
                <span className="nav-text">My Applications</span>
              </button>
              <button 
                className={`nav-item ${isActiveTab('profile') ? 'active' : ''}`}
                onClick={() => handleTabChange('profile')}
              >
                <span className="nav-icon">👤</span>
                <span className="nav-text">My Profile</span>
              </button>
            </nav>
          </div>
        );

      case 'admin':
        return (
          <>
            <div className="sidebar-section">
              <div className="section-header">
                <span className="section-icon">👥</span>
                <span className="section-title">User Management</span>
              </div>
              
              <nav className="sidebar-nav">
                <button 
                  className={`nav-item ${isActiveTab('users') ? 'active' : ''}`}
                  onClick={() => handleTabChange('users')}
                >
                  <span className="nav-icon">👤</span>
                  <span className="nav-text">Users</span>
                </button>
                <button 
                  className={`nav-item ${isActiveTab('companies') ? 'active' : ''}`}
                  onClick={() => handleTabChange('companies')}
                >
                  <span className="nav-icon">🏢</span>
                  <span className="nav-text">Companies</span>
                </button>
              </nav>
            </div>

            <div className="sidebar-section">
              <div className="section-header">
                <span className="section-icon">💼</span>
                <span className="section-title">Content Management</span>
              </div>
              
              <nav className="sidebar-nav">
                <button 
                  className={`nav-item ${isActiveTab('jobs') ? 'active' : ''}`}
                  onClick={() => handleTabChange('jobs')}
                >
                  <span className="nav-icon">📋</span>
                  <span className="nav-text">Jobs</span>
                </button>
                <button 
                  className={`nav-item ${isActiveTab('reports') ? 'active' : ''}`}
                  onClick={() => handleTabChange('reports')}
                >
                  <span className="nav-icon">📊</span>
                  <span className="nav-text">Reports</span>
                </button>
              </nav>
            </div>

            <div className="sidebar-section">
              <div className="section-header">
                <span className="section-icon">⚙️</span>
                <span className="section-title">System</span>
              </div>
              
              <nav className="sidebar-nav">
                <button 
                  className={`nav-item ${isActiveTab('settings') ? 'active' : ''}`}
                  onClick={() => handleTabChange('settings')}
                >
                  <span className="nav-icon">🔧</span>
                  <span className="nav-text">Settings</span>
                </button>
              </nav>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <aside className="dashboard-sidebar">
      {renderSidebarContent()}
    </aside>
  );
};

export default DashboardSidebar;