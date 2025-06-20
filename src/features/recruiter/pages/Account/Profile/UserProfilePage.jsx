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
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Cập nhật cấu trúc dữ liệu người dùng theo API
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

  // Load user data when component mounts
  useEffect(() => {
    loadUserProfile();
  }, [user]);

  const loadUserProfile = async () => {
    if (!user?.id) {
      console.log('No user found, redirecting to login');
      return navigate('/login');
    }

    setProfileLoading(true);
    setError(null);

    try {
      // Khởi tạo dữ liệu từ AuthContext
      setProfileData({
        id: user.id,
        avatar: getUserAvatar() || '',
        created_at: user.created_at || user.createdAt || new Date().toISOString(),
        email: email || '',
        fullname: fullname || '',
        phone: phone || '',
        role: user.role || '',
        status: user.status || 'active'
      });

      // Thêm dữ liệu từ API
      try {
        console.log('Fetching additional profile data from API...');
        const profileResponse = await userService.getCurrentUserProfile();

        if (profileResponse) {
          console.log('Additional profile data loaded:', profileResponse);

          setProfileData(prev => ({
            ...prev,
            ...profileResponse,
            // Đảm bảo avatar được lưu đúng cách
            avatar: profileResponse.avatar || prev.avatar
          }));
        }
      } catch (apiError) {
        console.log('API profile load failed, using auth data:', apiError);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile data. Please refresh the page.');
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

  // Cập nhật handleSaveProfile để sử dụng đúng cấu trúc dữ liệu
  const handleSaveProfile = async (newData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Tạo payload cho API theo đúng cấu trúc
      const apiProfileData = {
        fullname: newData.fullname,
        email: newData.email,
        phone: newData.phone
      };

      console.log('Updating profile with data:', apiProfileData);

      // Update profile via API
      const updatedProfile = await userService.updateUserProfile(apiProfileData);

      // Update local state
      setProfileData(prev => ({
        ...prev,
        ...updatedProfile
      }));

      // Xử lý avatar riêng nếu có
      if (newData.avatarFile) {
        try {
          console.log('Uploading new avatar:', newData.avatarFile.name);
          const avatarResponse = await userService.uploadAvatar(newData.avatarFile);

          if (avatarResponse?.avatarUrl) {
            console.log('Avatar uploaded successfully:', avatarResponse.avatarUrl);
            setProfileData(prev => ({
              ...prev,
              avatar: avatarResponse.avatarUrl
            }));
          }
        } catch (avatarError) {
          console.error('Avatar upload failed:', avatarError);
          setError('Profile updated but avatar upload failed. Please try again later.');
        }
      }

      setSuccess('Profile updated successfully!');
      setShowProfileModal(false);

      // Refresh AuthContext data
      if (typeof refreshUserData === 'function') {
        try {
          await refreshUserData();
        } catch (refreshError) {
          console.error('Failed to refresh user data:', refreshError);
        }
      }

      // Auto-clear success message
      setTimeout(() => setSuccess(null), 3000);

    } catch (error) {
      console.error('Save profile error:', error);
      setError(error.response?.data?.message || error.message || 'Failed to update profile');
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
                      Click 'Edit' to change your profile picture
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