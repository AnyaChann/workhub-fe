import React, { useState } from 'react';
import './Account.css';
import EditCompanyModal from './Modal/EditCompanyModal/EditCompanyModal';
import EditBillingModal from './Modal/EditBillingModal/EditBillingModal';

const Account = () => {
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);
  
  const [companyData, setCompanyData] = useState({
    companyName: 'ABCompany',
    abn: '',
    accountType: 'Employer',
    accountId: '274336'
  });
  
  const [billingData, setBillingData] = useState({
    firstName: '',
    lastName: '',
    billingPhone: '',
    email: '',
    billingAddress: '',
    suburb: '',
    state: '',
    postCode: '',
    country: ''
  });

  const handleEditCompanyDetails = () => {
    setShowCompanyModal(true);
  };

  const handleEditBillingInfo = () => {
    setShowBillingModal(true);
  };

  const handleSaveCompanyData = (newData) => {
    setCompanyData(prev => ({
      ...prev,
      ...newData
    }));
    console.log('Saved company data:', newData);
  };

  const handleSaveBillingData = (newData) => {
    setBillingData(newData);
    console.log('Saved billing data:', newData);
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
                  <div className="form-value">{companyData.companyName}</div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">ABN</label>
                  <div className="form-value">{companyData.abn || 'None'}</div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">ACCOUNT TYPE</label>
                  <div className="form-value">{companyData.accountType}</div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">ACCOUNT ID</label>
                  <div className="form-value">{companyData.accountId}</div>
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
                  <div className="form-value">{billingData.firstName || 'None'}</div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">LAST NAME</label>
                  <div className="form-value">{billingData.lastName || 'None'}</div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">BILLING PHONE</label>
                  <div className="form-value">{billingData.billingPhone || 'None'}</div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">EMAIL</label>
                  <div className="form-value">{billingData.email || 'None'}</div>
                </div>
                
                <div className="form-group full-width">
                  <label className="form-label">BILLING ADDRESS</label>
                  <div className="form-value">{billingData.billingAddress || 'None'}</div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">SUBURB</label>
                  <div className="form-value">{billingData.suburb || 'None'}</div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">STATE</label>
                  <div className="form-value">{billingData.state || 'None'}</div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">POST CODE</label>
                  <div className="form-value">{billingData.postCode || 'None'}</div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">COUNTRY</label>
                  <div className="form-value">{billingData.country || 'None'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditCompanyModal
        isOpen={showCompanyModal}
        onClose={() => setShowCompanyModal(false)}
        companyData={companyData}
        onSave={handleSaveCompanyData}
      />

      <EditBillingModal
        isOpen={showBillingModal}
        onClose={() => setShowBillingModal(false)}
        billingData={billingData}
        onSave={handleSaveBillingData}
      />
    </main>
  );
};

export default Account;