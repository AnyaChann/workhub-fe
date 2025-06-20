import React, { useState, useEffect } from 'react';
import './EditProfileModal.css';

const EditProfileModal = ({ isOpen, onClose, profileData, onSave, loading }) => {
  // Cập nhật state để phù hợp với cấu trúc dữ liệu của API
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    avatarFile: null,
    avatarPreview: null
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  // Cập nhật formData khi profileData thay đổi
  useEffect(() => {
    if (isOpen && profileData) {
      setFormData({
        fullname: profileData.fullname || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        avatarFile: null,
        avatarPreview: profileData.avatar || null
      });
      setFormErrors({});
    }
  }, [isOpen, profileData]);
  
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
  
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Kiểm tra kích thước và loại file
    if (file.size > 5 * 1024 * 1024) {
      setFormErrors(prev => ({
        ...prev,
        avatar: 'Image size must be less than 5MB'
      }));
      return;
    }
    
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      setFormErrors(prev => ({
        ...prev,
        avatar: 'Only JPG, PNG, and GIF formats are allowed'
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      avatarFile: file,
      avatarPreview: URL.createObjectURL(file)
    }));
    
    // Clear avatar error if exists
    if (formErrors.avatar) {
      setFormErrors(prev => ({
        ...prev,
        avatar: null
      }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.fullname.trim()) {
      errors.fullname = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (formData.phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(formData.phone)) {
      errors.phone = 'Phone number is invalid';
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
          <h2>Edit Profile</h2>
          <button className="close-btn" onClick={onClose} disabled={loading}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="avatar-upload">
            <div className="avatar-preview">
              {formData.avatarPreview ? (
                <img 
                  src={formData.avatarPreview}
                  alt="Avatar Preview"
                  className="avatar-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : (
                <div className="avatar-placeholder">
                  <span>👤</span>
                </div>
              )}
            </div>
            
            <div className="upload-actions">
              <label htmlFor="avatar-input" className="upload-btn">
                {formData.avatarFile ? 'Change Photo' : 'Upload Photo'}
              </label>
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={loading}
                style={{ display: 'none' }}
              />
              {formData.avatarFile && (
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    avatarFile: null,
                    avatarPreview: profileData.avatar || null
                  }))}
                  disabled={loading}
                >
                  Remove
                </button>
              )}
            </div>
            
            {formErrors.avatar && (
              <div className="error-message">{formErrors.avatar}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="fullname">Full Name</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleInputChange}
              className={formErrors.fullname ? 'error' : ''}
              disabled={loading}
            />
            {formErrors.fullname && (
              <div className="error-message">{formErrors.fullname}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={formErrors.email ? 'error' : ''}
              disabled={loading}
            />
            {formErrors.email && (
              <div className="error-message">{formErrors.email}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={formErrors.phone ? 'error' : ''}
              placeholder="e.g. +84123456789"
              disabled={loading}
            />
            {formErrors.phone && (
              <div className="error-message">{formErrors.phone}</div>
            )}
          </div>
          
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
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;