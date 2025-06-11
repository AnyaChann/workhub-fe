import React, { useState } from 'react';
import './CompanyCultureSection.css';

// Import images from assets
// import cultureImg1 from '../../../../../assets/images/culture-office1.jpg';
// import cultureImg2 from '../../../../../assets/images/culture-office3.jpg';
// import cultureImg3 from '../../../../../assets/images/culture-office2.jpg';
import cultureImg4 from '../../../../../assets/images/culture-video.jpg';

const CompanyCultureSection = () => {
  const [activeTab, setActiveTab] = useState('logo');

  const tabs = [
    { id: 'logo', label: 'Logo', icon: '🏢' },
    { id: 'images', label: 'Images', icon: '🖼️' },
    { id: 'video', label: 'Video', icon: '▶️' }
  ];

  return (
    <section className="company-culture-section">
      <div className="container">
        <div className="culture-header">
          <h2 className="culture-title">Showcase your company culture</h2>
          <p className="culture-subtitle">
            Tell your story with free employer branding included with every job
          </p>

          {/* <div className="culture-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div> */}
        </div>
        

        <div className="culture-showcase">
          {/* Left side - Job posting mockup */}
          <div className="job-post-mockup">
            <div className="mockup-header">
              <span className="post-date">Posted today</span>
              {/* <button className="save-btn">
                <span className="save-icon">⭐</span>
                Save
              </button> */}
            </div>

            <div className="job-content">
              <div className="job-title-section">
                <div className="company-logo">
                  <span className="logo-placeholder">B</span>
                </div>
                <div className="job-details">
                  <div className="job-title-bar"></div>
                  <div className="job-subtitle-bar"></div>
                  <div className="match-score">
                    <span className="match-dot"></span>
                    <span className="match-text">87% match</span>
                  </div>
                </div>
              </div>

              <div className="job-description">
                <div className="desc-line"></div>
                <div className="desc-line short"></div>
                <div className="desc-line"></div>
                <div className="desc-line medium"></div>
              </div>

              <div className="gallery-item">
                <img src={cultureImg4} alt="Team collaboration" />
              </div>
            </div>
          </div>

          {/* Right side - Mobile app mockup */}
          <div className="mobile-mockup">
            <div className="mobile-header">
              <div className="mobile-controls">
                <span className="mobile-dot red"></span>
                <span className="mobile-dot yellow"></span>
                <span className="mobile-dot green"></span>
              </div>
            </div>

            <div className="mobile-content">
              <div className="mobile-job-card">
                <div className="mobile-match">
                  <span className="match-dot green"></span>
                  <span>87% match</span>
                </div>
                <div className="mobile-company-logo">B</div>
                <div className="mobile-job-info">
                  <div className="mobile-job-title"></div>
                  <div className="mobile-job-subtitle"></div>
                </div>
              </div>
            </div>
          </div>
          

          {/* Bottom - Media gallery */}
          {/* <div className="media-gallery">
            <div className="gallery-item large">
              <img src={cultureImg1} alt="Office space" />
            </div>
            <div className="gallery-item">
              <img src={cultureImg2} alt="Team meeting" />
              <div className="video-overlay">
                <div className="play-button">▶️</div>
              </div>
            </div>
            <div className="gallery-item">
              <img src={cultureImg3} alt="Workspace" />
            </div>
            <div className="gallery-item">
              <img src={cultureImg4} alt="Team collaboration" />
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default CompanyCultureSection;