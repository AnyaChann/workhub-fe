import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../../core/contexts/AuthContext';
import { companyService } from '../../../services/companiesService';
import { userService } from '../../../services/userService';
import './AccountSettingsPage.css';
import EditCompanyModal from '../../../components/Modal/EditCompanyModal/EditCompanyModal';
import EditBillingModal from '../../../components/Modal/EditBillingModal/EditBillingModal';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import { PageLoadingSpinner, InlineLoadingSpinner } from '../../../../../shared/components/LoadingSpinner/LoadingSpinner';

const AccountSettingsPage = () => {
  const { user, email } = useAuth();
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [billingLoading, setBillingLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [companyData, setCompanyData] = useState({
    id: '',
    name: '',
    industry: '',
    location: '',
    description: '',
    website: '',
    logo: [],
    inspection: 'none',
    inspectionStatus: 'none',
    status: 'active',
    createdAt: ''
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

  // Load company data when component mounts
  useEffect(() => {
    loadCompanyData();
    loadBillingData();
  }, [user]);

  const loadCompanyData = async () => {
    setCompanyLoading(true);
    setError(null);

    try {
      // Khởi tạo với dữ liệu cơ bản từ context
      setCompanyData(prev => ({
        ...prev,
        name: user?.companyName || ''
      }));

      // Lấy dữ liệu công ty từ API
      if (user?.id) {
        try {
          console.log('Fetching company data...');
          
          // Thử lấy công ty của người dùng
          const companyResponse = await companyService.getCurrentCompany();
          
          if (companyResponse) {
            console.log('Company data loaded:', companyResponse);
            
            setCompanyData({
              id: companyResponse.id,
              name: companyResponse.name,
              industry: companyResponse.industry || '',
              location: companyResponse.location || '',
              description: companyResponse.description || '',
              website: companyResponse.website || '',
              logo: companyResponse.logo || [],
              inspection: companyResponse.inspection || 'none',
              inspectionStatus: companyResponse.inspectionStatus || 'none',
              status: companyResponse.status || 'active',
              createdAt: companyResponse.createdAt || new Date().toISOString()
            });
          }
        } catch (apiError) {
          console.log('Error loading company data:', apiError);
          // Không hiển thị lỗi cho người dùng vì đây có thể là người dùng mới
          // chưa có công ty
        }
      }
    } catch (error) {
      console.error('Error in company data loading flow:', error);
      setError('Failed to load company data. Please try again later.');
    } finally {
      setCompanyLoading(false);
    }
  };

  const loadBillingData = async () => {
    setBillingLoading(true);
    
    try {
      // Khởi tạo với email từ context
      setBillingData(prev => ({
        ...prev,
        email: email || ''
      }));

      // Lấy dữ liệu thanh toán từ API
      if (user?.id) {
        try {
          const billingResponse = await userService.getBillingInfo();
          
          if (billingResponse) {
            setBillingData(billingResponse);
          }
        } catch (apiError) {
          console.log('Billing API load failed:', apiError);
          // Không hiển thị lỗi với người dùng
        }
      }
    } finally {
      setBillingLoading(false);
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
      let updatedCompany;
      
      // Nếu đã có ID công ty, cập nhật
      if (companyData.id) {
        updatedCompany = await companyService.updateCompany({
          id: companyData.id,
          name: newData.name,
          industry: newData.industry,
          location: newData.location,
          description: newData.description,
          website: newData.website
        });
      } else {
        // Nếu chưa có ID, tạo mới
        updatedCompany = await companyService.createCompany({
          name: newData.name,
          industry: newData.industry,
          location: newData.location,
          description: newData.description,
          website: newData.website
        });
      }
      
      // Cập nhật logo nếu có
      if (newData.logoFile && updatedCompany?.id) {
        try {
          await companyService.uploadCompanyLogo(updatedCompany.id, newData.logoFile);
        } catch (logoError) {
          console.error('Error uploading logo:', logoError);
          setSuccess('Company details updated but logo upload failed.');
        }
      }

      // Cập nhật state với dữ liệu mới
      setCompanyData(prev => ({
        ...prev,
        ...updatedCompany
      }));

      setSuccess('Company details updated successfully!');
      setShowCompanyModal(false);
      
      // Auto-clear success message
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Save company error:', error);
      setError(error.message || 'Failed to update company details');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBillingData = async (newData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Update billing data via API
      const updatedBilling = await userService.updateBillingInfo(newData);

      // Update local state
      setBillingData(prev => ({
        ...prev,
        ...newData,
        ...updatedBilling
      }));

      setSuccess('Billing information updated successfully!');
      setShowBillingModal(false);

      // Auto-clear success message
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Save billing error:', error);
      setError(error.message || 'Failed to update billing information');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';

    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Helper to get company status badge class
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'status-badge active';
      case 'pending': return 'status-badge pending';
      case 'inactive': return 'status-badge inactive';
      default: return 'status-badge';
    }
  };

  // Helper to get prestige badge class
  const getPrestigeBadgeClass = (inspection) => {
    return inspection === 'prestige' ? 'prestige-badge active' : 'prestige-badge inactive';
  };

  // If entire page is loading for first time
  const isFullPageLoading = companyLoading && billingLoading;

  if (isFullPageLoading) {
    return <PageLoadingSpinner message="Loading account settings..." />;
  }

  return (
    <div className="account-settings-page">
      <PageHeader
        title="Account Settings"
        subtitle="Manage your company information and billing details"
        actions={
          <button
            onClick={() => {
              loadCompanyData();
              loadBillingData();
            }}
            className="refresh-btn"
            disabled={companyLoading || billingLoading}
          >
            {companyLoading || billingLoading ? 'Refreshing...' : '🔄 Refresh'}
          </button>
        }
      />

      {/* Status Messages */}
      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <div className="alert-content">
            <strong>Error:</strong> {error}
          </div>
          <button onClick={() => setError(null)} className="alert-close">×</button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span className="alert-icon">✅</span>
          <div className="alert-content">
            <strong>Success:</strong> {success}
          </div>
          <button onClick={() => setSuccess(null)} className="alert-close">×</button>
        </div>
      )}

      <div className="account-content">
        <div className="account-sections">
          {/* Company Details Section */}
          <div className="account-section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="section-icon">🏢</span>
                Company Details
              </h2>
              {/* <button
                className="edit-btn"
                onClick={handleEditCompanyDetails}
                disabled={loading || companyLoading}
              >
                {loading ? <InlineLoadingSpinner size="small" /> : '✏️ Edit'}
              </button> */}
            </div>

            <div className="section-content">
              {companyLoading ? (
                <div className="loading-placeholder">
                  <InlineLoadingSpinner message="Loading company details..." />
                </div>
              ) : (
                <>
                  <div className="company-logo-section">
                    {Array.isArray(companyData.logo) && companyData.logo.length > 0 ? (
                      <img 
                        src={companyData.logo[0]} 
                        alt={companyData.name} 
                        className="company-logo"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : (
                      <div className="company-logo-placeholder">
                        <span>🏢</span>
                      </div>
                    )}
                  </div>

                  <div className="company-details">
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">COMPANY NAME</label>
                        <div className="form-value">{companyData.name || 'Not set'}</div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">INDUSTRY</label>
                        <div className="form-value">{companyData.industry || 'Not set'}</div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">LOCATION</label>
                        <div className="form-value">{companyData.location || 'Not set'}</div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">STATUS</label>
                        <div className="form-value">
                          <span className={getStatusBadgeClass(companyData.status)}>
                            {companyData.status?.toUpperCase() || 'UNKNOWN'}
                          </span>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">PRESTIGE RATING</label>
                        <div className="form-value">
                          <span className={getPrestigeBadgeClass(companyData.inspection)}>
                            {companyData.inspection === 'prestige' ? 'PRESTIGE EMPLOYER' : 'STANDARD'}
                          </span>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">MEMBER SINCE</label>
                        <div className="form-value">{formatDate(companyData.createdAt)}</div>
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
                          ) : 'Not set'}
                        </div>
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">DESCRIPTION</label>
                        <div className="form-value description">
                          {companyData.description || 'No company description available.'}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

         
          {/* <div className="account-section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="section-icon">💳</span>
                Billing Information
              </h2>
              <button
                className="edit-btn"
                onClick={handleEditBillingInfo}
                disabled={loading || billingLoading}
              >
                {loading ? <InlineLoadingSpinner size="small" /> : '✏️ Edit'}
              </button>
            </div>

            <div className="section-content">
              {billingLoading ? (
                <div className="loading-placeholder">
                  <InlineLoadingSpinner message="Loading billing information..." />
                </div>
              ) : (
                <>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">FIRST NAME</label>
                      <div className="form-value">{billingData.firstName || 'Not set'}</div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">LAST NAME</label>
                      <div className="form-value">{billingData.lastName || 'Not set'}</div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">BILLING PHONE</label>
                      <div className="form-value">{billingData.billingPhone || 'Not set'}</div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">EMAIL</label>
                      <div className="form-value">{billingData.email || 'Not set'}</div>
                    </div>

                    <div className="form-group full-width">
                      <label className="form-label">BILLING ADDRESS</label>
                      <div className="form-value">{billingData.billingAddress || 'Not set'}</div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">SUBURB</label>
                      <div className="form-value">{billingData.suburb || 'Not set'}</div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">STATE</label>
                      <div className="form-value">{billingData.state || 'Not set'}</div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">POST CODE</label>
                      <div className="form-value">{billingData.postCode || 'Not set'}</div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">COUNTRY</label>
                      <div className="form-value">{billingData.country || 'Australia'}</div>
                    </div>
                  </div>

               
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
                </>
              )}
            </div>
          </div> */}
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
    </div>
  );
};

export default AccountSettingsPage;