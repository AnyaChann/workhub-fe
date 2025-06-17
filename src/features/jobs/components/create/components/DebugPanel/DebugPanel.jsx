import React, { useState } from 'react';
import './DebugPanel.css';

const DebugPanel = ({ 
  formData, 
  errors, 
  isValid, 
  onAutoFill, 
  onClear, 
  onClose 
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const getValidationStatus = () => {
    const requiredFields = [
      'title', 'location', 'description', 'category_id', 
      'position_id', 'type_id', 'experience', 'deadline'
    ];
    
    const completedFields = requiredFields.filter(field => {
      if (field === 'description') {
        return Array.isArray(formData[field]) && 
               formData[field].some(block => 
                 block.children && 
                 block.children.some(child => child.text && child.text.trim())
               );
      }
      return formData[field] && formData[field].toString().trim();
    });

    return {
      completed: completedFields.length,
      total: requiredFields.length,
      percentage: Math.round((completedFields.length / requiredFields.length) * 100)
    };
  };

  const validationStatus = getValidationStatus();

  return (
    <div className={`debug-panels ${isMinimized ? 'minimized' : ''}`}>
      <div className="debug-header">
        <div className="debug-title">
          <span className="debug-icon">🐛</span>
          <span>Debug Panel</span>
          <span className="debug-env">(Development)</span>
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
          {/* Quick Actions */}
          <div className="debug-section">
            <h4>Quick Actions</h4>
            <div className="debug-actions">
              <button 
                className="debug-action-btn auto-fill-btn"
                onClick={onAutoFill}
              >
                🎯 Auto Fill Form
              </button>
              <button 
                className="debug-action-btn clear-btn"
                onClick={onClear}
              >
                🗑️ Clear Form
              </button>
            </div>
          </div>

          {/* Form Status */}
          <div className="debug-section">
            <h4>Form Status</h4>
            <div className="form-status">
              <div className="status-item">
                <span className="status-label">Valid:</span>
                <span className={`status-value ${isValid ? 'valid' : 'invalid'}`}>
                  {isValid ? '✅ Yes' : '❌ No'}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Progress:</span>
                <span className="status-value">
                  {validationStatus.completed}/{validationStatus.total} ({validationStatus.percentage}%)
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Errors:</span>
                <span className={`status-value ${Object.keys(errors).length > 0 ? 'error' : 'success'}`}>
                  {Object.keys(errors).length}
                </span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${validationStatus.percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Current Errors */}
          {Object.keys(errors).length > 0 && (
            <div className="debug-section">
              <h4>Current Errors</h4>
              <div className="errors-list">
                {Object.entries(errors).map(([field, error]) => (
                  <div key={field} className="error-item">
                    <span className="error-field">{field}:</span>
                    <span className="error-message">{error}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Data Preview */}
          <div className="debug-section">
            <h4>Form Data Preview</h4>
            <div className="form-data-preview">
              <div className="data-item">
                <span className="data-label">Title:</span>
                <span className="data-value">{formData.title || 'Empty'}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Location:</span>
                <span className="data-value">{formData.location || 'Empty'}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Category:</span>
                <span className="data-value">{formData.category_id || 'Not selected'}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Position:</span>
                <span className="data-value">{formData.position_id || 'Not selected'}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Job Type:</span>
                <span className="data-value">{formData.type_id || 'Not selected'}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Experience:</span>
                <span className="data-value">{formData.experience || 'Not selected'}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Salary Range:</span>
                <span className="data-value">
                  {formData.salary_range.min && formData.salary_range.max 
                    ? `$${formData.salary_range.min} - $${formData.salary_range.max}` 
                    : 'Not set'
                  }
                </span>
              </div>
              <div className="data-item">
                <span className="data-label">Deadline:</span>
                <span className="data-value">{formData.deadline || 'Not set'}</span>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugPanel;