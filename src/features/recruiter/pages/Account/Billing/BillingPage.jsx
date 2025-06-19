import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../../core/contexts/AuthContext';
import { servicePackageService } from '../../../services/servicePackageService';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import './BillingPage.css';

const BillingPage = () => {
  const [packages, setPackages] = useState([]);
  const [userPackages, setUserPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user } = useAuth();

  useEffect(() => {
    loadBillingData();
  }, [user]);

  const loadBillingData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('💳 Loading billing data...');
      
      // Load available packages and user's current packages
      const [availablePackages, currentPackages] = await Promise.all([
        servicePackageService.getAllPackages(),
        user?.id ? servicePackageService.getUserPackages(user.id) : Promise.resolve([])
      ]);
      
      console.log('📦 Available packages:', availablePackages);
      console.log('� User packages:', currentPackages);
      
      setPackages(Array.isArray(availablePackages) ? availablePackages : []);
      setUserPackages(Array.isArray(currentPackages) ? currentPackages : []);
      
    } catch (err) {
      console.error('❌ Error loading billing data:', err);
      setError(err.message || 'Failed to load billing information');
      
      // Fallback mock data
      setPackages([
        {
          id: 1,
          name: 'Basic Package',
          description: '5 job postings per month',
          price: 99,
          currency: 'USD',
          jobPostings: 5,
          featured: false
        },
        {
          id: 2,
          name: 'Professional Package',
          description: '20 job postings per month + featured listings',
          price: 299,
          currency: 'USD',
          jobPostings: 20,
          featured: true
        },
        {
          id: 3,
          name: 'Enterprise Package',
          description: 'Unlimited job postings + premium support',
          price: 999,
          currency: 'USD',
          jobPostings: -1, // unlimited
          featured: true
        }
      ]);
      
      setUserPackages([
        {
          id: 1,
          packageName: 'Professional Package',
          jobPostingsRemaining: 15,
          jobPostingsTotal: 20,
          expiryDate: '2024-07-20',
          status: 'active'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchasePackage = async (packageItem) => {
    console.log('💰 Purchase package:', packageItem);
    
    // Here you would integrate with payment service
    alert(`Purchase ${packageItem.name} for $${packageItem.price} - Payment integration coming soon!`);
  };

  const handleRenewPackage = async (userPackage) => {
    console.log('🔄 Renew package:', userPackage);
    alert('Package renewal - Payment integration coming soon!');
  };

  if (loading) {
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
      />

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
          <button onClick={loadBillingData} className="retry-btn">Retry</button>
        </div>
      )}

      {/* Current Packages */}
      <div className="billing-section">
        <h2 className="section-title">Your Current Packages</h2>
        {userPackages.length > 0 ? (
          <div className="current-packages">
            {userPackages.map((pkg) => (
              <div key={pkg.id} className="current-package-card">
                <div className="package-header">
                  <h3 className="package-name">{pkg.packageName}</h3>
                  <span className={`package-status ${pkg.status}`}>
                    {pkg.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="package-usage">
                  <div className="usage-item">
                    <span className="usage-label">Job Postings</span>
                    <span className="usage-value">
                      {pkg.jobPostingsRemaining} / {pkg.jobPostingsTotal} remaining
                    </span>
                  </div>
                  
                  <div className="usage-progress">
                    <div 
                      className="usage-bar"
                      style={{
                        width: `${(pkg.jobPostingsRemaining / pkg.jobPostingsTotal) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="package-footer">
                  <span className="expiry-date">
                    Expires: {new Date(pkg.expiryDate).toLocaleDateString()}
                  </span>
                  <button 
                    className="renew-btn"
                    onClick={() => handleRenewPackage(pkg)}
                  >
                    Renew Package
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-packages">
            <div className="empty-state">
              <span className="empty-icon">📦</span>
              <h3>No active packages</h3>
              <p>Purchase a package below to start posting jobs</p>
            </div>
          </div>
        )}
      </div>

      {/* Available Packages */}
      <div className="billing-section">
        <h2 className="section-title">Available Packages</h2>
        <div className="packages-grid">
          {packages.map((pkg) => (
            <div key={pkg.id} className="package-card">
              <div className="package-header">
                <h3 className="package-name">{pkg.name}</h3>
                <div className="package-price">
                  <span className="price-amount">${pkg.price}</span>
                  <span className="price-period">/month</span>
                </div>
              </div>
              
              <div className="package-content">
                <p className="package-description">{pkg.description}</p>
                
                <div className="package-features">
                  <div className="feature-item">
                    <span className="feature-icon">📋</span>
                    <span>
                      {pkg.jobPostings === -1 ? 'Unlimited' : pkg.jobPostings} job postings
                    </span>
                  </div>
                  
                  {pkg.featured && (
                    <div className="feature-item">
                      <span className="feature-icon">⭐</span>
                      <span>Featured job listings</span>
                    </div>
                  )}
                  
                  <div className="feature-item">
                    <span className="feature-icon">📊</span>
                    <span>Application analytics</span>
                  </div>
                  
                  <div className="feature-item">
                    <span className="feature-icon">💬</span>
                    <span>Email support</span>
                  </div>
                </div>
              </div>
              
              <div className="package-footer">
                <button 
                  className="purchase-btn"
                  onClick={() => handlePurchasePackage(pkg)}
                >
                  Purchase Package
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <div className="billing-section">
        <h2 className="section-title">Billing History</h2>
        <div className="billing-history">
          <div className="history-item">
            <div className="history-date">Dec 20, 2024</div>
            <div className="history-description">Professional Package - Monthly</div>
            <div className="history-amount">$299.00</div>
            <div className="history-status success">Paid</div>
          </div>
          
          <div className="history-item">
            <div className="history-date">Nov 20, 2024</div>
            <div className="history-description">Professional Package - Monthly</div>
            <div className="history-amount">$299.00</div>
            <div className="history-status success">Paid</div>
          </div>
          
          <div className="coming-soon">
            <p>💳 Payment history integration coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;