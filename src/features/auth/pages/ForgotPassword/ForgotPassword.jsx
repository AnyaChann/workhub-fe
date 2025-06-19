import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthFormLayout from '../../components/AuthFormLayout/AuthFormLayout';
import FormField from '../../components/FormField/FormField';
import { useAuthForm, validationRules } from '../../hooks/useAuthForm';
import { useAuthSubmit } from '../../hooks/useAuthSubmit';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [sentToEmail, setSentToEmail] = useState('');

  const {
    formData,
    errors,
    handleInputChange,
    handleBlur,
    validateAll
  } = useAuthForm(
    { email: '' },
    { email: validationRules.email }
  );

  const {
    isLoading,
    message: successMessage,
    error: errorMessage,
    submitForgotPassword
  } = useAuthSubmit('forgotPassword');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAll()) {
      return;
    }

    console.log('📧 ForgotPassword: Submitting for email:', formData.email);

    try {
      await submitForgotPassword(formData.email, {
        onSuccess: (result, message) => {
          console.log('✅ ForgotPassword: Success callback');
          setEmailSent(true);
          setSentToEmail(formData.email);
        }
      });
    } catch (error) {
      console.error('❌ ForgotPassword: Submit error:', error);
      // Error handled in hook
    }
  };

  const handleSendAgain = async () => {
    try {
      await submitForgotPassword(sentToEmail, {
        onSuccess: () => {
          console.log('✅ ForgotPassword: Resend successful');
        }
      });
    } catch (error) {
      console.error('❌ ForgotPassword: Resend error:', error);
    }
  };

  const handleTryDifferentEmail = () => {
    setEmailSent(false);
    setSentToEmail('');
  };

  // ✅ Show success state if email was sent
  if (emailSent) {
    return (
      <div className="forgot-password-success">
        <div className="success-container">
          <div className="success-icon">📧</div>
          
          <h1 className="success-title">Check Your Email</h1>
          
          <div className="success-content">
            <p className="success-message">
              We've sent a password reset link to:
            </p>
            
            <div className="email-display">
              <strong>{sentToEmail}</strong>
            </div>
            
            <div className="instructions">
              <h3>Next steps:</h3>
              <ol>
                <li>Check your email inbox (and spam folder)</li>
                <li>Click the password reset link in the email</li>
                <li>Follow the instructions to create a new password</li>
                <li>Return here to sign in with your new password</li>
              </ol>
            </div>
            
            <div className="success-actions">
              <button
                onClick={handleSendAgain}
                disabled={isLoading}
                className="resend-btn"
              >
                {isLoading ? 'Sending...' : 'Send email again'}
              </button>
              
              <button
                onClick={handleTryDifferentEmail}
                className="try-different-btn"
              >
                Try different email
              </button>
            </div>
            
            {successMessage && (
              <div className="resend-message success">
                {successMessage}
              </div>
            )}
            
            {errorMessage && (
              <div className="resend-message error">
                {errorMessage}
              </div>
            )}
          </div>
          
          <div className="back-to-login">
            <Link to="/login" className="back-link">
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Show form state
  const formFields = (
    <FormField
      type="email"
      name="email"
      label="Email address"
      value={formData.email}
      onChange={handleInputChange}
      onBlur={handleBlur}
      placeholder="Enter your registered email"
      error={errors.email}
      disabled={isLoading}
      required
      helpText="Enter the email address associated with your account"
    />
  );

  const afterFormContent = (
    <div className="forgot-password-info">
      <div className="info-box">
        <h4>📧 What happens next?</h4>
        <ul>
          <li>We'll send a secure reset link to your email</li>
          <li>The link will expire in 24 hours for security</li>
          <li>You can request a new link if needed</li>
        </ul>
      </div>
    </div>
  );

  const footerContent = (
    <>
      <p className="auth-link-text">
        Remember your password? <Link to="/login" className="auth-link">SIGN IN</Link>
      </p>
      
      <p className="auth-link-text">
        Don't have an account? <Link to="/register" className="auth-link">REGISTER</Link>
      </p>
    </>
  );

  return (
    <AuthFormLayout
      title="Reset Your Password"
      subtitle="Enter your email address and we'll send you a link to reset your password."
      onSubmit={handleSubmit}
      submitButtonText="Send Reset Link"
      isLoading={isLoading}
      loadingText="Sending reset email..."
      successMessage={successMessage}
      errorMessage={errorMessage}
      afterForm={afterFormContent}
      footer={footerContent}
    >
      {formFields}
    </AuthFormLayout>
  );
};

export default ForgotPassword;