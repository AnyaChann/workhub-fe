import React, { useState, useRef } from 'react';
import './EditProfileModal.css';

const EditProfileModal = ({ isOpen, onClose, profileData, onSave }) => {
  const [formData, setFormData] = useState({
    displayPicture: profileData?.displayPicture || null,
    firstName: profileData?.firstName || '',
    lastName: profileData?.lastName || '',
    email: profileData?.email || 'bachct504@gmail.com',
    contactNumber: profileData?.contactNumber || ''
  });
  
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          displayPicture: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      displayPicture: null
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content profile-modal">
        <div className="modal-header">
          <h2 className="modal-title">Edit profile</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="profile-picture-upload">
            <label className="form-label">Display picture</label>
            <div className="picture-upload-container">
              <div className="picture-preview" onClick={handleImageClick}>
                {formData.displayPicture ? (
                  <img src={formData.displayPicture} alt="Profile preview" />
                ) : (
                  <div className="default-preview">
                    <span className="upload-icon">📷</span>
                    <span className="upload-text">Click to upload</span>
                  </div>
                )}
              </div>
              <div className="picture-actions">
                <button type="button" className="upload-btn" onClick={handleImageClick}>
                  Choose file
                </button>
                {formData.displayPicture && (
                  <button type="button" className="remove-btn" onClick={handleRemoveImage}>
                    Remove
                  </button>
                )}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter first name"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Last name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter last name"
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Contact number</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              placeholder="Enter contact number"
              className="form-input"
            />
          </div>
          
          <div className="modal-actions">
            <button type="submit" className="save-btn">
              <span className="save-icon">💾</span>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;