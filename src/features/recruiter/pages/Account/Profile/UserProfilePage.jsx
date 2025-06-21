import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../../core/contexts/AuthContext';
import { userService } from '../../../services/userService';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import PageFooter from '../../../components/common/PageFooter/PageFooter';
import ErrorBanner from '../../../components/common/ErrorBanner/ErrorBanner';
import NotificationToast from '../../../components/common/NotificationToast/NotificationToast';
import PopUp from '../../../components/common/PopUp/PopUp';
import { PageLoadingSpinner, InlineLoadingSpinner } from '../../../../../shared/components/LoadingSpinner/LoadingSpinner';
import EditProfileModal from '../../../components/Modal/EditProfileModal/EditProfileModal';
import ChangePasswordModal from '../../../components/Modal/ChangePasswordModal/ChangePasswordModal';
import './UserProfilePage.css';

const UserProfilePage = () => {
  const { user, fullname, email, getUserAvatar, phone, refreshUserData } = useAuth();
  const navigate = useNavigate();

  // State management
  const [profileData, setProfileData] = useState({
    id: '',
    avatar: '',
    created_at: '',
    email: '',
    fullname: '',
    phone: '',
    role: '',
    status: ''
  });

  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Modal states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, [user]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const loadUserProfile = async () => {
    if (!user?.id) {
      console.log('No user found, redirecting to login');
      return navigate('/login');
    }

    setProfileLoading(true);
    setError(null);

    try {
      console.log('👤 Loading user profile...');

      // Initialize data from AuthContext
      const initialData = {
        id: user.id,
        avatar: getUserAvatar() || '',
        created_at: user.created_at || user.createdAt || new Date().toISOString(),
        email: email || '',
        fullname: fullname || '',
        phone: phone || '',
        role: user.role || '',
        status: user.status || 'active'
      };

      setProfileData(initialData);

      // Fetch additional data from API
      try {
        console.log('📡 Fetching additional profile data from API...');
        const profileResponse = await userService.getCurrentUserProfile();

        if (profileResponse) {
          console.log('✅ Additional profile data loaded:', profileResponse);

          setProfileData(prev => ({
            ...prev,
            ...profileResponse,
            avatar: profileResponse.avatar || prev.avatar
          }));
        }
      } catch (apiError) {
        console.log('⚠️ API profile load failed, using auth data:', apiError);
      }

      setLastUpdated(new Date());

    } catch (error) {
      console.error('❌ Error loading profile:', error);
      setError('Failed to load profile data. Please refresh the page.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleRetry = async () => {
    console.log('🔄 Retrying to load profile...');
    await loadUserProfile();
  };

  const handleEditProfile = () => {
    setShowProfileModal(true);
    setError(null);
  };

  const handleChangePassword = () => {
    setShowPasswordModal(true);
    setError(null);
  };

  const handleSaveProfile = async (newData) => {
    setLoading(true);
    setError(null);

    try {
      const apiProfileData = {
        fullname: newData.fullname,
        email: newData.email,
        phone: newData.phone
      };

      console.log('📝 Updating profile with data:', apiProfileData);

      // Update profile via API
      const updatedProfile = await userService.updateUserProfile(apiProfileData);

      // Update local state
      setProfileData(prev => ({
        ...prev,
        ...updatedProfile
      }));

      // Handle avatar upload separately if provided
      if (newData.avatarFile) {
        try {
          console.log('📷 Uploading new avatar:', newData.avatarFile.name);
          const avatarResponse = await userService.uploadAvatar(newData.avatarFile);

          if (avatarResponse?.avatarUrl) {
            console.log('✅ Avatar uploaded successfully:', avatarResponse.avatarUrl);
            setProfileData(prev => ({
              ...prev,
              avatar: avatarResponse.avatarUrl
            }));
          }
        } catch (avatarError) {
          console.error('❌ Avatar upload failed:', avatarError);
          showNotification('Profile updated but avatar upload failed. Please try again later.', 'warning');
        }
      }

      showNotification('Profile updated successfully!');
      setShowProfileModal(false);
      setLastUpdated(new Date());

      // Refresh AuthContext data
      if (typeof refreshUserData === 'function') {
        try {
          await refreshUserData();
        } catch (refreshError) {
          console.error('Failed to refresh user data:', refreshError);
        }
      }

    } catch (error) {
      console.error('❌ Save profile error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile';
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (passwordData) => {
    setLoading(true);
    setError(null);

    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('New password and confirmation do not match');
      }

      console.log('🔐 Changing password...');

      await userService.changePassword({
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      showNotification('Password changed successfully!');
      setShowPasswordModal(false);
      setLastUpdated(new Date());

    } catch (error) {
      console.error('❌ Password change error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to change password. Please check your current password.';
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setShowConfirmLogout(true);
  };

  const confirmLogout = () => {
    // Implement logout logic here
    navigate('/login');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';

    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return { class: 'status-active', label: 'ACTIVE', icon: '✅' };
      case 'inactive':
        return { class: 'status-inactive', label: 'INACTIVE', icon: '⏸️' };
      case 'suspended':
        return { class: 'status-suspended', label: 'SUSPENDED', icon: '🚫' };
      case 'pending':
        return { class: 'status-pending', label: 'PENDING', icon: '⏳' };
      default:
        return { class: 'status-unknown', label: 'UNKNOWN', icon: '❓' };
    }
  };

  const getRoleInfo = (role) => {
    switch (role?.toLowerCase()) {
      case 'recruiter':
        return { class: 'role-recruiter', label: 'RECRUITER', icon: '👨‍💼' };
      case 'admin':
        return { class: 'role-admin', label: 'ADMIN', icon: '👑' };
      case 'user':
        return { class: 'role-user', label: 'USER', icon: '👤' };
      default:
        return { class: 'role-unknown', label: 'UNKNOWN', icon: '❓' };
    }
  };

  const statusInfo = getStatusInfo(profileData.status);
  const roleInfo = getRoleInfo(profileData.role);

  // Footer quick actions
  const footerQuickActions = [
    {
      label: 'Edit Profile',
      icon: '✏️',
      onClick: handleEditProfile,
      variant: 'primary',
      disabled: loading,
      tooltip: 'Edit your profile information'
    },
    {
      label: 'Change Password',
      icon: '🔐',
      onClick: handleChangePassword,
      variant: 'secondary',
      disabled: loading,
      tooltip: 'Update your account password'
    },
    {
      label: 'Refresh',
      icon: '🔄',
      onClick: handleRetry,
      variant: 'secondary',
      disabled: profileLoading,
      loading: profileLoading,
      tooltip: profileLoading ? 'Loading...' : 'Refresh profile data'
    },
    {
      label: 'Logout',
      icon: '🚪',
      onClick: handleLogout,
      variant: 'danger',
      tooltip: 'Sign out of your account'
    }
  ];

  // Footer stats
  const footerStats = [
    { label: 'Member Since', value: formatDate(profileData.created_at), color: '#3b82f6' },
    { label: 'Account Status', value: statusInfo.label, color: statusInfo.class === 'status-active' ? '#10b981' : '#f59e0b' },
    { label: 'Account Type', value: roleInfo.label, color: '#8b5cf6' },
    { label: 'Email Verified', value: user?.emailVerified ? 'Yes' : 'No', color: user?.emailVerified ? '#10b981' : '#ef4444' }
  ];

  // Logout confirmation
  const logoutIcon = (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="16,17 21,12 16,7" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="21" y1="12" x2="9" y2="12" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const logoutActions = (
    <>
      <button 
        className="btn-secondary"
        onClick={() => setShowConfirmLogout(false)}
      >
        Cancel
      </button>
      <button 
        className="btn-danger"
        onClick={confirmLogout}
      >
        Logout
      </button>
    </>
  );

  if (profileLoading) {
    return <PageLoadingSpinner message="Loading your profile..." />;
  }

  return (
    <div className="user-profile-page">
      <PageHeader
        title="User Profile"
        subtitle="Manage your personal information and account settings"
        showBackButton={false}
        showStats={true}
        stats={[
          { label: 'Status', value: statusInfo.label, color: statusInfo.class === 'status-active' ? '#10b981' : '#f59e0b' },
          { label: 'Role', value: roleInfo.label, color: '#8b5cf6' },
          { label: 'Email Verified', value: user?.emailVerified ? 'Yes' : 'No', color: user?.emailVerified ? '#10b981' : '#ef4444' }
        ]}
        breadcrumbs={[
          { label: 'Dashboard', href: '/recruiter/dashboard' },
          { label: 'Account', href: '/recruiter/dashboard/account' },
          { label: 'Profile' }
        ]}
      />

      {/* Error Banner */}
      {error && (
        <ErrorBanner
          error={error}
          onRetry={handleRetry}
          showMockDataNotice={false}
        />
      )}

      <div className="profile-content">
        <div className="profile-sections">
          {/* Personal Details Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="section-icon">👤</span>
                Personal Details
              </h2>
              <button
                className="edit-btn"
                onClick={handleEditProfile}
                disabled={loading}
              >
                {loading ? <InlineLoadingSpinner size="small" /> : <>✏️ Edit Profile</>}
              </button>
            </div>

            <div className="section-content">
              {/* Profile Picture */}
              <div className="profile-picture-section">
                <div className="picture-container">
                  <label className="picture-label">PROFILE PICTURE</label>
                  <div className="profile-picture">
                    {profileData.avatar ? (
                      <img
                        src={profileData.avatar}
                        alt="Profile"
                        className="profile-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className="default-avatar"
                      style={{
                        display: profileData.avatar ? 'none' : 'flex'
                      }}
                    >
                      <span className="avatar-icon">👤</span>
                    </div>
                  </div>
                  <div className="picture-help">
                    Click 'Edit Profile' to change your profile picture
                  </div>
                </div>
              </div>

              {/* Profile Fields */}
              <div className="profile-fields">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">FULL NAME</label>
                    <div className="form-value">{profileData.fullname || 'Not provided'}</div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">USER ID</label>
                    <div className="form-value user-id">#{profileData.id}</div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">EMAIL ADDRESS</label>
                    <div className="form-value email-value">
                      <span className="email-text">{profileData.email}</span>
                      {user?.emailVerified === false && (
                        <span className="verification-badge unverified">
                          ❌ Not verified
                        </span>
                      )}
                      {user?.emailVerified === true && (
                        <span className="verification-badge verified">
                          ✅ Verified
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">PHONE NUMBER</label>
                    <div className="form-value">{profileData.phone || 'Not provided'}</div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">ACCOUNT STATUS</label>
                    <div className="form-value">
                      <span className={`status-badge ${statusInfo.class}`}>
                        {statusInfo.icon} {statusInfo.label}
                      </span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">ACCOUNT TYPE</label>
                    <div className="form-value">
                      <span className={`role-badge ${roleInfo.class}`}>
                        {roleInfo.icon} {roleInfo.label}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">MEMBER SINCE</label>
                    <div className="form-value member-since">
                      {formatDate(profileData.created_at)}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">LAST UPDATED</label>
                    <div className="form-value last-updated">
                      {lastUpdated ? formatDate(lastUpdated) : 'Not available'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="section-icon">🔐</span>
                Security & Privacy
              </h2>
            </div>

            <div className="section-content">
              {/* Password Management */}
              <div className="security-section">
                <h3 className="security-subtitle">
                  <span className="security-icon">🔑</span>
                  Password Management
                </h3>
                
                <div className="password-option" onClick={handleChangePassword}>
                  <div className="password-info">
                    <span className="password-text">Change Password</span>
                    <span className="password-subtitle">Update your account password for better security</span>
                  </div>
                  <span className="arrow-icon">›</span>
                </div>
              </div>

              {/* Security Information */}
              <div className="security-section">
                <h3 className="security-subtitle">
                  <span className="security-icon">🛡️</span>
                  Security Information
                </h3>
                
                <div className="security-info">
                  <div className="security-item">
                    <span className="security-label">Last password change:</span>
                    <span className="security-value">
                      {formatDate(user?.lastPasswordChange || 'Unknown')}
                    </span>
                  </div>

                  <div className="security-item">
                    <span className="security-label">Two-factor authentication:</span>
                    <span className="security-value">
                      <span className="status-badge status-disabled">
                        🔒 Not enabled
                      </span>
                      <span className="coming-soon">(Coming soon)</span>
                    </span>
                  </div>

                  <div className="security-item">
                    <span className="security-label">Last login:</span>
                    <span className="security-value">
                      {formatDate(user?.lastLoginAt || 'Not available')}
                    </span>
                  </div>

                  <div className="security-item">
                    <span className="security-label">Login sessions:</span>
                    <span className="security-value">
                      <span className="session-count">1 active session</span>
                      <span className="coming-soon">(Management coming soon)</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Tips */}
              <div className="security-section">
                <h3 className="security-subtitle">
                  <span className="security-icon">💡</span>
                  Security Tips
                </h3>
                
                <div className="security-tips">
                  <ul className="tips-list">
                    <li>
                      <span className="tip-icon">🔐</span>
                      Use a strong password with at least 8 characters
                    </li>
                    <li>
                      <span className="tip-icon">🔤</span>
                      Include numbers, symbols, and both uppercase and lowercase letters
                    </li>
                    <li>
                      <span className="tip-icon">🚫</span>
                      Don't reuse passwords from other websites
                    </li>
                    <li>
                      <span className="tip-icon">📱</span>
                      Enable two-factor authentication when available
                    </li>
                    <li>
                      <span className="tip-icon">⚠️</span>
                      Log out from shared or public computers
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Account Actions Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="section-icon">⚙️</span>
                Account Actions
              </h2>
            </div>

            <div className="section-content">
              <div className="account-actions">
                <div className="action-item">
                  <div className="action-info">
                    <h4 className="action-title">
                      <span className="action-icon">📥</span>
                      Export Account Data
                    </h4>
                    <p className="action-description">
                      Download a copy of your account data and activity history
                    </p>
                  </div>
                  <button className="action-btn secondary" disabled>
                    <span>📥</span> Export Data
                    <span className="coming-soon-badge">Soon</span>
                  </button>
                </div>

                <div className="action-item">
                  <div className="action-info">
                    <h4 className="action-title">
                      <span className="action-icon">🗑️</span>
                      Delete Account
                    </h4>
                    <p className="action-description">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <button className="action-btn danger" disabled>
                    <span>🗑️</span> Delete Account
                    <span className="coming-soon-badge">Soon</span>
                  </button>
                </div>

                <div className="action-item">
                  <div className="action-info">
                    <h4 className="action-title">
                      <span className="action-icon">🚪</span>
                      Sign Out
                    </h4>
                    <p className="action-description">
                      Sign out of your account on this device
                    </p>
                  </div>
                  <button className="action-btn danger" onClick={handleLogout}>
                    <span>🚪</span> Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      {/* <PageFooter
        showFooterInfo={true}
        showQuickActions={true}
        quickActions={footerQuickActions}
        showLastUpdated={true}
        lastUpdated={lastUpdated}
        showStats={true}
        stats={footerStats}
        variant="detailed"
        className={`profile-footer ${loading ? 'loading' : ''} ${error ? 'error' : 'success'}`}
      /> */}

      {/* Modals */}
      <EditProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profileData={profileData}
        onSave={handleSaveProfile}
        loading={loading}
      />

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSave={handlePasswordChange}
        loading={loading}
      />

      {/* Logout Confirmation */}
      <PopUp
        isOpen={showConfirmLogout}
        onClose={() => setShowConfirmLogout(false)}
        title="Confirm Sign Out"
        type="warning"
        icon={logoutIcon}
        actions={logoutActions}
        size="medium"
      >
        <p>Are you sure you want to sign out of your account?</p>
        <p>You will need to sign in again to access your account.</p>
      </PopUp>

      {/* Notification Toast */}
      <NotificationToast
        notification={notification}
        onClose={() => setNotification(null)}
      />
    </div>
  );
};

export default UserProfilePage;