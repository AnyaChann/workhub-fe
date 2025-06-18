import React from 'react';
import { Link } from 'react-router-dom';
import './AuthLayout.css';
import AuthDebug from '../../../../shared/components/AuthDebug/AuthDebug';

const AuthLayout = ({ 
  children, 
  title, 
  subtitle,
  showSupport = true,
  className = ''
}) => {
  return (
    <div className={`auth-page ${className}`}>
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="logo">WorkHub®</Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <AuthDebug />
        )}
        
        <div className="auth-form-container">
          <h1 className="auth-title">{title}</h1>
          {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          
          {children}
        </div>
      </div>

      {showSupport && (
        <div className="support-button">
          <button className="support-btn">
            <span className="support-icon">❓</span>
            Support
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthLayout;