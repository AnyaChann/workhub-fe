import React from 'react';
import './AISection.css';
import aiCandidateImg from '../../../../../assets/images/ai-candidate.jpg';

// Icon SVGs
const icons = {
  discovery: (
    <svg width="48" height="48" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="#E6FAF5" />
      <path d="M24 16a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm2.12 2.12 1.77 1.77-6.36 6.36-1.77-1.77 6.36-6.36Z" fill="#00D4AA" />
    </svg>
  ),
  match: (
    <svg width="48" height="48" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="#E6FAF5" />
      <text x="50%" y="50%" fontSize="20" fill="#00D4AA" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">100</text>
    </svg>
  ),
  alert: (
    <svg width="48" height="48" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="#E6FAF5" />
      <path d="M24 16c-1.1 0-2 .9-2 2v6l2 2 2-2v-6c0-1.1-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="#00D4AA" />
    </svg>
  ),
  branding: (
    <svg width="48" height="48" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="#E6FAF5" />
      <rect x="18" y="20" width="12" height="8" rx="1" fill="none" stroke="#00D4AA" strokeWidth="1.5" />
      <circle cx="21" cy="24" r="1" fill="#00D4AA" />
      <path d="M24 22h4M24 24h4M24 26h2" stroke="#00D4AA" strokeWidth="1" />
    </svg>
  ),
};

const features = [
  {
    icon: icons.discovery,
    title: 'Discovery',
    desc: "Candidates are recommended jobs based on their profile, placing your job in front of the right candidate even when they aren't searching.",
  },
  {
    icon: icons.match,
    title: 'Match scores',
    desc: 'Users can quickly evaluate how well a job suits them based on their skills, education, work experience and more.',
  },
  {
    icon: icons.alert,
    title: 'Job alerts & notifications',
    desc: 'Our system works hard around the clock to keep candidates informed of new opportunities. Your job is promoted to the right candidates on and off CareerOne.',
  },
  {
    icon: icons.branding,
    title: 'Employer branding',
    desc: 'Our suite of job ad branding features helps businesses to put their best foot forward and showcase themselves as an employer of choice.',
  },
];

const AISection = () => (
  <section className="ai-section">
    <div className="container">
      <h2 className="ai-section-title">
        Our <span className="highlight">AI-powered</span> candidate experience leads to better hiring outcomes
      </h2>
      
      <div className="ai-content">
        <div className="ai-image">
          <img src={aiCandidateImg} alt="AI candidate experience" />
        </div>
        
        <div className="ai-features-grid">
          {features.map((feature, index) => (
            <div key={index} className="ai-feature-card">
              <div className="ai-feature-icon">{feature.icon}</div>
              <h3 className="ai-feature-title">{feature.title}</h3>
              <p className="ai-feature-description">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default AISection;