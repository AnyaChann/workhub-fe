import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../core/contexts/AuthContext';
import AuthFormLayout from '../../components/AuthFormLayout/AuthFormLayout';
import AuthRedirectHandler from '../../components/AuthRedirectHandler/AuthRedirectHandler';
import FormField from '../../components/FormField/FormField';
import QuickCredentials from '../../components/QuickCredentials/QuickCredentials';
import ApiTest from '../../../../shared/components/ApiTest/ApiTest';
import { useAuthForm, validationRules } from '../../hooks/useAuthForm';
import { useAuthSubmit } from '../../hooks/useAuthSubmit';
import { authService } from '../../services/authService';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userRole, loading, initialized, getDashboardUrl } = useAuth();
  
  const [showApiTest, setShowApiTest] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

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

  // ✅ Real-time AuthService monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      const authState = authService.getAuthState();
      const token = authService.getCurrentToken();
      const user = authService.getCurrentUser();
      
      setDebugInfo(
        `Auth: ${authState.isAuthenticated ? '✅' : '❌'} | ` +
        `User: ${!!user} | ` +
        `Token: ${!!token} (${token?.length || 0}) | ` +
        `Role: ${user?.role || 'none'}`
      );
    }, 500);

    return () => clearInterval(interval);
  }, []);

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

    console.log('🚀 Login: Form submitted');
    console.log('📊 AuthService before submit:', authService.getAuthState());

    try {
      await submitLogin(formData, {
        onSuccess: (response, message) => {
          console.log('✅ Login: Success callback triggered');
          console.log('📊 AuthService in success:', authService.getAuthState());
          setLoginSuccess(true);
        }
      });
    } catch (error) {
      console.error('❌ Login: Submit error:', error);
      console.log('📊 AuthService on error:', authService.getAuthState());
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

  const beforeFormContent = (
    <>
      {/* ✅ Real-time AuthService debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ 
          padding: '0.5rem', 
          background: '#f0f8ff', 
          border: '1px solid #007bff',
          marginBottom: '1rem',
          fontSize: '0.75rem',
          fontFamily: 'monospace',
          borderRadius: '4px'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>🔍 AuthService Monitor:</div>
          <div>{debugInfo}</div>
          <div style={{ marginTop: '0.25rem', fontSize: '0.7rem', color: '#666' }}>
            Context Auth: {isAuthenticated ? '✅' : '❌'} | 
            Initialized: {initialized ? '✅' : '❌'} |
            Loading: {loading ? '⏳' : '✅'}
          </div>
        </div>
      )}
      
      <QuickCredentials
        onFillCredentials={handleQuickFill}
        showApiTest={showApiTest}
        onToggleApiTest={() => setShowApiTest(!showApiTest)}
      />
      {showApiTest && <ApiTest />}
    </>
  );

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
      beforeForm={beforeFormContent}
      footer={footerContent}
    >
      {formFields}
    </AuthFormLayout>
  );
};

export default Login;