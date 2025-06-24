import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../core/contexts/AuthContext';
import { servicePackageService } from '../../../services/servicePackageService';
import { packageService } from '../../../services/packageService';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import './BillingPage.css';

const BillingPage = () => {
  // Separate state for different data types
  const [packages, setPackages] = useState([]);
  const [userPackages, setUserPackages] = useState([]);
  const [serviceFeatures, setServiceFeatures] = useState([]);
  
  // Separate loading states
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [userPackagesLoading, setUserPackagesLoading] = useState(true);
  const [featuresLoading, setFeaturesLoading] = useState(true);
  
  // Transaction states
  const [processing, setProcessing] = useState(false);
  const [processingAction, setProcessingAction] = useState('');
  
  // Separate error states
  const [packagesError, setPackagesError] = useState(null);
  const [userPackagesError, setUserPackagesError] = useState(null);
  const [featuresError, setFeaturesError] = useState(null);
  const [transactionError, setTransactionError] = useState(null);
  const [transactionSuccess, setTransactionSuccess] = useState(null);

  // Track online status
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load packages
  const loadPackages = useCallback(async () => {
    try {
      setPackagesLoading(true);
      setPackagesError(null);
      
      console.log('📦 Loading available packages...');
      const availablePackages = await servicePackageService.getAllPackages();
      console.log('📦 Available packages loaded:', availablePackages);
      
      if (Array.isArray(availablePackages) && availablePackages.length > 0) {
        setPackages(availablePackages);
      } else if (availablePackages?.data && Array.isArray(availablePackages.data)) {
        setPackages(availablePackages.data);
      } else if (!Array.isArray(availablePackages) && availablePackages) {
        // API returns single object instead of array
        setPackages([availablePackages]);
      } else {
        console.warn('⚠️ No packages found or invalid format');
        setPackages([]);
      }
    } catch (err) {
      console.error('❌ Error loading packages:', err);
      setPackagesError(err.message || 'Failed to load available packages');
      setPackages([]);
    } finally {
      setPackagesLoading(false);
    }
  }, []);

  // Load user packages
  const loadUserPackages = useCallback(async () => {
    if (!user?.id) {
      setUserPackagesLoading(false);
      setUserPackagesError('User information not available');
      return;
    }
    
    try {
      setUserPackagesLoading(true);
      setUserPackagesError(null);
      
      console.log('👤 Loading user packages for:', user.id);
      const currentPackages = await servicePackageService.getUserPackages(user.id);
      console.log('👤 User packages loaded:', currentPackages);
      
      if (Array.isArray(currentPackages) && currentPackages.length > 0) {
        setUserPackages(currentPackages);
      } else if (currentPackages?.data && Array.isArray(currentPackages.data)) {
        setUserPackages(currentPackages.data);
      } else if (!Array.isArray(currentPackages) && currentPackages) {
        // Handle case when API returns a single package object
        setUserPackages([currentPackages]);
      } else {
        console.log('ℹ️ User has no active packages');
        setUserPackages([]);
      }
    } catch (err) {
      console.error('❌ Error loading user packages:', err);
      setUserPackagesError('Could not load your current packages');
      
      // Try to use cached data if available
      const cachedPackages = localStorage.getItem('cachedUserPackages');
      if (cachedPackages) {
        try {
          setUserPackages(JSON.parse(cachedPackages));
          console.log('📋 Using cached user packages');
        } catch (parseError) {
          console.error('❌ Error parsing cached packages:', parseError);
          setUserPackages([]);
        }
      } else {
        console.log('📋 No cached user packages found, using empty array');
        setUserPackages([]);
      }
    } finally {
      setUserPackagesLoading(false);
    }
  }, [user?.id]);

  // Load service features
  const loadServiceFeatures = useCallback(async () => {
    try {
      setFeaturesLoading(true);
      setFeaturesError(null);
      
      console.log('🛠️ Loading service features...');
      const features = await servicePackageService.getAllFeatures();
      console.log('🛠️ Service features loaded:', features);
      
      if (Array.isArray(features) && features.length > 0) {
        setServiceFeatures(features);
      } else if (features?.data && Array.isArray(features.data)) {
        setServiceFeatures(features.data);
      } else {
        console.warn('⚠️ No service features found or invalid format');
        setServiceFeatures([]);
      }
    } catch (err) {
      console.error('❌ Error loading service features:', err);
      setFeaturesError('Failed to load service features');
      setServiceFeatures([]);
    } finally {
      setFeaturesLoading(false);
    }
  }, []);

  // Load all data
  const loadAllData = useCallback(() => {
    loadPackages();
    loadUserPackages();
    loadServiceFeatures();
  }, [loadPackages, loadUserPackages, loadServiceFeatures]);

  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Cache user packages when they change
  useEffect(() => {
    if (userPackages.length > 0) {
      try {
        localStorage.setItem('cachedUserPackages', JSON.stringify(userPackages));
        console.log('💾 User packages cached for offline use');
      } catch (error) {
        console.error('❌ Error caching user packages:', error);
      }
    }
  }, [userPackages]);
  
  // Success message auto-dismiss
  useEffect(() => {
    if (transactionSuccess) {
      const timer = setTimeout(() => {
        setTransactionSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [transactionSuccess]);

  // Handle package purchase
  const handlePurchasePackage = async (packageItem) => {
    if (!isOnline) {
      setTransactionError("You're offline. Please connect to the internet to make a purchase.");
      return;
    }
    
    if (!user?.id) {
      setTransactionError("User information not available. Please log in again.");
      return;
    }
    
    try {
      setProcessing(true);
      setProcessingAction(`Purchasing ${packageItem.name}`);
      setTransactionError(null);
      setTransactionSuccess(null);
      
      console.log('💰 Initiating purchase for package:', packageItem);
      
      const result = await packageService.purchasePackage(user.id, packageItem.id);
      
      if (result?.success) {
        console.log('✅ Package purchased successfully:', result.data);
        setTransactionSuccess(`${packageItem.name} purchased successfully!`);
        
        // Reload user packages to show the newly purchased one
        await loadUserPackages();
      } else {
        throw new Error(result?.error || 'Purchase failed');
      }
    } catch (error) {
      console.error('❌ Error purchasing package:', error);
      setTransactionError(`Failed to purchase ${packageItem.name}: ${error.message}`);
    } finally {
      setProcessing(false);
      setProcessingAction('');
    }
  };

  // Handle package renewal
  const handleRenewPackage = async (userPackage) => {
    if (!isOnline) {
      setTransactionError("You're offline. Please connect to the internet to renew a package.");
      return;
    }
    
    if (!user?.id) {
      setTransactionError("User information not available. Please log in again.");
      return;
    }
    
    try {
      setProcessing(true);
      setProcessingAction(`Renewing ${userPackage.servicePackage?.name || 'package'}`);
      setTransactionError(null);
      setTransactionSuccess(null);
      
      console.log('🔄 Initiating renewal for package:', userPackage);
      
      const result = await packageService.renewPackage(user.id, userPackage.id);
      
      if (result?.success) {
        console.log('✅ Package renewed successfully:', result.data);
        setTransactionSuccess(`${userPackage.servicePackage?.name || 'Package'} renewed successfully!`);
        
        // Reload user packages to show the updated one
        await loadUserPackages();
      } else {
        throw new Error(result?.error || 'Renewal failed');
      }
    } catch (error) {
      console.error('❌ Error renewing package:', error);
      setTransactionError(`Failed to renew package: ${error.message}`);
    } finally {
      setProcessing(false);
      setProcessingAction('');
    }
  };

  // Format price with currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Extract feature count by type
  const getFeatureCount = (packageItem, postType) => {
    const feature = packageItem.features?.find(f => f.postAt === postType);
    return feature ? feature.jobPostLimit : 0;
  };

  // Get total job post limit
  const getTotalJobPostLimit = (packageItem) => {
    if (!packageItem?.features) return 0;
    return packageItem.features.reduce((total, feature) => {
      return total + (feature.jobPostLimit || 0);
    }, 0);
  };

  // Calculate remaining days for a user package
  const getRemainingDays = (userPackage) => {
    if (!userPackage?.expirationDate) return 0;
    
    const now = new Date();
    const expiryDate = new Date(userPackage.expirationDate);
    const diffTime = expiryDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  // Check if package is active
  const isPackageActive = (userPackage) => {
    return userPackage.status === 'active' && getRemainingDays(userPackage) > 0;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Full page loading state
  const isFullPageLoading = packagesLoading && userPackagesLoading && !packages.length && !userPackages.length;
  
  if (isFullPageLoading) {
    return (
      <div className="billing-page">
        <PageHeader title="Billing & Packages" />
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading billing information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="billing-page">
      <PageHeader 
        title="Billing & Packages"
        subtitle="Manage your job posting packages and billing information"
        actions={
          <button 
            onClick={loadAllData} 
            className="refresh-btn"
            disabled={packagesLoading || userPackagesLoading || processing}
          >
            {packagesLoading || userPackagesLoading ? 'Refreshing...' : '🔄 Refresh'}
          </button>
        }
      />

      {/* Network status banner */}
      {!isOnline && (
        <div className="network-status offline">
          <span className="status-icon">📶</span>
          <span className="status-text">You're currently offline. Some features may be limited.</span>
        </div>
      )}

      {/* Transaction messages */}
      {transactionError && (
        <div className="error-banner transaction-error">
          <span className="error-icon">⚠️</span>
          <span>{transactionError}</span>
          <button onClick={() => setTransactionError(null)} className="close-btn">×</button>
        </div>
      )}

      {transactionSuccess && (
        <div className="success-banner transaction-success">
          <span className="success-icon">✅</span>
          <span>{transactionSuccess}</span>
          <button onClick={() => setTransactionSuccess(null)} className="close-btn">×</button>
        </div>
      )}

      {/* Processing overlay */}
      {processing && (
        <div className="processing-overlay">
          <div className="processing-content">
            <div className="loading-spinner"></div>
            <p>{processingAction || 'Processing...'}</p>
            <p className="processing-note">Please do not refresh or leave this page.</p>
          </div>
        </div>
      )}

      {/* Current Packages Section */}
      <div className="billing-section">
        <div className="section-header">
          <h2 className="section-title">Your Current Packages</h2>
          {userPackagesLoading && (
            <span className="section-loading">
              <div className="loading-spinner-small"></div>
              <span>Loading...</span>
            </span>
          )}
          {userPackagesError && (
            <button 
              onClick={loadUserPackages} 
              className="retry-btn small"
              title={userPackagesError}
            >
              Retry
            </button>
          )}
        </div>

        {userPackagesError && (
          <div className="error-banner section-error">
            <span className="error-icon">⚠️</span>
            <span>{userPackagesError}</span>
            <button onClick={loadUserPackages} className="retry-btn">Retry</button>
          </div>
        )}

        {!userPackagesLoading && userPackages.length > 0 ? (
          <div className="current-packages">
            {userPackages.map((pkg) => (
              <div key={pkg.id} className={`current-package-card ${!isPackageActive(pkg) ? 'inactive' : ''}`}>
                <div className="package-header">
                  <h3 className="package-name">{pkg.servicePackage?.name || 'Unknown Package'}</h3>
                  <span className={`package-status ${pkg.status}`}>
                    {pkg.status?.toUpperCase() || 'UNKNOWN'}
                  </span>
                </div>
                
                <div className="package-info">
                  <p className="package-description">{pkg.servicePackage?.description || pkg.description || 'No description available'}</p>
                  
                  <div className="package-meta">
                    <div className="meta-item">
                      <span className="meta-icon">💰</span>
                      <span className="meta-label">Price:</span>
                      <span className="meta-value">{formatPrice(pkg.price || pkg.servicePackage?.price || 0)}</span>
                    </div>
                    
                    <div className="meta-item">
                      <span className="meta-icon">📅</span>
                      <span className="meta-label">Purchased:</span>
                      <span className="meta-value">{formatDate(pkg.purchaseDate)}</span>
                    </div>
                    
                    <div className="meta-item">
                      <span className="meta-icon">⏰</span>
                      <span className="meta-label">Expires:</span>
                      <span className="meta-value">
                        {formatDate(pkg.expirationDate)}
                        {getRemainingDays(pkg) > 0 && <span className="days-remaining"> ({getRemainingDays(pkg)} days left)</span>}
                      </span>
                    </div>
                  </div>
                </div>
                
                {pkg.servicePackage?.features && pkg.servicePackage.features.length > 0 && (
                  <div className="package-features-summary">
                    <h4 className="features-title">Package Features:</h4>
                    <div className="features-list">
                      {pkg.servicePackage.features.map((feature) => (
                        <div key={feature.id} className="feature-item">
                          <span className="feature-icon">
                            {feature.postAt === 'standard' ? '📝' : 
                             feature.postAt === 'urgent' ? '🚨' : 
                             feature.postAt === 'premium' ? '⭐' : '🔍'}
                          </span>
                          <span className="feature-name">{feature.featureName}</span>
                          <span className="feature-limit">{feature.jobPostLimit} posts</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="package-footer">
                  {getRemainingDays(pkg) <= 0 ? (
                    <div className="package-expired-notice">
                      <span className="expired-icon">⚠️</span>
                      <span className="expired-text">This package has expired</span>
                    </div>
                  ) : (
                    getRemainingDays(pkg) <= 7 && (
                      <div className="package-expiring-notice">
                        <span className="expiring-icon">⏰</span>
                        <span className="expiring-text">Expiring soon</span>
                      </div>
                    )
                  )}
                  
                  <button 
                    className="renew-btn"
                    onClick={() => handleRenewPackage(pkg)}
                    disabled={!isOnline || processing || !pkg.servicePackage?.id}
                    title={!isOnline ? "You're offline. Please reconnect to renew." : 
                           !pkg.servicePackage?.id ? "Package information incomplete" : ""}
                  >
                    Renew Package
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (!userPackagesLoading && !userPackagesError) ? (
          <div className="no-packages">
            <div className="empty-state">
              <span className="empty-icon">📦</span>
              <h3>No active packages</h3>
              <p>Purchase a package below to start posting jobs</p>
              <button 
                className="view-packages-btn"
                onClick={() => {
                  // Scroll to available packages section
                  document.querySelector('.billing-section:nth-child(4)')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Available Packages
              </button>
            </div>
          </div>
        ) : userPackagesLoading && !isFullPageLoading ? (
          <div className="section-placeholder">
            <div className="loading-spinner"></div>
            <p>Loading your packages...</p>
          </div>
        ) : null}
      </div>

      {/* Available Packages Section */}
      <div className="billing-section">
        <div className="section-header">
          <h2 className="section-title">Available Packages</h2>
          {packagesLoading && !isFullPageLoading && (
            <span className="section-loading">
              <div className="loading-spinner-small"></div>
              <span>Loading...</span>
            </span>
          )}
          {packagesError && (
            <button 
              onClick={loadPackages} 
              className="retry-btn small"
              title={packagesError}
            >
              Retry
            </button>
          )}
        </div>

        {packagesError && (
          <div className="error-banner section-error">
            <span className="error-icon">⚠️</span>
            <span>{packagesError}</span>
            <button onClick={loadPackages} className="retry-btn">Retry</button>
          </div>
        )}

        {!packagesLoading || packages.length > 0 ? (
          <div className="packages-grid">
            {packages.length > 0 ? packages.map((pkg) => (
              <div key={pkg.id} className="package-card">
                <div className="package-header">
                  <h3 className="package-name">{pkg.name}</h3>
                  <div className="package-price">
                    <span className="price-amount">{formatPrice(pkg.price)}</span>
                    <span className="price-period">/{pkg.duration || 30} days</span>
                  </div>
                </div>
                
                <div className="package-content">
                  <p className="package-description">{pkg.description}</p>
                  
                  <div className="package-features">
                    {pkg.features && pkg.features.length > 0 ? pkg.features.map((feature) => (
                      <div key={feature.id} className="feature-item">
                        <span className="feature-icon">
                          {feature.postAt === 'standard' ? '📝' : 
                           feature.postAt === 'urgent' ? '🚨' : 
                           feature.postAt === 'premium' ? '⭐' : '🔍'}
                        </span>
                        <span>{feature.featureName}</span>
                        <span className="feature-limit">{feature.jobPostLimit} posts</span>
                      </div>
                    )) : (
                      <div className="no-features-placeholder">
                        <span className="placeholder-icon">📋</span>
                        <span>Package features will be displayed here</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="package-footer">
                  <button 
                    className="purchase-btn"
                    onClick={() => handlePurchasePackage(pkg)}
                    disabled={!isOnline || processing || !user?.id}
                    title={!isOnline ? "You're offline. Please reconnect to purchase." : 
                           !user?.id ? "User information not available" : ""}
                  >
                    Purchase Package
                  </button>
                </div>
              </div>
            )) : (
              <div className="no-packages-available">
                <div className="empty-state">
                  <span className="empty-icon">📦</span>
                  <h3>No packages available</h3>
                  <p>No service packages are currently available for purchase</p>
                  <button onClick={loadPackages} className="retry-btn">
                    🔄 Refresh
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : packagesLoading && !isFullPageLoading ? (
          <div className="section-placeholder">
            <div className="loading-spinner"></div>
            <p>Loading available packages...</p>
          </div>
        ) : null}
      </div>

      {/* Service Features Section */}
      <div className="billing-section">
        <div className="section-header">
          <h2 className="section-title">Service Features</h2>
          {featuresLoading && (
            <span className="section-loading">
              <div className="loading-spinner-small"></div>
              <span>Loading...</span>
            </span>
          )}
          {featuresError && (
            <button 
              onClick={loadServiceFeatures} 
              className="retry-btn small"
              title={featuresError}
            >
              Retry
            </button>
          )}
        </div>

        {featuresError && (
          <div className="error-banner section-error">
            <span className="error-icon">⚠️</span>
            <span>{featuresError}</span>
            <button onClick={loadServiceFeatures} className="retry-btn">Retry</button>
          </div>
        )}

        {!featuresLoading && serviceFeatures.length > 0 ? (
          <div className="features-grid">
            {serviceFeatures.map((feature) => (
              <div key={feature.id} className="feature-card">
                <div className="feature-card-header">
                  <span className="feature-icon">
                    {feature.postAt === 'standard' ? '📝' : 
                     feature.postAt === 'urgent' ? '🚨' : 
                     feature.postAt === 'premium' ? '⭐' : '🔍'}
                  </span>
                  <h3 className="feature-name">{feature.featureName}</h3>
                </div>
                <p className="feature-description">{feature.description}</p>
                {feature.jobPostLimit > 0 && (
                  <div className="feature-limit-info">
                    <span className="limit-icon">📊</span>
                    <span className="limit-text">Up to {feature.jobPostLimit} job posts</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (!featuresLoading && !featuresError) ? (
          <div className="no-features">
            <div className="empty-state">
              <span className="empty-icon">🔍</span>
              <h3>No service features available</h3>
              <p>Service features will appear here when available</p>
              <button onClick={loadServiceFeatures} className="retry-btn">
                🔄 Refresh
              </button>
            </div>
          </div>
        ) : featuresLoading ? (
          <div className="section-placeholder">
            <div className="loading-spinner"></div>
            <p>Loading service features...</p>
          </div>
        ) : null}
      </div>

      {/* Billing History */}
      <div className="billing-section">
        <h2 className="section-title">Billing History</h2>
        <div className="billing-history">
          {isOnline ? (
            <div className="coming-soon">
              <span className="coming-soon-icon">💳</span>
              <h3>Payment History</h3>
              <p>Full payment history integration coming soon</p>
            </div>
          ) : (
            <div className="offline-message">
              <span className="offline-icon">📶</span>
              <p>Payment history is not available while offline</p>
            </div>
          )}
        </div>
      </div>

      {/* Need Help Section */}
      <div className="billing-section help-section">
        <h2 className="section-title">Need Help?</h2>
        <div className="help-content">
          <p>If you have any questions about our packages or billing, please contact our support team.</p>
          <div className="help-actions">
            <button className="contact-btn" onClick={() => navigate('/contact')}>
              Contact Support
            </button>
            <button className="faq-btn" onClick={() => window.open('/faq', '_blank')}>
              View FAQs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;