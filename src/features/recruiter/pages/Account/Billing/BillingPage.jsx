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
        // Đôi khi API trả về object thay vì array
        setPackages([availablePackages]);
      } else {
        console.warn('⚠️ No packages found or invalid format, using fallback');
        setPackages([
          {
            id: 1,
            name: "Gói Tiêu chuẩn",
            price: 499000,
            features: [
              {
                id: 1,
                featureName: "Đăng tin tiêu chuẩn",
                description: "Đăng tin tuyển dụng tiêu chuẩn",
                postAt: "standard",
                jobPostLimit: 5
              }
            ],
            duration: 30,
            description: "Gói bao gồm 5 tin tuyển dụng tiêu chuẩn.",
            status: "active"
          },
          {
            id: 2,
            name: "Gói Chuyên nghiệp",
            price: 999000,
            features: [
              {
                id: 2,
                featureName: "Đăng tin tiêu chuẩn",
                description: "Đăng tin tuyển dụng tiêu chuẩn",
                postAt: "standard",
                jobPostLimit: 10
              },
              {
                id: 3,
                featureName: "Đăng tin khẩn",
                description: "Đăng tin tuyển dụng khẩn",
                postAt: "urgent",
                jobPostLimit: 3
              }
            ],
            duration: 30,
            description: "Gói bao gồm 10 tin tiêu chuẩn và 3 tin khẩn.",
            status: "active"
          },
          {
            id: 3,
            name: "Gói Doanh nghiệp",
            price: 1999000,
            features: [
              {
                id: 4,
                featureName: "Đăng tin tiêu chuẩn",
                description: "Đăng tin tuyển dụng tiêu chuẩn",
                postAt: "standard",
                jobPostLimit: 20
              },
              {
                id: 5,
                featureName: "Đăng tin khẩn",
                description: "Đăng tin tuyển dụng khẩn",
                postAt: "urgent",
                jobPostLimit: 10
              },
              {
                id: 6,
                featureName: "Đăng tin premium",
                description: "Đăng tin tuyển dụng premium",
                postAt: "premium",
                jobPostLimit: 5
              }
            ],
            duration: 30,
            description: "Gói cao cấp cho doanh nghiệp lớn.",
            status: "active"
          }
        ]);
      }
    } catch (err) {
      console.error('❌ Error loading packages:', err);
      setPackagesError(err.message || 'Failed to load available packages');
      
      // Set fallback data
      setPackages([
        {
          id: 1,
          name: "Gói Tiêu chuẩn",
          price: 499000,
          features: [
            {
              id: 1,
              featureName: "Đăng tin tiêu chuẩn",
              description: "Đăng tin tuyển dụng tiêu chuẩn",
              postAt: "standard",
              jobPostLimit: 5
            }
          ],
          duration: 30,
          description: "Gói bao gồm 5 tin tuyển dụng tiêu chuẩn.",
          status: "active"
        },
        {
          id: 2,
          name: "Gói Chuyên nghiệp",
          price: 999000,
          features: [
            {
              id: 2,
              featureName: "Đăng tin tiêu chuẩn",
              description: "Đăng tin tuyển dụng tiêu chuẩn",
              postAt: "standard",
              jobPostLimit: 10
            },
            {
              id: 3,
              featureName: "Đăng tin khẩn",
              description: "Đăng tin tuyển dụng khẩn",
              postAt: "urgent",
              jobPostLimit: 3
            }
          ],
          duration: 30,
          description: "Gói bao gồm 10 tin tiêu chuẩn và 3 tin khẩn.",
          status: "active"
        }
      ]);
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
            {packages.map((pkg) => (
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
                    {pkg.features && pkg.features.map((feature) => (
                      <div key={feature.id} className="feature-item">
                        <span className="feature-icon">
                          {feature.postAt === 'standard' ? '📝' : 
                           feature.postAt === 'urgent' ? '🚨' : 
                           feature.postAt === 'premium' ? '⭐' : '🔍'}
                        </span>
                        <span>{feature.featureName}</span>
                        <span className="feature-limit">{feature.jobPostLimit} posts</span>
                      </div>
                    ))}
                    
                    {(!pkg.features || pkg.features.length === 0) && (
                      <>
                        <div className="feature-item">
                          <span className="feature-icon">📋</span>
                          <span>
                            {getTotalJobPostLimit(pkg) || pkg.jobPostings || 5} job postings
                          </span>
                        </div>
                        
                        <div className="feature-item">
                          <span className="feature-icon">📊</span>
                          <span>Application analytics</span>
                        </div>
                        
                        <div className="feature-item">
                          <span className="feature-icon">💬</span>
                          <span>Email support</span>
                        </div>
                      </>
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
            ))}
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
            <>
              <div className="history-item">
                <div className="history-date">{new Date().toLocaleDateString('vi-VN')}</div>
                <div className="history-description">Test Payment - Demo</div>
                <div className="history-amount">{formatPrice(499000)}</div>
                <div className="history-status success">Paid</div>
              </div>
              
              <div className="history-item">
                <div className="history-date">{new Date(Date.now() - 30*24*60*60*1000).toLocaleDateString('vi-VN')}</div>
                <div className="history-description">Test Renewal - Demo</div>
                <div className="history-amount">{formatPrice(499000)}</div>
                <div className="history-status success">Paid</div>
              </div>
            </>
          ) : (
            <div className="offline-message">
              <span className="offline-icon">📶</span>
              <p>Payment history is not available while offline</p>
            </div>
          )}
          
          <div className="coming-soon">
            <p>💳 Full payment history integration coming soon</p>
          </div>
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