import React from 'react';
import './CompanyCultureSection.css';

const CompanyCultureSection = () => {
  const mediaItems = [
    { type: 'image', src: '/api/placeholder/300/200', alt: 'Company culture 1' },
    { type: 'image', src: '/api/placeholder/300/200', alt: 'Company culture 2' },
    { type: 'image', src: '/api/placeholder/300/200', alt: 'Company culture 3' },
    { type: 'image', src: '/api/placeholder/300/200', alt: 'Company culture 4' },
    { type: 'image', src: '/api/placeholder/300/200', alt: 'Company culture 5' },
    { type: 'image', src: '/api/placeholder/300/200', alt: 'Company culture 6' }
  ];

  return (
    <section className="company-culture-section">
      <div className="container">
        <div className="culture-header">
          <h2 className="culture-title">Showcase your company culture</h2>
          <p className="culture-subtitle">
            Tell your story and show employer branding with employee content
          </p>
          <div className="culture-tabs">
            <button className="tab active">Images</button>
            <button className="tab">Videos</button>
            <button className="tab">Stories</button>
          </div>
        </div>
        
        <div className="culture-media-grid">
          {mediaItems.map((item, index) => (
            <div key={index} className="culture-media-item">
              <img src={item.src} alt={item.alt} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyCultureSection;