import React from 'react';
import './CompaniesSection.css';

const CompaniesSection = () => {
  const companies = [
    { name: 'Company 1', logo: '/api/placeholder/100/60' },
    { name: 'Company 2', logo: '/api/placeholder/100/60' },
    { name: 'Company 3', logo: '/api/placeholder/100/60' },
    { name: 'Company 4', logo: '/api/placeholder/100/60' },
    { name: 'Company 5', logo: '/api/placeholder/100/60' },
    { name: 'Company 6', logo: '/api/placeholder/100/60' },
    { name: 'Company 7', logo: '/api/placeholder/100/60' },
    { name: 'Company 8', logo: '/api/placeholder/100/60' },
    { name: 'Company 9', logo: '/api/placeholder/100/60' },
    { name: 'Company 10', logo: '/api/placeholder/100/60' },
    { name: 'Company 11', logo: '/api/placeholder/100/60' },
    { name: 'Company 12', logo: '/api/placeholder/100/60' }
  ];

  return (
    <section className="companies-section">
      <div className="container">
        <h2 className="companies-title">Companies currently hiring on WorkHub</h2>
        <div className="companies-grid">
          {companies.map((company, index) => (
            <div key={index} className="company-card">
              <img src={company.logo} alt={company.name} />
            </div>
          ))}
        </div>
        <button className="btn-primary">Explore Jobs</button>
      </div>
    </section>
  );
};

export default CompaniesSection;