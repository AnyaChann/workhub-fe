import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    businessName: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Password validation criteria
  const passwordCriteria = {
    minLength: formData.password.length >= 8,
    hasNumber: /\d/.test(formData.password),
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
  };

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
      case 'businessName':
        if (!value) {
          error = 'The business name field is required';
        } else if (value.length < 2) {
          error = 'Business name must be at least 2 characters';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required';
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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    // Check password criteria
    if (!Object.values(passwordCriteria).every(Boolean)) {
      newErrors.password = 'Password does not meet all requirements';
    }

    setErrors(newErrors);
    setTouched({
      email: true,
      businessName: true,
      password: true
    });

    if (Object.keys(newErrors).length === 0) {
      console.log('Register submitted:', formData);
      // Handle register logic here
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isPasswordFocused = touched.password || formData.password;

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <Link to="/" className="logo">WorkHub®</Link>
        </div>
        
        <div className="register-form-container">
          <h1 className="register-title">Create your<br />hiring account</h1>
          
          <form onSubmit={handleSubmit} className="register-form">
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
                required
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="businessName" className="form-label">Business name</label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="Enter your business name"
                className={`form-input ${errors.businessName ? 'error' : ''}`}
                required
              />
              {errors.businessName && <span className="error-message">{errors.businessName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Create password</label>
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
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="password-toggle"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
              
              {isPasswordFocused && (
                <div className="password-criteria">
                  <div className={`criteria-item ${passwordCriteria.minLength ? 'valid' : 'invalid'}`}>
                    <span className="criteria-icon">{passwordCriteria.minLength ? '✓' : '○'}</span>
                    8 characters minimum
                  </div>
                  <div className={`criteria-item ${passwordCriteria.hasNumber ? 'valid' : 'invalid'}`}>
                    <span className="criteria-icon">{passwordCriteria.hasNumber ? '✓' : '○'}</span>
                    One number
                  </div>
                  <div className={`criteria-item ${passwordCriteria.hasUppercase ? 'valid' : 'invalid'}`}>
                    <span className="criteria-icon">{passwordCriteria.hasUppercase ? '✓' : '○'}</span>
                    One uppercase letter
                  </div>
                  <div className={`criteria-item ${passwordCriteria.hasLowercase ? 'valid' : 'invalid'}`}>
                    <span className="criteria-icon">{passwordCriteria.hasLowercase ? '✓' : '○'}</span>
                    One lowercase letter
                  </div>
                  <div className={`criteria-item ${passwordCriteria.hasSpecial ? 'valid' : 'invalid'}`}>
                    <span className="criteria-icon">{passwordCriteria.hasSpecial ? '✓' : '○'}</span>
                    One special character
                  </div>
                </div>
              )}
            </div>

            <button type="submit" className="create-account-button">
              CREATE ACCOUNT
            </button>
          </form>

          <div className="register-footer">
            <p className="terms-text">
              By creating an account, you're agreeing to our{' '}
              <Link to="/terms" className="terms-link">Terms of Use</Link> and{' '}
              <Link to="/privacy" className="terms-link">Privacy Policy</Link>
            </p>
            
            <p className="signin-prompt">
              Already have an account? <Link to="/login" className="signin-link">SIGN IN</Link>
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

export default Register;