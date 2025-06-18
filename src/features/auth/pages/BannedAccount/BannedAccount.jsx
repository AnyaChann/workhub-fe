import React from 'react';
import { useAuth } from '../../../../core/contexts/AuthContext';
import AuthLayout from '../../components/AuthLayout/AuthLayout';

const BannedAccount = () => {
  const { logout } = useAuth();

  return (
    <AuthLayout 
      title="Account Banned"
      subtitle="Your account has been permanently banned"
    >
      <div className="account-status-content">
        <div className="status-icon">🚫</div>
        
        <div className="status-message">
          <h3>Account Permanently Banned</h3>
          <p>
            Your account has been permanently banned due to severe violations of our terms of service.
          </p>
          <p>
            This decision is final and cannot be appealed.
          </p>
        </div>

        <div className="status-actions">
          <button 
            onClick={() => logout({ redirectTo: '/' })}
            className="btn btn-primary"
          >
            Return to Home
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default BannedAccount;