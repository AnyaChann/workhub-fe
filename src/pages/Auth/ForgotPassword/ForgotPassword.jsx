import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

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

    setErrors(newErrors);
    setTouched({
      email: true
    });

    if (Object.keys(newErrors).length === 0) {
      console.log('Forgot password submitted:', formData);
      setIsSubmitted(true);
      // Handle forgot password logic here
    }
  };

  if (isSubmitted) {
    return (
      <div className="forgot-password-page">
        <div className="forgot-password-container">
          <div className="forgot-password-header">
            <Link to="/" className="logo">WorkHub®</Link>
          </div>
          
          <div className="forgot-password-form-container">
            <h1 className="forgot-password-title">Check your email</h1>
            <p className="success-message">
              We've sent a password reset link to <strong>{formData.email}</strong>
            </p>
            <div className="forgot-password-footer">
              <p className="signin-prompt">
                Remember your password? <Link to="/login" className="signin-link">Sign in</Link>
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
  }

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-header">
          <Link to="/" className="logo">WorkHub®</Link>
        </div>
        
        <div className="forgot-password-form-container">
          <h1 className="forgot-password-title">Reset password</h1>
          
          <form onSubmit={handleSubmit} className="forgot-password-form">
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

            <p className="reset-info">
              A password reset link will be sent to your email address
            </p>

            <button type="submit" className="send-reset-button">
              Send reset email
            </button>
          </form>

          <div className="forgot-password-footer">
            <p className="signin-prompt">
              Remember your password? <Link to="/login" className="signin-link">Sign in</Link>
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

export default ForgotPassword;