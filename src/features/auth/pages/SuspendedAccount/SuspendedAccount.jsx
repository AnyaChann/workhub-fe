import React from 'react';
import { useAuth } from '../../../../core/contexts/AuthContext';
import AuthLayout from '../../components/AuthLayout/AuthLayout';

const SuspendedAccount = () => {
  const { user, logout } = useAuth();

  return (
    <AuthLayout 
      title="Account Suspended"
      subtitle="Your account has been temporarily suspended"
    >
      <div className="account-status-content">
        <div className="status-icon">⚠️</div>
        
        <div className="status-message">
          <h3>Account Suspended</h3>
          <p>
            Your account has been temporarily suspended due to a violation of our terms of service.
          </p>
          <p>
            If you believe this is an error, please contact our support team.
          </p>
        </div>

        <div className="status-actions">
          <button 
            onClick={() => window.open('mailto:support@workhub.com', '_blank')}
            className="btn btn-primary"
          >
            Contact Support
          </button>
          
          <button 
            onClick={() => logout({ redirectTo: '/login' })}
            className="btn btn-secondary"
          >
            Sign Out
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SuspendedAccount;