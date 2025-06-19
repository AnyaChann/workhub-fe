import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../../core/contexts/AuthContext';
import { userService } from '../../../../../shared/utils/helpers/userService';
import './AccountSettingsPage.css';
import EditCompanyModal from '../../../components/Modal/EditCompanyModal/EditCompanyModal';
import EditBillingModal from '../../../components/Modal/EditBillingModal/EditBillingModal';
import { PageLoadingSpinner, InlineLoadingSpinner } from '../../../../../shared/components/LoadingSpinner/LoadingSpinner';

const Account = () => {
  const { user, email } = useAuth();
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [companyData, setCompanyData] = useState({
    id: '',
    companyName: '',
    abn: '',
    accountType: 'Employer',
    industry: '',
    companySize: '',
    website: '',
    description: '',
    logoUrl: '',
    address: {
      street: '',
      suburb: '',
      state: '',
      postCode: '',
      country: 'Australia'
    },
    contact: {
      name: '',
      email: '',
      phone: ''
    },
    createdAt: '',
    updatedAt: '',
    status: 'active'
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
    country: 'Australia'
  });

  // Load company and billing data when component mounts
  useEffect(() => {
    loadAccountData();
  }, [user]);

  const loadAccountData = async () => {
    setLoading(true);
    try {
      // Set basic data from user context
      setCompanyData(prev => ({
        ...prev,
        accountId: user?.id?.toString() || '',
        companyName: user?.companyName || 'WorkHub Company'
      }));

      setBillingData(prev => ({
        ...prev,
        email: email || ''
      }));

      // Try to load company data from API
      try {
        const companyResponse = await userService.getCompanyInfo();
        if (companyResponse) {
          setCompanyData(prev => ({
            ...prev,
            ...companyResponse
          }));
        }
      } catch (apiError) {
        console.log('Company API load failed, using default data:', apiError);
      }

      // Try to load billing data from API
      try {
        const billingResponse = await userService.getBillingHistory();
        if (billingResponse?.billingInfo) {
          setBillingData(prev => ({
            ...prev,
            ...billingResponse.billingInfo
          }));
        }
      } catch (apiError) {
        console.log('Billing API load failed, using default data:', apiError);
      }

    } catch (error) {
      console.error('Error loading account data:', error);
      setError('Failed to load account data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCompanyDetails = () => {
    setShowCompanyModal(true);
    setError(null);
    setSuccess(null);
  };

  const handleEditBillingInfo = () => {
    setShowBillingModal(true);
    setError(null);
    setSuccess(null);
  };

  const handleSaveCompanyData = async (newData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Update company data via API
      const updatedCompany = await userService.updateCompanyInfo(newData);

      // Update local state
      setCompanyData(prev => ({
        ...prev,
        ...newData,
        ...updatedCompany
      }));

      setSuccess('Company details updated successfully!');
      console.log('Company data saved:', newData);

      // Auto-clear success message
      setTimeout(() => setSuccess(null), 3000);

    } catch (error) {
      console.error('Save company error:', error);
      setError(error.response?.data?.message || 'Failed to update company details');

      // Update local state anyway for better UX
      setCompanyData(prev => ({
        ...prev,
        ...newData
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBillingData = async (newData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Update billing data via API (you'll need to create this endpoint)
      // const updatedBilling = await userService.updateBillingInfo(newData);

      // For now, just update local state
      setBillingData(newData);
      setSuccess('Billing information updated successfully!');
      console.log('Billing data saved:', newData);

      // Auto-clear success message
      setTimeout(() => setSuccess(null), 3000);

    } catch (error) {
      console.error('Save billing error:', error);
      setError(error.response?.data?.message || 'Failed to update billing information');

      // Update local state anyway
      setBillingData(newData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="dashboard-main">
      <div className="main-header">
        <h1 className="page-title">Account</h1>
        {user && (
          <div className="user-context">
            <span className="user-id">ID: {user.id}</span>
            <span className="user-role">{user.role?.toUpperCase()}</span>
          </div>
        )}
      </div>

      {/* Status Messages */}
      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">âš ï¸</span>
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span className="alert-icon"></span>
          {success}
        </div>
      )}

      {/* {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <span>Updating account...</span>
          </div>
        </div>
      )} */}

      <div className="account-content">
        <div className="account-sections">
          {/* Company Details Section */}
          <div className="account-section">
            <div className="section-header">
              <h2 className="section-title">Company Details</h2>
              <button
                className="edit-btn"
                onClick={handleEditCompanyDetails}
                disabled={loading}
              >
                {loading ? (
                  <InlineLoadingSpinner message="Saving..." size="small" />
                ) : (
                  'Edit'
                )}
              </button>
            </div>

            <div className="section-content">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">COMPANY NAME</label>
                  <div className="form-value">{companyData.companyName || 'None'}</div>
                </div>

                <div className="form-group">
                  <label className="form-label">ABN</label>
                  <div className="form-value">{companyData.abn || 'None'}</div>
                </div>

                <div className="form-group">
                  <label className="form-label">ACCOUNT TYPE</label>
                  <div className="form-value">
                    <span className="account-type-badge">
                      {companyData.accountType}
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">ACCOUNT ID</label>
                  <div className="form-value">{companyData.accountId}</div>
                </div>

                <div className="form-group">
                  <label className="form-label">INDUSTRY</label>
                  <div className="form-value">{companyData.industry || 'None'}</div>
                </div>

                <div className="form-group">
                  <label className="form-label">COMPANY SIZE</label>
                  <div className="form-value">{companyData.companySize || 'None'}</div>
                </div>

                <div className="form-group full-width">
                  <label className="form-label">WEBSITE</label>
                  <div className="form-value">
                    {companyData.website ? (
                      <a
                        href={companyData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="website-link"
                      >
                        {companyData.website}
                      </a>
                    ) : 'None'}
                  </div>
                </div>

                <div className="form-group full-width">
                  <label className="form-label">DESCRIPTION</label>
                  <div className="form-value description">
                    {companyData.description || 'None'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Billing Info Section */}
          <div className="account-section">
            <div className="section-header">
              <h2 className="section-title">Billing Information</h2>
              <button
                className="edit-btn"
                onClick={handleEditBillingInfo}
                disabled={loading}
              >
                {loading ? (
                  <InlineLoadingSpinner message="Saving..." size="small" />
                ) : (
                  'Edit'
                )}
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

              {/* Billing Status */}
              <div className="billing-status">
                <div className="status-item">
                  <span className="status-label">Billing Status:</span>
                  <span className="status-badge active">Active</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Payment Method:</span>
                  <span className="status-value">Credit Card ending in ****</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Next billing date:</span>
                  <span className="status-value">
                    {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </span>
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
        loading={loading}
      />

      <EditBillingModal
        isOpen={showBillingModal}
        onClose={() => setShowBillingModal(false)}
        billingData={billingData}
        onSave={handleSaveBillingData}
        loading={loading}
      />
    </main>
  );
};

export default Account;
