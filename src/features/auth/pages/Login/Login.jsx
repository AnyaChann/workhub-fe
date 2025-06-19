import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../core/contexts/AuthContext';
import AuthFormLayout from '../../components/AuthFormLayout/AuthFormLayout';
import AuthRedirectHandler from '../../components/AuthRedirectHandler/AuthRedirectHandler';
import FormField from '../../components/FormField/FormField';
import QuickCredentials from '../../components/QuickCredentials/QuickCredentials';
import { useAuthForm, validationRules } from '../../hooks/useAuthForm';
import { useAuthSubmit } from '../../hooks/useAuthSubmit';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userRole, loading, initialized, getDashboardUrl } = useAuth();
  
  const [loginSuccess, setLoginSuccess] = useState(false);

  const {
    formData,
    errors,
    handleInputChange,
    handleBlur,
    validateAll,
    setFieldValue,
    clearErrors
  } = useAuthForm(
    { email: '', password: '' },
    { email: validationRules.email, password: validationRules.password }
  );

  const {
    isLoading,
    message: successMessage,
    error: errorMessage,
    submitLogin
  } = useAuthSubmit('login');

  // Redirect if already authenticated
  useEffect(() => {
    if (initialized && !loading && isAuthenticated && userRole) {
      console.log('🔄 User already authenticated, redirecting...');
      navigate(getDashboardUrl(), { replace: true });
    }
  }, [initialized, loading, isAuthenticated, userRole, navigate, getDashboardUrl]);

  if (isAuthenticated) {
    return <AuthRedirectHandler type="already-logged-in" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    try {
      await submitLogin(formData, {
        onSuccess: (response, message) => {
          console.log('✅ Login: Success callback triggered');
          setLoginSuccess(true);
        }
      });
    } catch (error) {
      console.error('❌ Login: Submit error:', error);
    }
  };

  const handleQuickFill = (email, password) => {
    setFieldValue('email', email);
    setFieldValue('password', password);
    clearErrors();
  };

  if (loginSuccess && isLoading) {
    return <AuthRedirectHandler type="login-success" />;
  }

  const beforeFormContent = process.env.NODE_ENV === 'development' ? (
    <QuickCredentials
      onFillCredentials={handleQuickFill}
    />
  ) : null;

  const formFields = (
    <>
      <FormField
        type="email"
        name="email"
        label="Email address"
        value={formData.email}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder="Enter your email"
        error={errors.email}
        disabled={isLoading}
        required
      />

      <FormField
        type="password"
        name="password"
        label="Password"
        value={formData.password}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder="Enter password"
        error={errors.password}
        disabled={isLoading}
        required
        showPasswordToggle
      >
        {{
          labelExtra: (
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          )
        }}
      </FormField>
    </>
  );

  const footerContent = (
    <p className="auth-link-text">
      Don't have an account? <Link to="/register" className="auth-link">REGISTER</Link>
    </p>
  );

  return (
    <AuthFormLayout
      title="Sign in"
      onSubmit={handleSubmit}
      submitButtonText="Sign in"
      isLoading={isLoading}
      loadingText="Signing in..."
      successMessage={successMessage}
      errorMessage={errorMessage}
      // beforeForm={beforeFormContent}
      footer={footerContent}
    >
      {formFields}
    </AuthFormLayout>
  );
};

export default Login;