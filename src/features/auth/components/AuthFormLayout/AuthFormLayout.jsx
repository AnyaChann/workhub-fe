import React from 'react';
import AuthLayout from '../AuthLayout/AuthLayout';
import MessageBanner from '../MessageBanner/MessageBanner';
import { ButtonLoadingSpinner } from '../../../../shared/components/LoadingSpinner/LoadingSpinner';
import './AuthFormLayout.css';

const AuthFormLayout = ({
  title,
  subtitle,
  children,
  onSubmit,
  submitButtonText = 'Submit',
  isLoading = false,
  loadingText = 'Processing...',
  successMessage,
  errorMessage,
  footer,
  beforeForm,
  afterForm,
  className = ''
}) => {
  return (
    <AuthLayout title={title} subtitle={subtitle} className={className}>
      {/* Before form content (e.g., QuickCredentials) */}
      {beforeForm}

      {/* Success/Error Messages */}
      <MessageBanner type="success" message={successMessage} />
      <MessageBanner type="error" message={errorMessage} />

      {/* Main Form */}
      <form onSubmit={onSubmit} className="auth-form">
        {children}

        <button
          type="submit"
          className="auth-submit-btn"
          disabled={isLoading}
        >
          {isLoading ? (
            <ButtonLoadingSpinner message={loadingText} />
          ) : (
            submitButtonText
          )}
        </button>
      </form>

      {/* After form content */}
      {afterForm}

      {/* Footer content */}
      {footer && <div className="auth-footer">{footer}</div>}
    </AuthLayout>
  );
};

export default AuthFormLayout;