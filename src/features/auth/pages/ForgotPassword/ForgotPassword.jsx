import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthFormLayout from '../../components/AuthFormLayout/AuthFormLayout';
import FormField from '../../components/FormField/FormField';
import { useAuthSubmit } from '../../hooks/useAuthSubmit';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const {
    isLoading,
    message: successMessage,
    error: errorMessage,
    submitForgotPassword
  } = useAuthSubmit('forgotPassword');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      // Could use form validation hook here too
      return;
    }

    try {
      await submitForgotPassword(email);
    } catch (error) {
      // Error handled in hook
    }
  };

  const formFields = (
    <FormField
      type="email"
      name="email"
      label="Email address"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Enter your email"
      disabled={isLoading}
      required
    />
  );

  const footerContent = (
    <p className="auth-link-text">
      Remember your password? <Link to="/login" className="auth-link">SIGN IN</Link>
    </p>
  );

  return (
    <AuthFormLayout
      title="Reset Password"
      subtitle="Enter your email address and we'll send you a link to reset your password."
      onSubmit={handleSubmit}
      submitButtonText="Send Reset Link"
      isLoading={isLoading}
      loadingText="Sending..."
      successMessage={successMessage}
      errorMessage={errorMessage}
      footer={footerContent}
    >
      {formFields}
    </AuthFormLayout>
  );
};

export default ForgotPassword;