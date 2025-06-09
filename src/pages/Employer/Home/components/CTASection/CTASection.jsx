import React, { useState } from 'react';
import './CTASection.css';

const CTASection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-content">
          <h2 className="cta-title">Discover your next hire today</h2>
          
          <div className="cta-form">
            <h3 className="cta-form-title">Try out all features FREE for 14 days</h3>
            <p className="cta-form-subtitle">
              Ready to hire better candidates? Get started with our free trial.
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="cta-form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="cta-input"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Work email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="cta-input"
                  required
                />
              </div>
              <div className="cta-form-group">
                <input
                  type="text"
                  name="company"
                  placeholder="Company name"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="cta-input"
                  required
                />
                <button type="submit" className="btn-primary">
                  Start hiring today
                </button>
              </div>
            </form>
            
            <div className="cta-features">
              <div className="cta-feature">No credit card required</div>
              <div className="cta-feature">Free 14-day trial</div>
              <div className="cta-feature">Cancel anytime</div>
            </div>
          </div>
          
          <div className="cta-bottom">
            <p>Got a high volume of job listings?</p>
            <a href="#" className="highlight">Contact sales</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;