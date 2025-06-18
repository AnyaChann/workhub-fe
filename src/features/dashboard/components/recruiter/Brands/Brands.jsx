import React from 'react';
import './Brands.css';

const Brands = () => {
  const handleAddNewBrand = () => {
    console.log('Add new brand');
  };

  return (
    <main className="dashboard-main">
      <div className="main-header">
        <h1 className="page-title">Brands</h1>
        
        <div className="page-controls">
          <button className="add-brand-btn" onClick={handleAddNewBrand}>
            + Add new brand
          </button>
        </div>
      </div>
      
      <div className="brands-content">
        <div className="empty-state">
          <div className="empty-icon">🏢</div>
          <h2 className="empty-title">You have no brands</h2>
          <p className="empty-description">
            Create your first brand to organize your job postings.
          </p>
          <button className="add-brand-btn" onClick={handleAddNewBrand}>
            + Add new brand
          </button>
        </div>
      </div>
    </main>
  );
};

export default Brands;