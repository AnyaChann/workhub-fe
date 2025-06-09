import React, { useState } from 'react';
import './EditBillingModal.css';

const EditBillingModal = ({ isOpen, onClose, billingData, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: billingData?.firstName || '',
    lastName: billingData?.lastName || '',
    billingPhone: billingData?.billingPhone || '',
    email: billingData?.email || '',
    billingAddress: billingData?.billingAddress || '',
    suburb: billingData?.suburb || '',
    state: billingData?.state || '',
    postCode: billingData?.postCode || '',
    country: billingData?.country || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      <div className="modal-content billing-modal">
        <div className="modal-header">
          <h2 className="modal-title">Billing info</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
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
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Billing phone</label>
              <input
                type="tel"
                name="billingPhone"
                value={formData.billingPhone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                className="form-input"
              />
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
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Billing address</label>
            <input
              type="text"
              name="billingAddress"
              value={formData.billingAddress}
              onChange={handleInputChange}
              placeholder="Enter billing address"
              className="form-input"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Suburb</label>
              <input
                type="text"
                name="suburb"
                value={formData.suburb}
                onChange={handleInputChange}
                placeholder="Enter suburb"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Enter state"
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Post code</label>
              <input
                type="text"
                name="postCode"
                value={formData.postCode}
                onChange={handleInputChange}
                placeholder="Enter post code"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="Enter country"
                className="form-input"
              />
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

export default EditBillingModal;