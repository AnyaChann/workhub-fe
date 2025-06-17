import React from 'react';
import './HeroSection.css';

// Import images from assets
import candidate1 from '../../../../../../assets/images/candidate1.jpg';
import candidate2 from '../../../../../../assets/images/candidate2.jpg';
import candidate3 from '../../../../../../assets/images/candidate3.jpg';
import candidate4 from '../../../../../../assets/images/candidate4.jpg';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Quality candidates <br />
              <span className="highlight">in minutes</span>
            </h1>
            <p className="hero-description">
              Get a list of quality candidates in your inbox, from AI
            </p>
            <div className="hero-actions">
              <button className="btn-primary">Get 5 matches</button>
              <button className="btn-outline">Post a job</button>
            </div>
          </div>
          <div className="hero-images">
            <div className="hero-image hero-image-1" style={{ height: '91%' }}>
              <img src={candidate1} alt="Candidate 1" />
            </div>
            <div className="hero-image hero-image-2" style={{ height: '91%' }}>
              <img src={candidate2} alt="Candidate 2" />
            </div>
            <div className="hero-image hero-image-3">
              <img src={candidate3} alt="Candidate 3" />
            </div>
            <div className="hero-image hero-image-4">
              <img src={candidate4} alt="Candidate 4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;