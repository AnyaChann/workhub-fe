import React, { useState, useEffect } from 'react';
import './EditCompanyModal.css';

const EditCompanyModal = ({ isOpen, onClose, companyData, onSave, loading }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    industry: '',
    location: '',
    description: '',
    website: '',
    logo: null,
    logoFile: null,
    logoPreview: null
  });

  const [formErrors, setFormErrors] = useState({});

  // Reset form data when modal opens with new company data
  useEffect(() => {
    if (isOpen && companyData) {
      setFormData({
        id: companyData.id || '',
        name: companyData.name || companyData.companyName || '',
        industry: companyData.industry || '',
        location: companyData.location || '',
        description: companyData.description || '',
        website: companyData.website || '',
        logo: companyData.logo || null,
        logoFile: null,
        logoPreview: Array.isArray(companyData.logo) && companyData.logo.length > 0 
          ? companyData.logo[0] 
          : companyData.logoUrl || null
      });
      setFormErrors({});
    }
  }, [isOpen, companyData]);

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

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file size and type
    if (file.size > 5 * 1024 * 1024) {
      setFormErrors(prev => ({
        ...prev,
        logo: 'Logo size must be less than 5MB'
      }));
      return;
    }
    
    if (!['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type)) {
      setFormErrors(prev => ({
        ...prev,
        logo: 'Only JPG, PNG, and SVG formats are allowed'
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      logoFile: file,
      logoPreview: URL.createObjectURL(file)
    }));
    
    // Clear logo error if exists
    if (formErrors.logo) {
      setFormErrors(prev => ({
        ...prev,
        logo: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Company name is required';
    }
    
    if (formData.website && !/^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+([/?].*)?$/.test(formData.website)) {
      errors.website = 'Please enter a valid website URL';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Pass form data to parent component for saving
      onSave({
        ...formData,
        // Ensure backward compatibility with existing component
        companyName: formData.name
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content company-modal">
        <div className="modal-header">
          <h2 className="modal-title">Company Details</h2>
          <button className="close-btn" onClick={onClose} disabled={loading}>
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Logo Upload */}
          <div className="logo-upload">
            <label className="form-label">Company Logo</label>
            <div className="logo-preview-container">
              {formData.logoPreview ? (
                <img 
                  src={formData.logoPreview}
                  alt="Company Logo"
                  className="logo-preview"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : (
                <div className="logo-placeholder">
                  <span>🏢</span>
                </div>
              )}
            </div>
            
            <div className="logo-actions">
              <label htmlFor="logo-input" className="upload-btn">
                {formData.logoFile ? 'Change Logo' : 'Upload Logo'}
              </label>
              <input
                id="logo-input"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                disabled={loading}
                style={{ display: 'none' }}
              />
              {(formData.logoFile || formData.logoPreview) && (
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    logoFile: null,
                    logoPreview: null
                  }))}
                  disabled={loading}
                >
                  Remove Logo
                </button>
              )}
            </div>
            
            {formErrors.logo && (
              <div className="error-message">{formErrors.logo}</div>
            )}
            <p className="logo-help">Recommended size: 400x400 pixels, PNG or JPG</p>
          </div>

          {/* Company Name */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">Company Name*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={formErrors.name ? 'form-input error' : 'form-input'}
              placeholder="Enter company name"
              disabled={loading}
              required
            />
            {formErrors.name && (
              <div className="error-message">{formErrors.name}</div>
            )}
          </div>
          
          {/* Industry */}
          <div className="form-group">
            <label htmlFor="industry" className="form-label">Industry</label>
            <input
              type="text"
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleInputChange}
              className="form-input"
              placeholder="e.g. Technology, Healthcare, Finance"
              disabled={loading}
            />
          </div>
          
          {/* Location */}
          <div className="form-group">
            <label htmlFor="location" className="form-label">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="form-input"
              placeholder="e.g. Sydney, Australia"
              disabled={loading}
            />
          </div>
          
          {/* Website */}
          <div className="form-group">
            <label htmlFor="website" className="form-label">Website</label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              className={formErrors.website ? 'form-input error' : 'form-input'}
              placeholder="e.g. https://example.com"
              disabled={loading}
            />
            {formErrors.website && (
              <div className="error-message">{formErrors.website}</div>
            )}
          </div>
          
          {/* Description */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">Company Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Describe your company and what you do..."
              rows="5"
              disabled={loading}
            ></textarea>
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

export default EditCompanyModal;