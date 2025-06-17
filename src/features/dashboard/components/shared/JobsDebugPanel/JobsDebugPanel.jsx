import React, { useState, useEffect } from 'react';
import './JobsDebugPanel.css';
const JobsDebugPanel = ({
  currentPage,
  jobs,
  onGenerateMockData,
  onClearJobs,
  onAddSampleJob,
  onClose
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [mockCount, setMockCount] = useState(5);

  // Add info about debug panel being disabled by default
  useEffect(() => {
    console.log('🐛 Debug Panel activated for:', currentPage);
    console.log('📝 Note: Debug Panel is disabled by default in production');
  }, [currentPage]);

  const getPageStats = () => {
    const activeJobs = jobs.filter(job => job.status === 'active').length;
    const draftJobs = jobs.filter(job => job.status === 'draft').length;
    const expiredJobs = jobs.filter(job => job.status === 'expired').length;

    return {
      total: jobs.length,
      active: activeJobs,
      draft: draftJobs,
      expired: expiredJobs
    };
  };

  const stats = getPageStats();

  const handleGenerateMockData = (type, count) => {
    if (onGenerateMockData) {
      onGenerateMockData(type, count);
    }
  };

  const mockDataTemplates = {
    active: {
      icon: '💼',
      label: 'Active Jobs',
      count: mockCount,
      action: () => handleGenerateMockData('active', mockCount)
    },
    draft: {
      icon: '📝',
      label: 'Draft Jobs',
      count: mockCount,
      action: () => handleGenerateMockData('draft', mockCount)
    },
    expired: {
      icon: '⏰',
      label: 'Expired Jobs',
      count: mockCount,
      action: () => handleGenerateMockData('expired', mockCount)
    },
    mixed: {
      icon: '🎯',
      label: 'Mixed Jobs',
      count: mockCount,
      action: () => handleGenerateMockData('mixed', mockCount)
    }
  };

  return (
    <div className={`jobs-debug-panel ${isMinimized ? 'minimized' : ''}`}>
      <div className="debug-header">
        <div className="debug-title">
          <span className="debug-icon">🐛</span>
          <span>Jobs Debug Panel</span>
          <span className="debug-page">({currentPage})</span>
          <span className="debug-env">DEV</span>
        </div>
        <div className="debug-controls">
          <button
            className="debug-btn minimize-btn"
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? '📈' : '📉'}
          </button>
          <button
            className="debug-btn close-btn"
            onClick={onClose}
            title="Close Debug Panel"
          >
            ✕
          </button>
        </div>
      </div>


      {!isMinimized && (
        <div className="debug-content">
          {/* Environment Warning */}
          <div className="debug-section">
            <div className="env-warning">
              <span className="warning-icon">⚠️</span>
              <span className="warning-text">
                Development Mode Only - This panel is disabled in production
              </span>
            </div>
          </div>
          {/* Current Stats */}
          <div className="debug-section">
            <h4>Current Statistics</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Total:</span>
                <span className="stat-value">{stats.total}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Active:</span>
                <span className="stat-value active">{stats.active}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Draft:</span>
                <span className="stat-value draft">{stats.draft}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Expired:</span>
                <span className="stat-value expired">{stats.expired}</span>
              </div>
            </div>
          </div>

          {/* Mock Data Count Selector */}
          <div className="debug-section">
            <h4>Generate Mock Data</h4>
            <div className="mock-count-selector">
              <label htmlFor="mock-count">Number of jobs:</label>
              <input
                id="mock-count"
                type="number"
                min="1"
                max="50"
                value={mockCount}
                onChange={(e) => setMockCount(parseInt(e.target.value) || 1)}
                className="count-input"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="debug-section">
            <h4>Quick Actions</h4>
            <div className="mock-actions">
              {Object.entries(mockDataTemplates).map(([key, template]) => (
                <button
                  key={key}
                  className={`mock-action-btn ${key}-btn`}
                  onClick={template.action}
                  title={`Generate ${template.count} ${template.label.toLowerCase()}`}
                >
                  {template.icon} {template.label} ({template.count})
                </button>
              ))}
            </div>
          </div>

          {/* Single Job Actions */}
          <div className="debug-section">
            <h4>Single Job Actions</h4>
            <div className="single-actions">
              <button
                className="single-action-btn active-single"
                onClick={() => onAddSampleJob?.('active')}
              >
                + Add Active Job
              </button>
              <button
                className="single-action-btn draft-single"
                onClick={() => onAddSampleJob?.('draft')}
              >
                + Add Draft Job
              </button>
              <button
                className="single-action-btn expired-single"
                onClick={() => onAddSampleJob?.('expired')}
              >
                + Add Expired Job
              </button>
            </div>
          </div>

          {/* Utilities */}
          <div className="debug-section">
            <h4>Utilities</h4>
            <div className="utility-actions">
              <button
                className="utility-btn clear-btn"
                onClick={onClearJobs}
              >
                🗑️ Clear All Jobs
              </button>
              <button
                className="utility-btn refresh-btn"
                onClick={() => window.location.reload()}
              >
                🔄 Refresh Page
              </button>
            </div>
          </div>

          {/* Current Page Info */}
          <div className="debug-section">
            <h4>Page Information</h4>
            <div className="page-info">
              <div className="info-item">
                <span className="info-label">Current Page:</span>
                <span className="info-value">{currentPage}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Environment:</span>
                <span className="info-value">{process.env.NODE_ENV}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Timestamp:</span>
                <span className="info-value">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="debug-section">
            <h4>Keyboard Shortcuts</h4>
            <div className="shortcuts-list">
              <div className="shortcut-item">
                <kbd>Ctrl + D</kbd>
                <span>Toggle Debug Panel</span>
              </div>
              <div className="shortcut-item">
                <kbd>Ctrl + G</kbd>
                <span>Generate Mixed Data</span>
              </div>
              <div className="shortcut-item">
                <kbd>Ctrl + C</kbd>
                <span>Clear All Jobs</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsDebugPanel;