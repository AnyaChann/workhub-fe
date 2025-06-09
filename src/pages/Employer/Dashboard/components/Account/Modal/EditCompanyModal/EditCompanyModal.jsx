import React, { useState } from 'react';
import './EditCompanyModal.css';

const EditCompanyModal = ({ isOpen, onClose, companyData, onSave }) => {
  const [formData, setFormData] = useState({
    companyName: companyData?.companyName || 'ABCompany',
    abn: companyData?.abn || '',
    accountType: companyData?.accountType || 'EMPLOYER'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAccountTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      accountType: type
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
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Company details</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Company name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">ABN</label>
            <input
              type="text"
              name="abn"
              value={formData.abn}
              onChange={handleInputChange}
              placeholder="Enter company ABN number"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Account type</label>
            <div className="account-type-buttons">
              <button
                type="button"
                className={`account-type-btn ${formData.accountType === 'EMPLOYER' ? 'active' : ''}`}
                onClick={() => handleAccountTypeChange('EMPLOYER')}
              >
                EMPLOYER
              </button>
              <button
                type="button"
                className={`account-type-btn ${formData.accountType === 'RECRUITER' ? 'active' : ''}`}
                onClick={() => handleAccountTypeChange('RECRUITER')}
              >
                RECRUITER
              </button>
            </div>
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

export default EditCompanyModal;