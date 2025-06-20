import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../core/contexts/AuthContext';
import ROUTES from '../../../../../core/routing/routeConstants';
import './RecruiterAccountDropdown.css';

const AccountDropdown = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  const { 
    user, 
    logout, 
    fullname, 
    email, 
    getUserAvatar, 
    userRole 
  } = useAuth();

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
    console.log('Navigate to Account Settings');
    // ✅ Sử dụng route từ ROUTES
    navigate(ROUTES.RECRUITER.ACCOUNT.SETTINGS);
    setIsOpen(false);
  };

  const handleManageUsers = () => {
    console.log('Navigate to Manage Users');
    // ✅ Sử dụng route từ ROUTES
    navigate(ROUTES.RECRUITER.ACCOUNT.TEAM);
    setIsOpen(false);
  };

  const handleInventory = () => {
    console.log('Navigate to Inventory/Packages');
    // ✅ Sử dụng route từ ROUTES
    navigate(ROUTES.RECRUITER.ACCOUNT.BILLING);
    setIsOpen(false);
  };

  const handleProfile = () => {
    console.log('Navigate to User Profile');
    // ✅ Sử dụng route từ ROUTES
    navigate(ROUTES.RECRUITER.ACCOUNT.PROFILE);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    console.log('Logging out...');
    setIsLoading(true);
    setIsOpen(false);
    
    try {
      await logout();
      // Navigate to home page after logout
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      // Still navigate to home even if logout API fails
      navigate('/', { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  // Get user avatar or fallback
  const userAvatar = getUserAvatar();
  const displayName = fullname || email || 'User';
  const companyName = user?.companyName || user?.company?.name || 'Not set';

  return (
    <div className="account-dropdown" ref={dropdownRef}>
      <button
        className="user-btn"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        title={`${displayName} (${userRole?.toUpperCase()})`}
      >
        <div className="user-avatar">
          {userAvatar ? (
            <img 
              src={userAvatar} 
              alt={displayName}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
          ) : null}
          <span 
            style={{ 
              display: userAvatar ? 'none' : 'block',
              fontSize: '1.2rem'
            }}
          >
            👤
          </span>
        </div>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>
          {isLoading ? '⏳' : '▼'}
        </span>
      </button>

      {isOpen && (
        <div className="account-dropdown-menu">
          <div className="company-section">
            <div className="user-info">
              <div className="user-name">{displayName}</div>
              <div className="user-email">{email}</div>
            </div>
            {/* <div className="company-name">{companyName.toUpperCase()}</div> */}
            <div className="user-role">{userRole?.toUpperCase()}</div>
          </div>

          <div className="dropdown-divider"></div>

          <button className="account-dropdown-item" onClick={handleAccount}>
            <span className="item-icon">⚙️</span>
            <span className="item-text">Account Settings</span>
            <span className="item-shortcut">Company</span>
          </button>

          {/* <button className="account-dropdown-item" onClick={handleManageUsers}>
            <span className="item-icon">👥</span>
            <span className="item-text">Manage Users</span>
            <span className="item-shortcut">Team</span>
          </button> */}

          <button className="account-dropdown-item" onClick={handleInventory}>
            <span className="item-icon">📦</span>
            <span className="item-text">Packages & Billing</span>
            <span className="item-shortcut">Billing</span>
          </button>

          <div className="dropdown-divider"></div>

          <button className="account-dropdown-item" onClick={handleProfile}>
            <span className="item-icon">🏢</span>
            <span className="item-text">User Profile</span>
            <span className="item-shortcut">Profile</span>
          </button>

          <button 
            className="account-dropdown-item logout" 
            onClick={handleLogout}
            disabled={isLoading}
          >
            <span className="item-icon">{isLoading ? '⏳' : '🚪'}</span>
            <span className="item-text">{isLoading ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountDropdown;