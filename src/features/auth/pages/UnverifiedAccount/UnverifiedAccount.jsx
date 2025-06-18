import React from 'react';
import { useAuth } from '../../../../core/contexts/AuthContext';
import AuthLayout from '../../components/AuthLayout/AuthLayout';

const UnverifiedAccount = () => {
  const { user, logout } = useAuth();

  const handleResendVerification = () => {
    // TODO: Implement resend verification email
    console.log('Resending verification email...');
  };

  return (
    <AuthLayout 
      title="Account Verification Required"
      subtitle="Please verify your email address to continue"
    >
      <div className="account-status-content">
        <div className="status-icon">⏳</div>
        
        <div className="status-message">
          <h3>Check Your Email</h3>
          <p>
            We've sent a verification link to <strong>{user?.email}</strong>. 
            Please check your email and click the link to activate your account.
          </p>
        </div>

        <div className="status-actions">
          <button 
            onClick={handleResendVerification}
            className="btn btn-primary"
          >
            Resend Verification Email
          </button>
          
          <button 
            onClick={() => logout({ redirectTo: '/login' })}
            className="btn btn-secondary"
          >
            Sign Out
          </button>
        </div>

        <div className="help-text">
          <small>
            Didn't receive the email? Check your spam folder or contact support.
          </small>
        </div>
      </div>
    </AuthLayout>
  );
};

export default UnverifiedAccount;