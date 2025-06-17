import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../../../contexts/AuthContext';
import { userService } from '../../../../../services/userService';
import InlineLoadingSpinner from '../../../../../../components/LoadingSpinner/LoadingSpinner';
import './Profile.css';
import EditProfileModal from '../Modal/EditProfileModal/EditProfileModal';
import ChangePasswordModal from '../Modal/ChangePasswordModal/ChangePasswordModal';

const Profile = () => {
  const { user, fullname, email, getUserAvatar, phone } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [profileData, setProfileData] = useState({
    displayPicture: null,
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    fullname: ''
  });

  // Load user data when component mounts
  useEffect(() => {
    loadUserProfile();
  }, [user]);

  const loadUserProfile = async () => {
    try {
      // Load from AuthContext first
      const userAvatar = getUserAvatar();
      const [firstName, ...lastNameParts] = (fullname || '').split(' ');
      const lastName = lastNameParts.join(' ');
      
      setProfileData({
        displayPicture: userAvatar,
        firstName: firstName || '',
        lastName: lastName || '',
        email: email || '',
        contactNumber: phone || '',
        fullname: fullname || '',
        ...user // Include any additional user fields
      });

      // Try to load additional profile data from API
      try {
        const profileResponse = await userService.getCurrentUserProfile();
        if (profileResponse) {
          setProfileData(prev => ({
            ...prev,
            ...profileResponse
          }));
        }
      } catch (apiError) {
        console.log('API profile load failed, using auth data:', apiError);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile data');
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

  const handleSaveProfile = async (newData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Update profile via API
      const updatedProfile = await userService.updateUserProfile(newData);
      
      // Update local state
      setProfileData(prev => ({
        ...prev,
        ...newData,
        ...updatedProfile
      }));

      // Handle avatar upload separately if provided
      if (newData.avatarFile) {
        try {
          const avatarResponse = await userService.uploadAvatar(newData.avatarFile);
          setProfileData(prev => ({
            ...prev,
            displayPicture: avatarResponse.avatarUrl
          }));
        } catch (avatarError) {
          console.error('Avatar upload failed:', avatarError);
          setError('Profile updated but avatar upload failed');
        }
      }

      setSuccess('Profile updated successfully!');
      console.log('Profile saved successfully:', newData);
      
      // Auto-clear success message
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error) {
      console.error('Save profile error:', error);
      setError(error.response?.data?.message || 'Failed to update profile');
      
      // Update local state anyway for better UX
      setProfileData(prev => ({
        ...prev,
        ...newData
      }));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (passwordData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await userService.changePassword(passwordData);
      setSuccess('Password changed successfully!');
      console.log('Password changed successfully');
      
      // Auto-clear success message
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error) {
      console.error('Password change error:', error);
      setError(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="dashboard-main">
      <div className="main-header">
        <h1 className="page-title">Profile</h1>
        {user && (
          <div className="user-context">
            <span className="user-id">ID: {user.id}</span>
            <span className="user-role">{user.role?.toUpperCase()}</span>
          </div>
        )}
      </div>

      {/* Status Messages */}
      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success">
          <span className="alert-icon">✅</span>
          {success}
        </div>
      )}
      
      <div className="profile-content">
        <div className="profile-sections">
          {/* Personal Details Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2 className="section-title">Personal details</h2>
              <button 
                className="edit-btn" 
                onClick={handleEditProfile}
                disabled={loading}
              >
                {loading ? (
                                  <InlineLoadingSpinner message="Saving..." size="small" />
                                ) : (
                                  'Edit'
                                )}
              </button>
            </div>
            
            <div className="section-content">
              <div className="profile-picture-section">
                <div className="picture-container">
                  <label className="picture-label">DISPLAY PICTURE</label>
                  <div className="profile-picture">
                    {profileData.displayPicture ? (
                      <img 
                        src={profileData.displayPicture} 
                        alt="Profile" 
                        className="profile-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                    ) : null}
                    <div 
                      className="default-avatar"
                      style={{ 
                        display: profileData.displayPicture ? 'none' : 'flex' 
                      }}
                    >
                      <span className="avatar-icon">👤</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="profile-fields">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">FIRST NAME</label>
                    <div className="form-value">{profileData.firstName || 'None'}</div>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">LAST NAME</label>
                    <div className="form-value">{profileData.lastName || 'None'}</div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">FULL NAME</label>
                  <div className="form-value">{profileData.fullname || 'None'}</div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">EMAIL</label>
                  <div className="form-value email-value">
                    {profileData.email}
                    {user?.emailVerified === false && (
                      <span className="verification-badge unverified">Unverified</span>
                    )}
                    {user?.emailVerified === true && (
                      <span className="verification-badge verified">✓ Verified</span>
                    )}
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">CONTACT NUMBER</label>
                  <div className="form-value">{profileData.contactNumber || 'None'}</div>
                </div>

                {user?.createdAt && (
                  <div className="form-group">
                    <label className="form-label">MEMBER SINCE</label>
                    <div className="form-value">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">ACCOUNT STATUS</label>
                  <div className="form-value">
                    <span className={`status-badge ${user?.status?.toLowerCase() || 'unknown'}`}>
                      {user?.status || 'UNKNOWN'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2 className="section-title">Password & Security</h2>
              <button 
                className="edit-btn" 
                onClick={handleChangePassword}
                disabled={loading}
              >
                {loading ? (
                                  <InlineLoadingSpinner message="Saving..." size="small" />
                                ) : (
                                  'Edit'
                                )}
              </button>
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
                    {user?.lastPasswordChange 
                      ? new Date(user.lastPasswordChange).toLocaleDateString()
                      : 'Unknown'
                    }
                  </span>
                </div>
                
                <div className="security-item">
                  <span className="security-label">Two-factor authentication:</span>
                  <span className="security-value">
                    <span className="status-badge disabled">Not enabled</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
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
    </main>
  );
};

export default Profile;