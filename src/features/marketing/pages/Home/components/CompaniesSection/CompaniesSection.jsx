import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CompaniesSection.css';

// Import company logos
import medrecruitLogo from '../../../../../../assets/images/placeholder.jpg';
import drakesLogo from '../../../../../../assets/images/placeholder.jpg';
import labourpowerLogo from '../../../../../../assets/images/placeholder.jpg';
import rdoLogo from '../../../../../../assets/images/placeholder.jpg';
import gsesLogo from '../../../../../../assets/images/placeholder.jpg';
import greenlightLogo from '../../../../../../assets/images/placeholder.jpg';
import commonryLogo from '../../../../../../assets/images/placeholder.jpg';
import healthscopeLogo from '../../../../../../assets/images/placeholder.jpg';
import forestryLogo from '../../../../../../assets/images/placeholder.jpg';
import whizdomLogo from '../../../../../../assets/images/placeholder.jpg';
import montessoriLogo from '../../../../../../assets/images/placeholder.jpg';
import opsmLogo from '../../../../../../assets/images/placeholder.jpg';
import strikeforceLogo from '../../../../../../assets/images/placeholder.jpg';
import sixdegreesLogo from '../../../../../../assets/images/placeholder.jpg';
import ivoryLogo from '../../../../../../assets/images/placeholder.jpg';
import randstadLogo from '../../../../../../assets/images/placeholder.jpg';

const CompaniesSection = () => {
  const topRowCompanies = [
    { name: 'Medrecruit', logo: medrecruitLogo, jobs: '3100 jobs' },
    { name: 'Drakes Supermarkets', logo: drakesLogo, jobs: '108 jobs' },
    { name: 'Labourpower Recruitment Services', logo: labourpowerLogo, jobs: '64 jobs' },
    { name: 'RDO Equipment', logo: rdoLogo, jobs: '18 jobs' },
    { name: 'GSES Global Skilled Employment Services', logo: gsesLogo, jobs: '36 jobs' },
    { name: 'Green Light', logo: greenlightLogo, jobs: '80 jobs' },
    { name: 'Commonry', logo: commonryLogo, jobs: '7 jobs' },
    { name: 'Healthscope', logo: healthscopeLogo, jobs: '473 jobs' }
  ];

  const bottomRowCompanies = [
    { name: 'Forestry Corporation of NSW', logo: forestryLogo, jobs: '14 jobs' },
    { name: 'Whizdom Recruitment', logo: whizdomLogo, jobs: '96 jobs' },
    { name: 'Montessori Academy', logo: montessoriLogo, jobs: '44 jobs' },
    { name: 'OPSM', logo: opsmLogo, jobs: '105 jobs' },
    { name: 'Strikeforce', logo: strikeforceLogo, jobs: '107 jobs' },
    { name: 'Six Degrees Executive', logo: sixdegreesLogo, jobs: '11 jobs' },
    { name: 'Ivory Group', logo: ivoryLogo, jobs: '112 jobs' },
    { name: 'Randstad', logo: randstadLogo, jobs: '779 jobs' }
  ];

  // Duplicate arrays for seamless loop
  const topRowDuplicated = [...topRowCompanies, ...topRowCompanies];
  const bottomRowDuplicated = [...bottomRowCompanies, ...bottomRowCompanies];

  return (
    <section className="companies-section">
      <div>
        <h2 className="companies-title">Companies currently hiring on WorkHub®</h2>

        <div className="companies-carousel">
          {/* Top row - slides left */}
          <div className="companies-row top-row">
            <div className="companies-track slide-left">
              {topRowDuplicated.map((company, index) => (
                <div key={index} className="company-card">
                  <div className="company-logo">
                    <img src={company.logo} alt={company.name} />
                  </div>
                  <div className="company-info">
                    <h3 className="company-name">{company.name}</h3>
                    <p className="company-jobs">{company.jobs}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom row - slides right */}
          <div className="companies-row bottom-row">
            <div className="companies-track slide-right">
              {bottomRowDuplicated.map((company, index) => (
                <div key={index} className="company-card">
                  <div className="company-logo">
                    <img src={company.logo} alt={company.name} />
                  </div>
                  <div className="company-info">
                    <h3 className="company-name">{company.name}</h3>
                    <p className="company-jobs">{company.jobs}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Link to="/register"><button className="btn-primary post-job-btn">Post a job</button></Link>

      </div>
    </section>
  );
};

export default CompaniesSection;