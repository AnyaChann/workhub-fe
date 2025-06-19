import React, { useEffect, useState } from 'react';
import './RegistrationSuccess.css';

const RegistrationSuccess = ({ 
  type = 'recruiter', 
  autoLogin = false, 
  redirectPath = '/dashboard',
  onRedirect,
  email 
}) => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (autoLogin && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (autoLogin && countdown === 0 && onRedirect) {
      onRedirect();
    }
  }, [countdown, autoLogin, onRedirect]);

  if (autoLogin) {
    return (
      <div className="registration-success auto-login">
        <div className="success-icon">✅</div>
        <h2>Welcome to WorkHub!</h2>
        <p className="success-message">
          Your {type} account has been created and verified successfully!
        </p>
        <div className="auto-login-info">
          <p>🔄 Logging you in automatically...</p>
          <div className="countdown">Redirecting in {countdown} seconds</div>
          <div className="loading-spinner"></div>
        </div>
        {email && (
          <p className="email-info">
            Signed in as: <strong>{email}</strong>
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="registration-success verification-required">
      <div className="success-icon">📧</div>
      <h2>Check Your Email</h2>
      <p className="success-message">
        Your {type} account has been created successfully!
      </p>
      <div className="verification-info">
        <p>Please check your email inbox for a verification link.</p>
        {email && (
          <p className="email-info">
            Verification email sent to: <strong>{email}</strong>
          </p>
        )}
        <p className="next-steps">
          Click the verification link in your email, then return here to sign in.
        </p>
      </div>
    </div>
  );
};

export default RegistrationSuccess;