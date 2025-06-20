import React, { useState, useEffect } from 'react';
import './ChangePasswordModal.css';

const ChangePasswordModal = ({ isOpen, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    currentPassword: '', // Changed from oldPassword to currentPassword
    newPassword: '',
    confirmPassword: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setFormErrors({});
    }
  }, [isOpen]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Change Password</h2>
          <button className="close-btn" onClick={onClose} disabled={loading}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className={formErrors.currentPassword ? 'error' : ''}
              disabled={loading}
            />
            {formErrors.currentPassword && (
              <div className="error-message">{formErrors.currentPassword}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className={formErrors.newPassword ? 'error' : ''}
              disabled={loading}
            />
            {formErrors.newPassword && (
              <div className="error-message">{formErrors.newPassword}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={formErrors.confirmPassword ? 'error' : ''}
              disabled={loading}
            />
            {formErrors.confirmPassword && (
              <div className="error-message">{formErrors.confirmPassword}</div>
            )}
          </div>
          
          {/* <div className="password-requirements">
            <h4>Password Requirements:</h4>
            <ul>
              <li>At least 8 characters long</li>
              <li>Include uppercase and lowercase letters</li>
              <li>Include at least one number</li>
              <li>Include at least one special character</li>
            </ul>
          </div> */}
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;