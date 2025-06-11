import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import ROUTES from '../../../routes/routeConstants';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Get return URL from location state
  const from = location.state?.from || null;

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

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear general error too
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

    // Validate all fields
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
        console.log('Attempting login with:', { email: formData.email, password: '***' });
        
        const response = await login({
          email: formData.email.trim(),
          password: formData.password
        });

        console.log('Login successful:', response);

        // Navigate based on return URL or user role
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

      } catch (error) {
        console.error('Login error:', error);
        
        // Handle different error types
        if (error.response?.status === 401) {
          setErrors({ 
            general: 'Invalid email or password. Please try again.' 
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

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <Link to="/" className="logo">WorkHub®</Link>
        </div>

        <div className="login-form-container">
          <h1 className="login-title">Sign in</h1>

          {/* Test credentials info */}
          <div className="test-credentials" style={{
            background: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            padding: '12px',
            marginBottom: '1rem',
            fontSize: '0.85rem'
          }}>
            <strong>Test Credentials:</strong><br />
            <strong>Employer:</strong> employer@test.com / password<br />
            <strong>Candidate:</strong> candidate@test.com / password<br />
            <strong>Admin:</strong> admin@test.com / password
          </div>

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
                  {showPassword ? '👁️' : '👁️‍🗨️'}
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
                <span className="loading-spinner">
                  <span className="spinner"></span>
                  Signing in...
                </span>
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
          <span className="support-icon">❓</span>
          Support
        </button>
      </div>
    </div>
  );
};

export default Login;