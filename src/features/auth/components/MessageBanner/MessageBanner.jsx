import React from 'react';
import './MessageBanner.css';

const MessageBanner = ({ 
  type = 'info', // success, error, warning, info
  message, 
  onClose,
  className = '',
  style = {}
}) => {
  if (!message) return null;

  const typeStyles = {
    success: {
      background: '#d4edda',
      color: '#155724',
      border: '1px solid #c3e6cb'
    },
    error: {
      background: '#f8d7da',
      color: '#721c24',
      border: '1px solid #f5c6cb'
    },
    warning: {
      background: '#fff3cd',
      color: '#856404',
      border: '1px solid #ffeaa7'
    },
    info: {
      background: '#d1ecf1',
      color: '#0c5460',
      border: '1px solid #bee5eb'
    }
  };

  return (
    <div 
      className={`message-banner ${type} ${className}`}
      style={{ ...typeStyles[type], ...style }}
    >
      <span className="message-text">{message}</span>
      {onClose && (
        <button 
          type="button" 
          className="close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default MessageBanner;