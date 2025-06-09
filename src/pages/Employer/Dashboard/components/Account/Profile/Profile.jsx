import React, { useState } from 'react';
import './Profile.css';
import EditProfileModal from '../Modal/EditProfileModal/EditProfileModal';
import ChangePasswordModal from '../Modal/ChangePasswordModal/ChangePasswordModal';

const Profile = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  const [profileData, setProfileData] = useState({
    displayPicture: null,
    firstName: '',
    lastName: '',
    email: 'bachct504@gmail.com',
    contactNumber: ''
  });

  const handleEditProfile = () => {
    setShowProfileModal(true);
  };

  const handleChangePassword = () => {
    setShowPasswordModal(true);
  };

  const handleSaveProfile = (newData) => {
    setProfileData(prev => ({
      ...prev,
      ...newData
    }));
    console.log('Saved profile data:', newData);
  };

  const handlePasswordChange = (passwordData) => {
    console.log('Password change requested:', passwordData);
    // TODO: Implement password change API call
  };

  return (
    <main className="dashboard-main">
      <div className="main-header">
        <h1 className="page-title">Profile</h1>
      </div>
      
      <div className="profile-content">
        <div className="profile-sections">
          {/* Personal Details Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2 className="section-title">Personal details</h2>
              <button className="edit-btn" onClick={handleEditProfile}>
                Edit
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
                      />
                    ) : (
                      <div className="default-avatar">
                        <span className="avatar-icon">👤</span>
                      </div>
                    )}
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
                  <label className="form-label">EMAIL</label>
                  <div className="form-value">{profileData.email}</div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">CONTACT NUMBER</label>
                  <div className="form-value">{profileData.contactNumber || 'None'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2 className="section-title">Password</h2>
              <button className="edit-btn" onClick={handleChangePassword}>
                Edit
              </button>
            </div>
            
            <div className="section-content">
              <div className="password-option" onClick={handleChangePassword}>
                <span className="password-text">Change password</span>
                <span className="arrow-icon">›</span>
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
      />

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSave={handlePasswordChange}
      />
    </main>
  );
};

export default Profile;