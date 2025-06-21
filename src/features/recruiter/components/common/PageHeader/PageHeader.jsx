import React from 'react';
import './PageHeader.css';

const PageHeader = ({
  title,
  subtitle,
  onCreateJob,
  showStats = false,
  stats = [],
  additionalActions = null,
  breadcrumbs = null
}) => {
  return (
    <div className="page-header">
      <div className="title-section">
        <h1 className="page-title">{title}</h1>
        {subtitle && (
          <p className="page-subtitle">{subtitle}</p>
        )}
      </div>
      {/* Right side - Page Title and Actions */}
      <div className="header-right">
        {onCreateJob && (
          <button
            className="create-job-btn primary"
            onClick={onCreateJob}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" />
              <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span className="btn-text">Tạo tin tuyển dụng</span>
          </button>
        )}


        <div className="actions-section">

          {/* {showStats && stats.length > 0 && (
            <div className="header-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-value" style={{ color: stat.color }}>
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          )} */}

          <div className="header-actions">
            {/* Additional Actions */}
            {additionalActions}

            {/* Create Job Button */}

          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;