import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../core/contexts/AuthContext';
import './Unauthorized.css';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, userRole } = useAuth();

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
    if (!isAuthenticated) return '/login';
    
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

  return (
    <div className="unauthorized-page">
      <div className="unauthorized-container">
        <div className="unauthorized-header">
          <Link to="/" className="logo">WorkHub®</Link>
        </div>
        
        <div className="unauthorized-content">
          <div className="error-code">401</div>
          <h1 className="error-title">Unauthorized Access</h1>
          <p className="error-description">
            {isAuthenticated 
              ? "You don't have permission to access this page. Please contact your administrator if you believe this is an error."
              : "You need to sign in to access this page. Please log in with your credentials."
            }
          </p>
          
          <div className="error-actions">
            {isAuthenticated ? (
              <>
                <Link to={getDashboardLink()} className="btn-primary">
                  Go to Dashboard
                </Link>
                <button onClick={handleLogout} className="btn-secondary">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-primary">
                  Sign In
                </Link>
                <button onClick={handleGoBack} className="btn-secondary">
                  Go Back
                </button>
              </>
            )}
          </div>
          
          <div className="help-section">
            <p className="help-text">
              Need help accessing your account?
            </p>
            <div className="help-actions">
              <Link to="/forgot-password" className="help-link">
                Reset Password
              </Link>
              <span className="divider">|</span>
              <a href="mailto:support@workhub.com" className="help-link">
                Contact Support
              </a>
            </div>
          </div>
        </div>
        
        <div className="unauthorized-illustration">
          <div className="lock-icon">🔒</div>
          <div className="access-denied-text">Access Denied</div>
        </div>
      </div>

      <div className="support-button">
        <button className="support-btn" onClick={() => window.open('mailto:support@workhub.com')}>
          <span className="support-icon">🔐</span>
          Get Access
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;