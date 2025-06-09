import React, { useState, useRef, useEffect } from 'react';
import './HelpDropdown.css';

const HelpDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleContactSales = () => {
    console.log('Contact sales');
    setIsOpen(false);
  };

  const handleSupport = () => {
    console.log('Support');
    setIsOpen(false);
  };

  const handlePricing = () => {
    console.log('Pricing');
    setIsOpen(false);
  };

  const handleHiringAdvice = () => {
    console.log('Hiring advice');
    setIsOpen(false);
  };

  return (
    <div className="help-dropdown" ref={dropdownRef}>
      <button 
        className="help-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="help-icon">🎧</span>
        Help
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="help-dropdown-menu">
          <button className="help-dropdown-item" onClick={handleContactSales}>
            <span className="item-text">Contact sales</span>
            <span className="external-icon">↗</span>
          </button>
          
          <button className="help-dropdown-item" onClick={handleSupport}>
            <span className="item-text">Support</span>
            <span className="external-icon">↗</span>
          </button>
          
          <button className="help-dropdown-item" onClick={handlePricing}>
            <span className="item-text">Pricing</span>
            <span className="external-icon">↗</span>
          </button>
          
          <button className="help-dropdown-item" onClick={handleHiringAdvice}>
            <span className="item-text">Hiring advice</span>
            <span className="external-icon">↗</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default HelpDropdown;