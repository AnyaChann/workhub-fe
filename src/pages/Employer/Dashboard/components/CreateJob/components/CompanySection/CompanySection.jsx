import React from 'react';
import './CompanySection.css';

const CompanySection = ({ 
  companyName, 
  showCompanyNameAndLogo, 
  onChange, 
  error 
}) => {
  return (
    <div className="company-section">
      <div className="form-group">
        <label className="form-label">Company Name</label>
        <input
          type="text"
          name="companyName"
          value={companyName}
          onChange={onChange}
          placeholder="Select or enter company name"
          className={`form-input ${error ? 'error' : ''}`}
        />
        {error && <span className="error-message">{error}</span>}
      </div>
      
      <div className="company-visibility-section">
        <div className="toggle-container">
          <span className="toggle-label">Show company name and logo on ad</span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              name="showCompanyNameAndLogo"
              checked={showCompanyNameAndLogo}
              onChange={onChange}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        {/* Company Preview hoặc Private Notice */}
        {showCompanyNameAndLogo ? (
          <div className="company-preview">
            <div className="company-logo-placeholder">
              <span className="no-logo-text">No logo</span>
            </div>
            <div className="company-info">
              <span className="company-name-preview">
                {companyName || 'Company Name'}
              </span>
            </div>
            <button type="button" className="edit-details-btn">
              Edit details
            </button>
          </div>
        ) : (
          <div className="private-listing-notice">
            <span className="notice-icon">🔒</span>
            <span className="notice-text">
              Your job will be posted as a private listing and your company name will not be shown.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanySection;