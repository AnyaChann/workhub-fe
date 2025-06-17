import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  message = 'Loading...', 
  variant = 'default',
  fullPage = false,
  className = ''
}) => {
  const getSpinnerSize = () => {
    switch (size) {
      case 'small': return 24;
      case 'large': return 56;
      case 'xlarge': return 72;
      default: return 40; // medium
    }
  };

  const spinnerSize = getSpinnerSize();

  const spinnerElement = (
    <div className={`loading-spinner-container ${variant} ${className}`}>
      <div 
        className={`loading-spinner ${size}`}
        style={{
          width: `${spinnerSize}px`,
          height: `${spinnerSize}px`
        }}
      />
      {message && (
        <div className="loading-message">
          {message}
        </div>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="loading-fullpage-overlay">
        {spinnerElement}
      </div>
    );
  }

  return spinnerElement;
};

// Preset components for common use cases
export const PageLoadingSpinner = ({ message = 'Loading page...' }) => (
  <LoadingSpinner 
    size="large" 
    message={message} 
    variant="page" 
    fullPage={true}
  />
);

export const InlineLoadingSpinner = ({ message = 'Loading...', size = 'small' }) => (
  <LoadingSpinner 
    size={size} 
    message={message} 
    variant="inline"
  />
);

export const ButtonLoadingSpinner = ({ message = 'Processing...' }) => (
  <LoadingSpinner 
    size="small" 
    message={message} 
    variant="button"
  />
);

export const JobsLoadingSpinner = ({ message = 'Loading jobs...' }) => (
  <LoadingSpinner 
    size="medium" 
    message={message} 
    variant="jobs"
  />
);

export default LoadingSpinner;