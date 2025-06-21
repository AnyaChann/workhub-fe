import React from 'react';
import './ErrorBanner.css';

const ErrorBanner = ({ 
  error, 
  onRetry, 
  showMockDataNotice = false 
}) => {
  return (
    <div className="error-banner">
      <div className="error-content">
        <div className="error-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2"/>
            <line x1="15" y1="9" x2="9" y2="15" stroke="#ef4444" strokeWidth="2"/>
            <line x1="9" y1="9" x2="15" y2="15" stroke="#ef4444" strokeWidth="2"/>
          </svg>
        </div>
        <div className="error-details">
          <h4>Không thể tải danh sách công việc</h4>
          <p>{error}</p>
        </div>
        <div className="error-actions">
          <button onClick={onRetry} className="retry-btn">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 4v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Thử lại
          </button>
        </div>
      </div>
      {showMockDataNotice && (
        <div className="mock-data-notice">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#f59e0b" strokeWidth="2"/>
            <line x1="12" y1="8" x2="12" y2="12" stroke="#f59e0b" strokeWidth="2"/>
            <line x1="12" y1="16" x2="12.01" y2="16" stroke="#f59e0b" strokeWidth="2"/>
          </svg>
          <span>Đang hiển thị dữ liệu mẫu để demo</span>
        </div>
      )}
    </div>
  );
};

export default ErrorBanner;