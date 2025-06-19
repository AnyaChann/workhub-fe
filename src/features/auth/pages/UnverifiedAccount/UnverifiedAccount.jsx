import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './UnverifiedAccount.css';

const UnverifiedAccount = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const email = location.state?.email || '';
  const message = location.state?.message || 'Please verify your email address';
  const accountType = location.state?.type || 'account';

  useEffect(() => {
    // If no email provided, redirect to login
    if (!email) {
      navigate('/login', { replace: true });
    }
  }, [email, navigate]);

  const handleResendVerification = async () => {
    setIsResending(true);
    setResendMessage('');

    try {
      // Call API to resend verification email
      // const result = await authService.resendVerification(email);
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setResendMessage('Verification email sent! Please check your inbox.');
    } catch (error) {
      setResendMessage('Failed to send verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleGoToLogin = () => {
    navigate('/login', { 
      state: { email } 
    });
  };

  return (
    <div className="unverified-account-page">
      <div className="unverified-container">
        <div className="unverified-icon">
          📧
        </div>
        
        <h1 className="unverified-title">
          Verify Your {accountType === 'recruiter' ? 'Recruiter' : 'Account'}
        </h1>
        
        <div className="unverified-content">
          <p className="unverified-message">
            {message}
          </p>
          
          {email && (
            <div className="email-info">
              <p>We sent a verification link to:</p>
              <strong className="email-address">{email}</strong>
            </div>
          )}
          
          <div className="verification-steps">
            <h3>Next steps:</h3>
            <ol>
              <li>Check your email inbox (and spam folder)</li>
              <li>Click the verification link in the email</li>
              <li>Return here to sign in to your {accountType} account</li>
            </ol>
          </div>
          
          <div className="verification-actions">
            <button
              onClick={handleResendVerification}
              disabled={isResending}
              className="resend-btn"
            >
              {isResending ? 'Sending...' : 'Resend verification email'}
            </button>
            
            {resendMessage && (
              <div className={`resend-message ${resendMessage.includes('sent') ? 'success' : 'error'}`}>
                {resendMessage}
              </div>
            )}
          </div>
        </div>
        
        <div className="unverified-footer">
          <button 
            onClick={handleGoToLogin}
            className="login-btn"
          >
            Back to Sign In
          </button>
          
          <p className="help-text">
            Need help? <Link to="/contact" className="help-link">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnverifiedAccount;