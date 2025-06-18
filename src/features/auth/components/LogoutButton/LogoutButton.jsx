import React from 'react';
import { useLogout } from '../../hooks/useLogout';
import { ButtonLoadingSpinner } from '../../../../shared/components/LoadingSpinner/LoadingSpinner';
import './LogoutButton.css';

const LogoutButton = ({ 
  variant = 'default', // 'default' | 'icon' | 'text' | 'danger'
  size = 'medium', // 'small' | 'medium' | 'large'
  showConfirmation = true,
  redirectTo = '/login',
  children,
  className = '',
  ...props 
}) => {
  const { logout, isLoggingOut } = useLogout();

  const handleLogout = async () => {
    await logout({
      redirectTo,
      showConfirmation,
      confirmationMessage: 'Are you sure you want to log out?'
    });
  };

  const getButtonClass = () => {
    const baseClass = 'logout-button';
    const variantClass = `logout-button--${variant}`;
    const sizeClass = `logout-button--${size}`;
    
    return `${baseClass} ${variantClass} ${sizeClass} ${className}`.trim();
  };

  const getButtonContent = () => {
    if (isLoggingOut) {
      return <ButtonLoadingSpinner message="Logging out..." size="small" />;
    }

    if (children) {
      return children;
    }

    switch (variant) {
      case 'icon':
        return '🚪';
      case 'text':
        return 'Sign out';
      default:
        return (
          <>
            <span className="logout-icon">🚪</span>
            <span className="logout-text">Sign out</span>
          </>
        );
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={getButtonClass()}
      title="Sign out"
      {...props}
    >
      {getButtonContent()}
    </button>
  );
};

export default LogoutButton;