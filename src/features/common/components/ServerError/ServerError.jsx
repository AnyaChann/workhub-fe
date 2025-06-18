import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ServerError.css';

const ServerError = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [autoRetry, setAutoRetry] = useState(true);

  useEffect(() => {
    if (!autoRetry) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          window.location.reload();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRetry]);

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleStopAutoRetry = () => {
    setAutoRetry(false);
  };

  return (
    <div className="server-error-page">
      <div className="server-error-container">
        <div className="server-error-header">
          <Link to="/" className="logo">WorkHub®</Link>
        </div>
        
        <div className="server-error-content">
          <div className="error-code">500</div>
          <h1 className="error-title">Server Error</h1>
          <p className="error-description">
            Oops! Something went wrong on our end. Our servers are experiencing 
            some technical difficulties. Please try again in a few moments.
          </p>
          
          <div className="error-details">
            <div className="error-info">
              <h3>What happened?</h3>
              <p>
                The server encountered an unexpected condition that prevented it 
                from fulfilling your request. This could be due to:
              </p>
              <ul>
                <li>Temporary server overload</li>
                <li>Database connection issues</li>
                <li>Scheduled maintenance</li>
                <li>Unexpected server error</li>
              </ul>
            </div>
          </div>

          {autoRetry && (
            <div className="auto-retry-section">
              <div className="countdown-circle">
                <span className="countdown-number">{countdown}</span>
              </div>
              <p className="auto-retry-text">
                Automatically retrying in {countdown} seconds...
              </p>
              <button onClick={handleStopAutoRetry} className="btn-stop-retry">
                Stop Auto Retry
              </button>
            </div>
          )}
          
          <div className="error-actions">
            <button onClick={handleRetry} className="btn-primary">
              <span className="btn-icon">🔄</span>
              Try Again
            </button>
            <button onClick={handleGoHome} className="btn-secondary">
              <span className="btn-icon">🏠</span>
              Go Home
            </button>
          </div>
          
          <div className="help-section">
            <p className="help-text">
              Still experiencing issues? Our technical team is here to help.
            </p>
            <div className="help-actions">
              <a href="mailto:tech@workhub.com?subject=Server Error Report" className="help-link">
                Report Issue
              </a>
              <span className="divider">|</span>
              <a href="https://status.workhub.com" target="_blank" rel="noopener noreferrer" className="help-link">
                Service Status
              </a>
              <span className="divider">|</span>
              <a href="mailto:support@workhub.com" className="help-link">
                Contact Support
              </a>
            </div>
          </div>
        </div>
        
        <div className="server-error-illustration">
          <div className="server-icon">🖥️</div>
          <div className="error-waves">
            <div className="wave wave-1"></div>
            <div className="wave wave-2"></div>
            <div className="wave wave-3"></div>
          </div>
          <div className="server-error-text">Internal Server Error</div>
        </div>
      </div>

      <div className="support-button">
        <button className="support-btn" onClick={() => window.open('mailto:tech@workhub.com')}>
          <span className="support-icon">🔧</span>
          Technical Support
        </button>
      </div>
    </div>
  );
};

export default ServerError;