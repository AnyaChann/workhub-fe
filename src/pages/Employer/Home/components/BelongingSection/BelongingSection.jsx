import React from 'react';
import './BelongingSection.css';

const BelongingSection = () => {
  return (
    <section className="belonging-section">
      <div className="container">
        <div className="belonging-content">
          <div className="belonging-text">
            <h2 className="belonging-title">
              Invoke a sense of <span className="highlight">belonging</span> in your workplace
            </h2>
            <p className="belonging-description">
              Building diverse talent with our recruiting solutions across multiple offices to hire.
            </p>
            <p className="belonging-subtitle">
              Apply HR technology with other talent hiring opportunities.
            </p>
          </div>
          <div className="belonging-image">
            <img src="/api/placeholder/500/400" alt="Workplace belonging" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BelongingSection;