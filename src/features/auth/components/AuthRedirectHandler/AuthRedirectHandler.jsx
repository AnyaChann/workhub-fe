import React from 'react';
import { useAuth } from '../../../../core/contexts/AuthContext';
import { ButtonLoadingSpinner } from '../../../../shared/components/LoadingSpinner/LoadingSpinner';
import './AuthRedirectHandler.css';

const AuthRedirectHandler = ({
  type = 'already-logged-in', // 'already-logged-in' | 'login-success'
  children,
  className = ''
}) => {
  const { userRole, getDashboardUrl, logout } = useAuth();

  const getContent = () => {
    switch (type) {
      case 'already-logged-in':
        return {
          title: '✅ Already Logged In',
          message: `You are authenticated as ${userRole?.toUpperCase()}`,
          subMessage: 'Redirecting to your dashboard...',
          buttonText: 'Go to Dashboard',
          showButton: true
        };
      case 'login-success':
        return {
          title: '🎉 Login Successful!',
          message: 'Welcome back!',
          subMessage: 'Redirecting to your dashboard...',
          buttonText: null,
          showButton: false
        };
      default:
        return {
          title: 'Redirecting...',
          message: 'Please wait',
          subMessage: '',
          buttonText: null,
          showButton: false
        };
    }
  };

  const content = getContent();

  const handleManualRedirect = () => {
    if (!userRole) {
      alert('User role is missing, cannot redirect!');
      return;
    }
    const url = getDashboardUrl();
    console.log('🎯 Manual redirect to:', url);
    window.location.href = url;
  };

  // Thêm nút logout
  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`auth-redirect-overlay ${className}`}>
      <div className="auth-redirect-content">
        <h2 className="redirect-title">{content.title}</h2>
        <p className="redirect-message">{content.message}</p>
        {content.subMessage && (
          <p className="redirect-sub-message">{content.subMessage}</p>
        )}

        {type === 'login-success' && (
          <div className="redirect-loading">
            <ButtonLoadingSpinner message="Redirecting..." />
          </div>
        )}

        {content.showButton && userRole && (
          <button
            onClick={handleManualRedirect}
            className="redirect-button"
          >
            {content.buttonText}
          </button>
        )}

        {/* Nút logout luôn hiển thị */}
        <button
          onClick={handleLogout}
          className="redirect-button"
          style={{ marginTop: 16, background: '#e74c3c', color: '#fff' }}
        >
          Logout
        </button>

        {children}
      </div>
    </div>
  );
};

export default AuthRedirectHandler;