import React, { useState } from 'react';
import './ChangePasswordModal.css';

const ChangePasswordModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

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

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
    setShowPasswords({
      current: false,
      new: false,
      confirm: false
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content password-modal">
        <div className="modal-header">
          <h2 className="modal-title">Change password</h2>
          <button className="close-btn" onClick={handleClose}>
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Current password</label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder="Enter current password"
                className={`form-input ${errors.currentPassword ? 'error' : ''}`}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('current')}
              >
                {showPasswords.current ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.currentPassword && <span className="error-message">{errors.currentPassword}</span>}
          </div>
          
          <div className="form-group">
            <label className="form-label">New password</label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Enter new password"
                className={`form-input ${errors.newPassword ? 'error' : ''}`}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPasswords.new ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
          </div>
          
          <div className="form-group">
            <label className="form-label">Confirm new password</label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm new password"
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>
          
          <div className="password-requirements">
            <p className="requirements-title">Password requirements:</p>
            <ul className="requirements-list">
              <li>At least 8 characters long</li>
              <li>Different from your current password</li>
            </ul>
          </div>
          
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Change password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;