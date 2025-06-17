import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../core/contexts/AuthContext';
import ROUTES from '../../../../core/routing/routeConstants';
import ApiTest from '../../../../shared/components/ApiTest/ApiTest';
import { ButtonLoadingSpinner } from '../../../../shared/components/LoadingSpinner/LoadingSpinner';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, userRole, loading, initialized, getDashboardUrl } = useAuth();

  const [formData, setFormData] = useState({
    email: 'employer@test.com',
    password: 'password'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showApiTest, setShowApiTest] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const from = location.state?.from || null;

  // Redirect if already authenticated
  useEffect(() => {
    if (initialized && !loading && isAuthenticated && userRole) {
      console.log('ðŸ”„ User already authenticated, redirecting to dashboard');
      const dashboardUrl = getDashboardUrl();
      console.log('ðŸ“ Redirecting to:', dashboardUrl);
      navigate(dashboardUrl, { replace: true });
    }
  }, [initialized, loading, isAuthenticated, userRole, navigate, getDashboardUrl]);

  // Show loading if auth is still being checked
  // if (!initialized || loading) {
  //   return (
  //     <div style={{
  //       position: 'fixed',
  //       top: 0,
  //       left: 0,
  //       width: '100%',
  //       height: '100%',
  //       background: 'rgba(255, 255, 255, 0.95)',
  //       display: 'flex',
  //       flexDirection: 'column',
  //       justifyContent: 'center',
  //       alignItems: 'center',
  //       zIndex: 9999
  //     }}>
  //       <div style={{
  //         width: '50px',
  //         height: '50px',
  //         border: '3px solid #007bff',
  //         borderTop: '3px solid transparent',
  //         borderRadius: '50%',
  //         animation: 'spin 1s linear infinite',
  //         marginBottom: '1rem'
  //       }}></div>
  //       <p style={{ color: '#666', fontSize: '0.9rem' }}>
  //         Checking authentication...
  //       </p>
  //       <style>{`
  //         @keyframes spin {
  //           0% { transform: rotate(0deg); }
  //           100% { transform: rotate(360deg); }
  //         }
  //       `}</style>
  //     </div>
  //   );
  // }

  // If user is already authenticated, show redirect message
  if (isAuthenticated) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(255, 255, 255, 0.95)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <h2 style={{ color: '#28a745', marginBottom: '1rem' }}>
             Already Logged In
          </h2>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            You are already authenticated as <strong>{userRole?.toUpperCase()}</strong>
          </p>
          <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Redirecting to your dashboard...
          </p>
          <button
            onClick={() => navigate(getDashboardUrl())}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'email':
        if (!value) {
          error = 'The email field is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'password':
        if (!value) {
          error = 'The password field is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters';
        }
        break;
      default:
        break;
    }

    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (errors.general) {
      setErrors(prev => ({
        ...prev,
        general: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched({
      email: true,
      password: true
    });

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);

      try {
        console.log('ðŸš€ Attempting login with:', {
          email: formData.email,
          password: '***'
        });

        const response = await login({
          email: formData.email.trim(),
          password: formData.password
        });

        console.log(' Login successful:', response);
        setLoginSuccess(true);

        // Show success message with user info
        const isMock = response.message && response.message.includes('Mock');
        setErrors({
          success: ` Welcome ${response.user?.fullname}! ${isMock ? '(Mock data)' : '(Database user)'}`
        });

        // Navigate after showing success message
        setTimeout(() => {
          if (from) {
            navigate(from, { replace: true });
          } else {
            const userRole = response.user?.role?.toLowerCase();

            switch (userRole) {
              case 'employer':
                navigate(ROUTES.EMPLOYER.DASHBOARD);
                break;
              case 'candidate':
                navigate(ROUTES.CANDIDATE.DASHBOARD);
                break;
              case 'admin':
                navigate(ROUTES.ADMIN.DASHBOARD);
                break;
              default:
                navigate(ROUTES.HOME);
            }
          }
        }, 2000);

      } catch (error) {
        console.error('âŒ Login error:', error);

        if (error.response?.status === 401 || error.message === 'Invalid email or password') {
          setErrors({
            general: 'âŒ Invalid email or password. Try using mock credentials or run SQL script for database users.'
          });
        } else if (error.response?.status === 400) {
          setErrors({
            general: error.response?.data?.message || 'Bad request. Please check your input.'
          });
        } else if (error.response?.status === 422) {
          const backendErrors = error.response.data.errors || {};
          setErrors(backendErrors);
        } else if (error.message) {
          setErrors({
            general: error.message
          });
        } else {
          setErrors({
            general: 'Login failed. Please check your connection and try again.'
          });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const quickFillCredentials = (email, password) => {
    setFormData({ email, password });
    setErrors({});
  };

  // Loading overlay when navigating
  if (loginSuccess && isLoading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(255, 255, 255, 0.95)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '4px solid #007bff',
          borderTop: '4px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem'
        }}></div>
        <h2 style={{ color: '#333', marginBottom: '0.5rem' }}>
          ðŸŽ‰ Login Successful!
        </h2>
        <p style={{ color: '#666' }}>
          Redirecting to your dashboard...
        </p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <Link to="/" className="logo">WorkHubÂ®</Link>
        </div>

        <div className="login-form-container">
          <h1 className="login-title">Sign in</h1>

          {/* Database User Info */}
          <div className="test-credentials" style={{
            background: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '4px',
            padding: '12px',
            marginBottom: '1rem',
            fontSize: '0.85rem'
          }}>
            <strong>ðŸ—„ï¸ Database Users (need SQL script):</strong><br />
            <div style={{ display: 'flex', gap: '5px', marginTop: '5px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => quickFillCredentials('employer@test.com', 'password')}
                style={{
                  padding: '2px 8px',
                  fontSize: '0.75rem',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                ðŸ“Š Employer â†’ Dashboard
              </button>
              <button
                type="button"
                onClick={() => quickFillCredentials('candidate@test.com', 'password')}
                style={{
                  padding: '2px 8px',
                  fontSize: '0.75rem',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                ðŸ“Š Candidate â†’ Dashboard
              </button>
              <button
                type="button"
                onClick={() => quickFillCredentials('admin@test.com', 'password')}
                style={{
                  padding: '2px 8px',
                  fontSize: '0.75rem',
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                ðŸ“Š Admin â†’ Dashboard
              </button>
            </div>
          </div>

          {/* Mock Credentials */}
          <div className="test-credentials" style={{
            background: '#d1ecf1',
            border: '1px solid #bee5eb',
            borderRadius: '4px',
            padding: '12px',
            marginBottom: '1rem',
            fontSize: '0.85rem'
          }}>
            <strong>ðŸ”§ Mock Users (always work):</strong><br />
            <div style={{ display: 'flex', gap: '5px', marginTop: '5px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => quickFillCredentials('employer@test.com', 'password')}
                style={{
                  padding: '2px 8px',
                  fontSize: '0.75rem',
                  background: '#17a2b8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                ðŸ”§ Employer â†’ Full Dashboard
              </button>
              <button
                type="button"
                onClick={() => quickFillCredentials('candidate@test.com', 'password')}
                style={{
                  padding: '2px 8px',
                  fontSize: '0.75rem',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                ðŸŽ¯ Candidate â†’ Temp + Logout
              </button>
              <button
                type="button"
                onClick={() => quickFillCredentials('admin@test.com', 'password')}
                style={{
                  padding: '2px 8px',
                  fontSize: '0.75rem',
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                âš™ï¸ Admin â†’ Temp + Logout
              </button>
            </div>
          </div>

          {/* Debug Toggle */}
          <div style={{ marginBottom: '1rem' }}>
            <button
              type="button"
              onClick={() => setShowApiTest(!showApiTest)}
              style={{
                fontSize: '0.75rem',
                padding: '4px 8px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              {showApiTest ? 'Hide' : 'Show'} ðŸ” API Debug
            </button>
          </div>

          {/* API Test Component */}
          {showApiTest && <ApiTest />}

          {/* Success Message */}
          {errors.success && (
            <div style={{
              background: '#d4edda',
              color: '#155724',
              border: '1px solid #c3e6cb',
              borderRadius: '4px',
              padding: '12px',
              marginBottom: '1rem',
              fontSize: '0.9rem'
            }}>
              {errors.success}
            </div>
          )}

          {/* Error Message */}
          {errors.general && (
            <div className="error-banner">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="Enter your email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                disabled={isLoading}
                required
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <div className="password-header">
                <label htmlFor="password" className="form-label">Password</label>
                <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
              </div>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Enter password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="password-toggle"
                  disabled={isLoading}
                >
                  {showPassword ? 'ðŸ‘ï¸' : 'ðŸ‘ï¸â€ðŸ—¨ï¸'}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <button
              type="submit"
              className="sign-in-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <ButtonLoadingSpinner message="Signing in..." />
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p className="signup-prompt">
              Don't have an account? <Link to="/register" className="register-link">REGISTER</Link>
            </p>
          </div>
        </div>
      </div>

      <div className="support-button">
        <button className="support-btn">
          <span className="support-icon">â“</span>
          Support
        </button>
      </div>
    </div>
  );
};

export default Login;
