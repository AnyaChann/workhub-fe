import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-header">
          <Link to="/" className="logo">WorkHub®</Link>
        </div>
        
        <div className="not-found-content">
          <div className="error-code">404</div>
          <h1 className="error-title">Page not found</h1>
          <p className="error-description">
            Sorry, we couldn't find the page you're looking for. 
            The page might have been moved, deleted, or the URL might be incorrect.
          </p>
          
          <div className="error-actions">
            <Link to="/" className="btn-primary">
              Go to Homepage
            </Link>
            <button 
              onClick={() => window.history.back()} 
              className="btn-secondary"
            >
              Go Back
            </button>
          </div>
          
          <div className="help-section">
            <p className="help-text">
              Need help? Contact our support team
            </p>
            <div className="help-actions">
              <a href="mailto:support@WorkHub®.com" className="help-link">
                support@WorkHub®.com
              </a>
              <span className="divider">|</span>
              <a href="tel:+1234567890" className="help-link">
                (123) 456-7890
              </a>
            </div>
          </div>
        </div>
        
        <div className="not-found-illustration">
          <div className="illustration-404">
            <div className="circle circle-1"></div>
            <div className="circle circle-2"></div>
            <div className="circle circle-3"></div>
            <div className="number-4-left">4</div>
            <div className="number-0">0</div>
            <div className="number-4-right">4</div>
          </div>
        </div>
      </div>

      <div className="support-button">
        <button className="support-btn">
          <span className="support-icon">❓</span>
          Support
        </button>
      </div>
    </div>
  );
};

export default NotFound;