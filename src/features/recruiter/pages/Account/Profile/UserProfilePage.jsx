import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../../core/contexts/AuthContext';
import { userService } from '../../../services/userService';
import InlineLoadingSpinner from '../../../../../shared/components/LoadingSpinner/LoadingSpinner';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import './UserProfilePage.css';
import EditProfileModal from '../../../components/Modal/EditProfileModal/EditProfileModal';
import ChangePasswordModal from '../../../components/Modal/ChangePasswordModal/ChangePasswordModal';
import { useNavigate } from 'react-router-dom';

const UserProfilePage = () => {
  const { user, fullname, email, getUserAvatar, phone, refreshUserData } = useAuth();
  const navigate = useNavigate();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Cập nhật cấu trúc dữ liệu người dùng theo API
  const [profileData, setProfileData] = useState({
    id: '',
    avatar: '',
    avatarUrl: '',
    created_at: '',
    email: '',
    fullname: '',
    phone: '',
    role: '',
    status: ''
  });

  // Load user data when component mounts
  useEffect(() => {
    loadUserProfile();
  }, [user]);

  // ✅ Cleanup blob URLs when component unmounts
  useEffect(() => {
    return () => {
      if (profileData.avatarUrl && profileData.avatarUrl.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(profileData.avatarUrl);
        } catch (error) {
          console.warn('⚠️ Failed to cleanup avatar blob URL on unmount:', error);
        }
      }
    };
  }, [profileData.avatarUrl]);

  // ✅ Load fresh avatar from API
  const loadFreshAvatar = async () => {
    setAvatarLoading(true);
    try {
      console.log('🔄 Loading fresh avatar from API...');
      const avatarUrl = await userService.getUserAvatar();
      
      if (avatarUrl) {
        console.log('✅ Fresh avatar loaded:', avatarUrl);
        setProfileData(prev => ({
          ...prev,
          avatarUrl: avatarUrl
        }));
      } else {
        console.log('ℹ️ No avatar found in API');
        // Keep existing avatar or use fallback
        const cachedAvatar = localStorage.getItem('user_avatar');
        if (!cachedAvatar || cachedAvatar.startsWith('blob:')) {
          // Remove invalid blob URL
          localStorage.removeItem('user_avatar');
          setProfileData(prev => ({
            ...prev,
            avatarUrl: ''
          }));
        }
      }
    } catch (error) {
      console.error('❌ Failed to load fresh avatar:', error);
      // Remove invalid cached avatar
      localStorage.removeItem('user_avatar');
      setProfileData(prev => ({
        ...prev,
        avatarUrl: ''
      }));
    } finally {
      setAvatarLoading(false);
    }
  };

  const loadUserProfile = async () => {
    if (!user?.id) {
      console.log('No user found, redirecting to login');
      return navigate('/login');
    }

    setProfileLoading(true);
    setError(null);

    try {
      // ✅ Initialize data from AuthContext first
      const authProfileData = {
        id: user.id,
        avatar: '',
        avatarUrl: '',
        created_at: user.created_at || user.createdAt || new Date().toISOString(),
        email: email || '',
        fullname: fullname || '',
        phone: phone || '',
        role: user.role || '',
        status: user.status || 'active'
      };

      setProfileData(authProfileData);

      // ✅ Load fresh avatar from API immediately after setting profile data
      await loadFreshAvatar();

      // ✅ Try to load additional data from API (optional enhancement)
      try {
        console.log('🔄 Attempting to load additional profile data from API...');
        const apiProfileData = await userService.getCurrentUserProfile();

        if (apiProfileData && Object.keys(apiProfileData).length > 0) {
          console.log('✅ Additional profile data loaded from API:', apiProfileData);

          // Merge API data with auth data (API data takes precedence)
          setProfileData(prev => ({
            ...prev,
            ...apiProfileData,
            // Keep auth data as fallback for critical fields
            id: prev.id,
            role: prev.role,
            // Use fresh avatar if we have it, otherwise use API avatar
            avatarUrl: prev.avatarUrl || apiProfileData.avatarUrl || ''
          }));
        } else {
          console.log('ℹ️ No additional data from API, using auth data');
        }
      } catch (apiError) {
        console.log('ℹ️ API profile load failed, using auth data only:', apiError.message);
        // This is OK - we have auth data as fallback
      }
    } catch (error) {
      console.error('❌ Error in profile loading process:', error);
      setError('Failed to load some profile data. Using available information.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleEditProfile = () => {
    setShowProfileModal(true);
    setError(null);
    setSuccess(null);
  };

  const handleChangePassword = () => {
    setShowPasswordModal(true);
    setError(null);
    setSuccess(null);
  };

  // ✅ Enhanced handleSaveProfile with better result handling
  const handleSaveProfile = async (newData) => {
    console.log('💾 UserProfilePage: Starting profile save process...');
    console.log('📋 New data:', {
      fullname: newData.fullname,
      email: newData.email,
      phone: newData.phone,
      hasAvatarFile: !!newData.avatarFile,
      avatarFileName: newData.avatarFile?.name
    });

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let result;

      // ✅ Use the new unified method that handles both profile and avatar
      if (newData.avatarFile) {
        console.log('🖼️ Updating profile with avatar...');
        // Update profile with avatar in single API call
        result = await userService.updateProfileWithAvatar({
          fullname: newData.fullname,
          email: newData.email,
          phone: newData.phone
        }, newData.avatarFile);

        console.log('✅ Profile and avatar updated successfully:', result);
        
        // ✅ Safely update profile data - ensure result is an object
        setProfileData(prev => ({
          ...prev,
          fullname: newData.fullname,
          email: newData.email,
          phone: newData.phone,
          // Handle both object and string responses
          avatar: (result && typeof result === 'object') ? result.avatar : null,
          avatarUrl: (result && typeof result === 'object') ? (result.avatarUrl || prev.avatarUrl) : prev.avatarUrl
        }));
      } else {
        console.log('📝 Updating profile only (no avatar)...');
        // Update profile only (no avatar change)
        result = await userService.updateUserProfile({
          fullname: newData.fullname,
          email: newData.email,
          phone: newData.phone
        });

        console.log('✅ Profile updated successfully:', result);
        
        // ✅ Safely update profile data
        setProfileData(prev => ({
          ...prev,
          fullname: newData.fullname,
          email: newData.email,
          phone: newData.phone
        }));
      }

      // ✅ Extract success message
      const successMessage = (result && typeof result === 'object' && result.message) 
        ? result.message 
        : 'Profile updated successfully!';
      
      setSuccess(successMessage);
      setShowProfileModal(false);

      // Refresh AuthContext data
      if (typeof refreshUserData === 'function') {
        try {
          console.log('🔄 Refreshing AuthContext data...');
          await refreshUserData();
          console.log('✅ AuthContext data refreshed');
        } catch (refreshError) {
          console.error('⚠️ Failed to refresh user data:', refreshError);
          // Don't throw error - profile update was successful
        }
      }

      setTimeout(() => setSuccess(null), 3000);

    } catch (error) {
      console.error('❌ Save profile error:', error);

      // ✅ Enhanced error handling
      let errorMessage = 'Failed to update profile';

      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status) {
        errorMessage = `Server error (${error.response.status}). Please try again.`;
      }

      setError(errorMessage);

      // Don't close modal on error - let user try again
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordChange = async (passwordData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('New password and confirmation do not match');
      }

      // Call API with correctly named parameters
      await userService.changePassword({
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      setSuccess('Password changed successfully!');
      setShowPasswordModal(false);

      // Auto-clear success message
      setTimeout(() => setSuccess(null), 3000);

    } catch (error) {
      console.error('Password change error:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to change password. Please check your current password.';

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Helper để format date
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

  return (
    <div className="user-profile-page">
      <PageHeader
        title="User Profile"
        subtitle="Manage your personal information and account settings"
        showBackButton={false}
        actions={
          <button
            onClick={loadUserProfile}
            className="refresh-btn"
            disabled={profileLoading}
          >
            {profileLoading ? 'Refreshing...' : '🔄 Refresh'}
          </button>
        }
      />

      {/* Status Messages */}
      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <div className="alert-content">
            <strong>Error:</strong> {error}
          </div>
          <button onClick={() => setError(null)} className="alert-close">×</button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span className="alert-icon">✅</span>
          <div className="alert-content">
            <strong>Success:</strong> {success}
          </div>
          <button onClick={() => setSuccess(null)} className="alert-close">×</button>
        </div>
      )}

      <div className="profile-content">
        {profileLoading ? (
          <div className="profile-skeleton">
            <div className="skeleton-header"></div>
            <div className="skeleton-avatar"></div>
            <div className="skeleton-field"></div>
            <div className="skeleton-field"></div>
            <div className="skeleton-field"></div>
            <div className="skeleton-field"></div>
          </div>
        ) : (
          <div className="profile-sections">
            {/* Personal Details Section */}
            <div className="profile-section">
              <div className="section-header">
                <h2 className="section-title">
                  <span className="section-icon">👤</span>
                  Personal details
                </h2>
                <button
                  className="edit-btn"
                  onClick={handleEditProfile}
                  disabled={loading}
                >
                  {loading ? <InlineLoadingSpinner size="small" /> : '✏️ Edit'}
                </button>
              </div>

              <div className="section-content">
                <div className="profile-picture-section">
                  <div className="picture-container">
                    <label className="picture-label">DISPLAY PICTURE</label>
                    <div className="profile-picture">
                      {/* ✅ Show loading spinner while avatar is loading */}
                      {avatarLoading ? (
                        <div className="avatar-loading">
                          <InlineLoadingSpinner size="medium" />
                          <span>Loading avatar...</span>
                        </div>
                      ) : profileData.avatarUrl ? (
                        <img
                          src={profileData.avatarUrl}
                          alt="Profile"
                          className="profile-image"
                          onError={(e) => {
                            console.error('❌ Avatar image load error, falling back to default');
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                          onLoad={() => {
                            console.log('✅ Avatar image loaded successfully');
                          }}
                        />
                      ) : null}
                      <div
                        className="default-avatar"
                        style={{
                          display: (!avatarLoading && profileData.avatarUrl) ? 'none' : 'flex'
                        }}
                      >
                        <span className="avatar-icon">👤</span>
                      </div>
                    </div>
                    <div className="picture-help">
                      Click 'Edit' to change your profile picture
                      {avatarLoading && <span className="loading-text"> (Loading...)</span>}
                    </div>
                  </div>
                </div>

                <div className="profile-fields">
                  {/* Hiển thị fullname thay vì firstName/lastName */}
                  <div className="form-group">
                    <label className="form-label">FULL NAME</label>
                    <div className="form-value">{profileData.fullname || 'Not provided'}</div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">EMAIL</label>
                    <div className="form-value email-value">
                      {profileData.email}
                      {user?.emailVerified === false && (
                        <span className="verification-badge unverified">
                          Not verified
                        </span>
                      )}
                      {user?.emailVerified === true && (
                        <span className="verification-badge verified">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">PHONE</label>
                    <div className="form-value">{profileData.phone || 'Not provided'}</div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">MEMBER SINCE</label>
                    <div className="form-value">
                      {formatDate(profileData.created_at)}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">ACCOUNT STATUS</label>
                    <div className="form-value">
                      <span className={`status-badge ${(profileData.status || 'unknown').toLowerCase()}`}>
                        {profileData.status?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">ACCOUNT TYPE</label>
                    <div className="form-value">
                      <span className="role-badge">
                        {profileData.role?.toUpperCase() || 'USER'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="profile-section">
              <div className="section-header">
                <h2 className="section-title">
                  <span className="section-icon">🔐</span>
                  Password & Security
                </h2>
              </div>

              <div className="section-content">
                <div className="password-option" onClick={handleChangePassword}>
                  <div className="password-info">
                    <span className="password-text">Change password</span>
                    <span className="password-subtitle">Update your account password</span>
                  </div>
                  <span className="arrow-icon">›</span>
                </div>

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
                      <span className="status-badge disabled">Not enabled</span>
                      <span className="coming-soon">(Coming soon)</span>
                    </span>
                  </div>

                  <div className="security-item">
                    <span className="security-label">Last login:</span>
                    <span className="security-value">
                      {formatDate(user?.lastLoginAt || 'Not available')}
                    </span>
                  </div>
                </div>

                <div className="security-tips">
                  <h4 className="tips-header">Security Tips</h4>
                  <ul className="tips-list">
                    <li>Use a strong password with at least 8 characters</li>
                    <li>Include numbers, symbols, and both uppercase and lowercase letters</li>
                    <li>Don't reuse passwords from other websites</li>
                    <li>Enable two-factor authentication when available</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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
    </div>
  );
};

export default UserProfilePage;