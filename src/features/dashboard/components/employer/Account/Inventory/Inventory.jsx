import React, { useState } from 'react';
import './Inventory.css';

const Inventory = () => {
  const [jobPackages] = useState([
    {
      id: 1,
      type: 'Standard jobs',
      icon: '📄',
      quantity: 0,
      description: 'Basic job posting with standard visibility'
    },
    {
      id: 2,
      type: 'Plus jobs',
      icon: '📄',
      quantity: 0,
      description: 'Enhanced job posting with better visibility'
    },
    {
      id: 3,
      type: 'Premium jobs',
      icon: '📄',
      quantity: 0,
      description: 'Premium job posting with maximum visibility'
    }
  ]);

  const handlePostJob = (packageType) => {
    console.log(`Post ${packageType} job clicked`);
    // TODO: Navigate to job posting form with selected package type
  };

  const handleBuyPackage = (packageType) => {
    console.log(`Buy ${packageType} package clicked`);
    // TODO: Navigate to payment/purchase flow
  };

  const getPackageTypeClass = (type) => {
    return type.toLowerCase().replace(' ', '-');
  };

  const getBuyButtonText = (type) => {
    const packageName = type.split(' ')[0].toLowerCase();
    return `Buy ${packageName}`;
  };

  return (
    <main className="dashboard-main">
      <div className="main-header">
        <h1 className="page-title">Inventory</h1>
      </div>
      
      <div className="inventory-content">
        <div className="inventory-section">
          <h2 className="section-title">Jobs</h2>
          
          <div className="job-packages">
            {jobPackages.map((jobPackage) => (
              <div key={jobPackage.id} className="job-package-card">
                <div className="package-info">
                  <div className="package-header">
                    <div className="package-icon">
                      {jobPackage.icon}
                    </div>
                    <div className="package-details">
                      <h3 className="package-title">{jobPackage.type}</h3>
                      <p className="package-description">{jobPackage.description}</p>
                    </div>
                  </div>
                  
                  <div className="package-quantity">
                    <span className="quantity-number">{jobPackage.quantity}</span>
                    <span className="quantity-label">available</span>
                  </div>
                </div>
                
                <div className="package-actions">
                  <button 
                    className="post-job-btn"
                    onClick={() => handlePostJob(jobPackage.type)}
                    disabled={jobPackage.quantity === 0}
                  >
                    <span className="plus-icon">+</span>
                    Post job
                  </button>
                  
                  <button 
                    className={`buy-package-btn ${getPackageTypeClass(jobPackage.type)}`}
                    onClick={() => handleBuyPackage(jobPackage.type)}
                  >
                    {getBuyButtonText(jobPackage.type)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Future sections can be added here */}
        {/* 
        <div className="inventory-section">
          <h2 className="section-title">Credits</h2>
          // Credits section content
        </div>
        
        <div className="inventory-section">
          <h2 className="section-title">Add-ons</h2>
          // Add-ons section content
        </div>
        */}
      </div>
    </main>
  );
};

export default Inventory;