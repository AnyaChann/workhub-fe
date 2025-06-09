import React from 'react';
import './Account.css';

const Account = () => {
  const handleEditCompanyDetails = () => {
    console.log('Edit company details');
  };

  const handleEditBillingInfo = () => {
    console.log('Edit billing info');
  };

  return (
    <main className="dashboard-main">
      <div className="main-header">
        <h1 className="page-title">Account</h1>
      </div>
      
      <div className="account-content">
        <div className="account-sections">
          {/* Company Details Section */}
          <div className="account-section">
            <div className="section-header">
              <h2 className="section-title">Company Details</h2>
              <button className="edit-btn" onClick={handleEditCompanyDetails}>
                Edit
              </button>
            </div>
            
            <div className="section-content">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">COMPANY NAME</label>
                  <div className="form-value">ABCompany</div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">ABN</label>
                  <div className="form-value">None</div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">ACCOUNT TYPE</label>
                  <div className="form-value">Employer</div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">ACCOUNT ID</label>
                  <div className="form-value">274336</div>
                </div>
              </div>
            </div>
          </div>

          {/* Billing Info Section */}
          <div className="account-section">
            <div className="section-header">
              <h2 className="section-title">Billing info</h2>
              <button className="edit-btn" onClick={handleEditBillingInfo}>
                Edit
              </button>
            </div>
            
            <div className="section-content">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">FIRST NAME</label>
                  <div className="form-value">None</div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">LAST NAME</label>
                  <div className="form-value">None</div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">BILLING PHONE</label>
                  <div className="form-value">None</div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">EMAIL</label>
                  <div className="form-value">None</div>
                </div>
                
                <div className="form-group full-width">
                  <label className="form-label">BILLING ADDRESS</label>
                  <div className="form-value">None</div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">SUBURB</label>
                  <div className="form-value">None</div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">STATE</label>
                  <div className="form-value">None</div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">POST CODE</label>
                  <div className="form-value">None</div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">COUNTRY</label>
                  <div className="form-value">None</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Account;