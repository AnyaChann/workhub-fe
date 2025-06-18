import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../core/contexts/AuthContext';
import './Forbidden.css';

const Forbidden = () => {
  const navigate = useNavigate();
  const { user, userRole, logout } = useAuth();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout({ redirectTo: '/login' });
  };

  const getDashboardLink = () => {
    switch (userRole) {
      case 'admin':
        return '/admin/dashboard';
      case 'recruiter':
        return '/recruiter/dashboard';
      case 'candidate':
        return '/candidate/dashboard';
      default:
        return '/';
    }
  };

  const getRoleDisplayName = () => {
    switch (userRole) {
      case 'admin':
        return 'Administrator';
      case 'recruiter':
        return 'Recruiter';
      case 'candidate':
        return 'Candidate';
      default:
        return 'User';
    }
  };

  return (
    <div className="forbidden-page">
      <div className="forbidden-container">
        <div className="forbidden-header">
          <Link to="/" className="logo">WorkHub®</Link>
        </div>
        
        <div className="forbidden-content">
          <div className="error-code">403</div>
          <h1 className="error-title">Access Forbidden</h1>
          <p className="error-description">
            You don't have sufficient permissions to access this resource. 
            This page is restricted to specific user roles or requires additional authorization.
          </p>
          
          {user && (
            <div className="user-info">
              <p className="current-user">
                Signed in as: <strong>{user.fullname}</strong> ({getRoleDisplayName()})
              </p>
              <p className="permission-note">
                If you believe you should have access to this page, please contact your administrator.
              </p>
            </div>
          )}
          
          <div className="error-actions">
            <Link to={getDashboardLink()} className="btn-primary">
              Go to Dashboard
            </Link>
            <button onClick={handleGoBack} className="btn-secondary">
              Go Back
            </button>
            <button onClick={handleLogout} className="btn-danger">
              Sign Out
            </button>
          </div>
          
          <div className="help-section">
            <p className="help-text">
              Need different access permissions?
            </p>
            <div className="help-actions">
              <a href="mailto:admin@workhub.com?subject=Access Request" className="help-link">
                Request Access
              </a>
              <span className="divider">|</span>
              <a href="mailto:support@workhub.com" className="help-link">
                Contact Support
              </a>
            </div>
          </div>
        </div>
        
        <div className="forbidden-illustration">
          <div className="shield-icon">🛡️</div>
          <div className="forbidden-text">Restricted Area</div>
        </div>
      </div>

      <div className="support-button">
        <button className="support-btn" onClick={() => window.open('mailto:admin@workhub.com?subject=Access Request')}>
          <span className="support-icon">🔑</span>
          Request Access
        </button>
      </div>
    </div>
  );
};

export default Forbidden;