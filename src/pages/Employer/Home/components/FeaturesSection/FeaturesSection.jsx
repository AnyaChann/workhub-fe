import React from 'react';
import './FeaturesSection.css';

const FeaturesSection = () => {
  return (
    <section className="features-section">
      <div className="container">
        <div className="feature-item">
          <div className="feature-content">
            <h2 className="feature-title">
              Start hiring even before your first application arrives
            </h2>
            <p className="feature-description">
              The moment you job is live, we'll show you quality candidates that match your job based on skills, experience, and more.
            </p>
          </div>
          <div className="feature-image">
            <img src="/api/placeholder/400/300" alt="Hiring dashboard" />
          </div>
        </div>

        <div className="feature-item reverse">
          <div className="feature-content">
            <h2 className="feature-title">
              Connect with active job hunters ready for their next opportunity
            </h2>
            <p className="feature-description">
              We recommend job hunters for roles candidates that might be interested in working for your company.
            </p>
          </div>
          <div className="feature-image">
            <img src="/api/placeholder/400/300" alt="Job hunters" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;