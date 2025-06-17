import React from 'react';
import './SupportButton.css';

const SupportButton = () => {
  return (
    <div className="support-floating">
      <button className="support-btn">
        <span className="support-icon">❓</span>
        Support
      </button>
    </div>
  );
};

export default SupportButton;