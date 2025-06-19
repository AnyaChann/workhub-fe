import React from 'react';
import './QuickCredentials.css';

const QuickCredentials = ({ onFillCredentials }) => {
  const testCredentials = [
    {
      label: 'Test Recruiter',
      email: 'bachct504@gmail.com',
      password: '123456789',
      role: 'RECRUITER',
      status: 'verified'
    },
    {
      label: 'Test Candidate',
      email: 'candidate@test.com',
      password: '123456789',
      role: 'CANDIDATE',
      status: 'verified'
    },
    {
      label: 'Test Admin',
      email: 'admin@test.com',
      password: '123456789',
      role: 'ADMIN',
      status: 'verified'
    }
  ];

  const handleQuickFill = (email, password) => {
    console.log('🎯 Quick fill credentials:', { email, password: '[HIDDEN]' });
    onFillCredentials(email, password);
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="quick-credentials">
      <div className="quick-credentials-header">
        <span className="quick-credentials-title">🚀 Quick Test Login</span>
      </div>
      
      <div className="quick-credentials-grid">
        {testCredentials.map((cred, index) => (
          <button
            key={index}
            className="quick-credential-btn"
            onClick={() => handleQuickFill(cred.email, cred.password)}
            title={`Fill ${cred.role.toLowerCase()} credentials`}
          >
            <div className="credential-role">{cred.label}</div>
            <div className="credential-email">{cred.email}</div>
            <div className="credential-status">Status: {cred.status}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickCredentials;