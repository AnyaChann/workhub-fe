import React, { useState, useRef, useEffect } from 'react';
import './AccountDropdown.css';

const AccountDropdown = ({ onNavigate }) => {
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

  const handleAccount = () => {
    if (onNavigate) {
      onNavigate('account');
    }
    setIsOpen(false);
  };

  const handleManageUsers = () => {
    if (onNavigate) {
      onNavigate('manage-users');
    }
    setIsOpen(false);
  };

  const handleInventory = () => {
    if (onNavigate) {
      onNavigate('inventory');
    }
    setIsOpen(false);
  };

  const handleProfile = () => {
    if (onNavigate) {
      onNavigate('profile');
    }
    setIsOpen(false);
  };

  const handleLogout = () => {
    console.log('Logout');
    setIsOpen(false);
    // TODO: Implement logout logic
  };

  return (
    <div className="account-dropdown" ref={dropdownRef}>
      <button
        className="user-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="user-avatar">
          <span>👤</span>
        </div>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="account-dropdown-menu">
          <div className="company-section">
            <div className="company-name">ABCOMPANY</div>
          </div>

          <div className="dropdown-divider"></div>

          <button className="account-dropdown-item" onClick={handleAccount}>
            <span className="item-icon">⚙️</span>
            <span className="item-text">Account</span>
          </button>

          <button className="account-dropdown-item" onClick={handleManageUsers}>
            <span className="item-icon">👥</span>
            <span className="item-text">Manage users</span>
          </button>

          <button className="account-dropdown-item" onClick={handleInventory}>
            <span className="item-icon">📦</span>
            <span className="item-text">Inventory</span>
          </button>

          <div className="dropdown-divider"></div>

          <button className="account-dropdown-item" onClick={handleProfile}>
            <span className="item-icon">👤</span>
            <span className="item-text">Profile</span>
          </button>

          <button className="account-dropdown-item logout" onClick={handleLogout}>
            <span className="item-icon">🚪</span>
            <span className="item-text">Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountDropdown;