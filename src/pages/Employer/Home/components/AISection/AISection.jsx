import React from 'react';
import './AISection.css';

const AISection = () => {
  const features = [
    {
      icon: '🎯',
      title: 'Sourcing',
      description: 'Traditional job sourcing is the past, we give you direct access to the best candidates.'
    },
    {
      icon: '🔍',
      title: 'Match quality',
      description: 'Candidates are matched based on skills, experience, salary, experience and more.'
    },
    {
      icon: '✅',
      title: 'AI-backed notifications',
      description: 'Our sophisticated ML system generates alerts for new candidates, promotions and more.'
    },
    {
      icon: '📊',
      title: 'Effortless screening',
      description: 'Take care of pre-screening, location matching, availability checks and much more.'
    }
  ];

  return (
    <section className="ai-section">
      <div className="container">
        <div className="ai-content">
          <div className="ai-text">
            <h2 className="ai-title">
              Our <span className="highlight">AI-powered</span> candidate experience leads to better hiring outcomes
            </h2>
            <div className="ai-features">
              {features.map((feature, index) => (
                <div key={index} className="ai-feature">
                  <div className="ai-feature-icon">{feature.icon}</div>
                  <div className="ai-feature-content">
                    <h3 className="ai-feature-title">{feature.title}</h3>
                    <p className="ai-feature-description">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="ai-image">
            <img src="/api/placeholder/400/500" alt="AI candidate experience" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AISection;