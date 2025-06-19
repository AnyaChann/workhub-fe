import React from 'react';
import './PageHeader.css';

const PageHeader = ({
  title,
  showOnlyMyJobs,
  onToggleMyJobs,
  showDebug,
  onToggleDebug,
  onCreateJob,
  additionalControls = null
}) => {
  return (
    <div className="main-header">
      <h1 className="page-title">{title}</h1>

      <div className="page-controls">
        {/* Debug Toggle Button - Only show in development */}
        {process.env.NODE_ENV === 'development' && (
          <button
            className={`debug-toggle-btn ${showDebug ? 'debug-active' : ''}`}
            onClick={() => onToggleDebug(!showDebug)}
            title="Toggle Debug Panel (Ctrl+D) - Development Only"
          >
            🐛 Debug {showDebug ? '(ON)' : '(OFF)'}
          </button>
        )}

        {/* Additional controls if provided */}
        {additionalControls}

        <label className="toggle-switch">
          <input 
            type="checkbox" 
            checked={showOnlyMyJobs}
            onChange={(e) => onToggleMyJobs(e.target.checked)}
          />
          <span className="toggle-slider"></span>
          <span className="toggle-label">Only jobs posted by me</span>
        </label>
      </div>
    </div>
  );
};

export default PageHeader;