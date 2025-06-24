import api from '../../../shared/utils/helpers/api';

export const userService = {
  // ✅ New method: Get user avatar specifically
  getUserAvatar: async () => {
    try {
      console.log('🖼️ Fetching user avatar from API...');
      
      // Try to get full profile which includes avatar
      const response = await api.put('/users/profile', {
        fullname: localStorage.getItem('user_fullname') || '',
        email: localStorage.getItem('user_email') || '',
        phone: localStorage.getItem('user_phone') || ''
      });
      
      const result = response.data || response;
      
      if (result && typeof result === 'object' && result.avatar && Array.isArray(result.avatar)) {
        console.log('✅ Avatar found in API response, converting to blob...');
        const blob = new Blob([new Uint8Array(result.avatar)], { type: 'image/jpeg' });
        const avatarUrl = URL.createObjectURL(blob);
        
        // Cache the new blob URL
        localStorage.setItem('user_avatar', avatarUrl);
        console.log('✅ Avatar blob URL created and cached:', avatarUrl);
        
        return avatarUrl;
      } else {
        console.log('ℹ️ No avatar found in API response');
        return null;
      }
    } catch (error) {
      console.error('❌ Failed to fetch avatar from API:', error);
      return null;
    }
  },

  // Get current user profile - fallback to AuthContext data
  getCurrentUserProfile: async () => {
    try {
      console.log('🔍 Attempting to get user profile...');
      
      // ✅ Try to fetch avatar from API
      const avatarUrl = await userService.getUserAvatar();
      
      return {
        fullname: localStorage.getItem('user_fullname') || '',
        phone: localStorage.getItem('user_phone') || '',
        avatar: null,
        avatarUrl: avatarUrl || localStorage.getItem('user_avatar') || '',
        email: localStorage.getItem('user_email') || ''
      };
    } catch (error) {
      console.error('❌ Profile loading failed:', error);
      
      // Return empty fallback
      return {
        fullname: '',
        phone: '',
        avatar: null,
        avatarUrl: '',
        email: ''
      };
    }
  },

  // ✅ Helper function to clean up old blob URLs
  cleanupOldBlobUrls: () => {
    const oldAvatarUrl = localStorage.getItem('user_avatar');
    if (oldAvatarUrl && oldAvatarUrl.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(oldAvatarUrl);
        console.log('🧹 Cleaned up old blob URL');
      } catch (error) {
        console.warn('⚠️ Failed to cleanup old blob URL:', error);
      }
    }
  },

  // ✅ Helper function to process profile data consistently
  processProfileData: (profileData) => {
    if (!profileData) return null;

    try {
      // Clean up old blob URLs first
      userService.cleanupOldBlobUrls();

      // Convert byte array avatar to displayable URL if needed
      if (profileData.avatar && Array.isArray(profileData.avatar)) {
        // Convert byte array to blob URL for display
        const blob = new Blob([new Uint8Array(profileData.avatar)], { type: 'image/jpeg' });
        profileData.avatarUrl = URL.createObjectURL(blob);
        
        // Cache the blob URL
        localStorage.setItem('user_avatar', profileData.avatarUrl);
      } else if (profileData.avatar && typeof profileData.avatar === 'string') {
        // If avatar is already a URL string
        profileData.avatarUrl = profileData.avatar;
        localStorage.setItem('user_avatar', profileData.avatar);
      }

      // Cache other data
      if (profileData.fullname) localStorage.setItem('user_fullname', profileData.fullname);
      if (profileData.phone) localStorage.setItem('user_phone', profileData.phone);
      if (profileData.email) localStorage.setItem('user_email', profileData.email);
      
      return profileData;
    } catch (error) {
      console.error('❌ Error processing profile data:', error);
      return profileData;
    }
  },

  // ✅ Update user profile using PUT /users/profile with correct payload format
  updateUserProfile: async (profileData) => {
    try {
      // ✅ Format payload according to API spec (exclude avatar for profile-only updates)
      const payload = {
        fullname: profileData.fullname || '',
        email: profileData.email || '',
        phone: profileData.phone || ''
        // Don't include avatar here for profile-only updates
      };
      
      console.log('📤 Updating profile (without avatar) with payload:', payload);
      
      const response = await api.put('/users/profile', payload);
      const result = response.data || response;
      
      console.log('✅ Profile updated successfully:', result);
      
      // Cache updated data
      if (payload.fullname) localStorage.setItem('user_fullname', payload.fullname);
      if (payload.phone) localStorage.setItem('user_phone', payload.phone);
      if (payload.email) localStorage.setItem('user_email', payload.email);
      
      // ✅ Always return an object, even if API returns string
      if (typeof result === 'string') {
        return {
          message: result,
          fullname: payload.fullname,
          email: payload.email,
          phone: payload.phone
        };
      }
      
      return result;
    } catch (error) {
      console.error('❌ Update user profile failed:', error);
      
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        throw new Error(error.response.data?.message || 'Update profile failed');
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw new Error('No response from server. Please check your connection.');
      } else {
        throw error;
      }
    }
  },

  // ✅ Update profile with avatar - convert file to byte array
  updateProfileWithAvatar: async (profileData, avatarFile) => {
    try {
      console.log('📷 Starting profile update with avatar...');
      console.log('📄 Profile data:', profileData);
      console.log('🖼️ Avatar file:', avatarFile ? { name: avatarFile.name, size: avatarFile.size, type: avatarFile.type } : 'none');

      // Clean up old blob URLs first
      userService.cleanupOldBlobUrls();

      let avatarByteArray = null;
      
      // ✅ Convert file to byte array if provided
      if (avatarFile) {
        try {
          console.log('🔄 Converting avatar file to byte array...');
          avatarByteArray = await userService.fileToByteArray(avatarFile);
          console.log('✅ Avatar converted successfully:', avatarByteArray.length, 'bytes');
        } catch (conversionError) {
          console.error('❌ Avatar conversion failed:', conversionError);
          throw new Error('Failed to process avatar file: ' + conversionError.message);
        }
      }

      // ✅ Include avatar in the profile update payload
      const payload = {
        fullname: profileData.fullname || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        avatar: avatarByteArray
      };
      
      console.log('📤 Updating profile with avatar payload:', {
        ...payload,
        avatar: payload.avatar ? `[${payload.avatar.length} bytes]` : null
      });
      
      const response = await api.put('/users/profile', payload);
      let result = response.data || response;
      
      console.log('✅ Profile with avatar updated successfully:', result);
      
      // Cache updated data
      if (payload.fullname) localStorage.setItem('user_fullname', payload.fullname);
      if (payload.phone) localStorage.setItem('user_phone', payload.phone);
      if (payload.email) localStorage.setItem('user_email', payload.email);
      
      // ✅ Handle API response - ensure result is always an object
      if (typeof result === 'string') {
        console.log('🔧 API returned string, converting to object:', result);
        result = {
          message: result,
          fullname: payload.fullname,
          email: payload.email,
          phone: payload.phone,
          avatar: null, // Will be set below
          avatarUrl: null // Will be set below
        };
      }
      
      // ✅ Process and cache avatar response
      try {
        if (result.avatar && Array.isArray(result.avatar)) {
          console.log('🔄 Processing avatar response from API...');
          const blob = new Blob([new Uint8Array(result.avatar)], { 
            type: avatarFile?.type || 'image/jpeg' 
          });
          result.avatarUrl = URL.createObjectURL(blob);
          localStorage.setItem('user_avatar', result.avatarUrl);
          console.log('✅ Avatar URL created and cached from API response');
        } else if (avatarFile) {
          // ✅ Fallback: use the uploaded file directly for preview
          console.log('🔄 Using uploaded file as avatar preview (API didn\'t return avatar)');
          result.avatarUrl = URL.createObjectURL(avatarFile);
          localStorage.setItem('user_avatar', result.avatarUrl);
          
          // Store a reference to the uploaded file for future use
          result.uploadedFile = avatarFile;
          console.log('✅ Avatar preview created from uploaded file');
        }
      } catch (avatarProcessError) {
        console.error('⚠️ Avatar processing failed, but profile update succeeded:', avatarProcessError);
        
        // ✅ Ensure we still provide a usable avatar if file exists
        if (avatarFile && !result.avatarUrl) {
          try {
            result.avatarUrl = URL.createObjectURL(avatarFile);
            localStorage.setItem('user_avatar', result.avatarUrl);
            console.log('✅ Created fallback avatar URL from uploaded file');
          } catch (fallbackError) {
            console.error('❌ Even fallback avatar creation failed:', fallbackError);
          }
        }
      }
      
      return result;
    } catch (error) {
      console.error('❌ Update profile with avatar failed:', error);
      
      if (error.response) {
        console.error('📄 Error response:', error.response.data);
        throw new Error(error.response.data?.message || 'Failed to update profile with avatar');
      } else if (error.request) {
        console.error('🌐 No response received');
        throw new Error('No response from server. Please check your connection.');
      } else {
        throw error;
      }
    }
  },

  // ✅ Helper: Convert File to byte array with better error handling
  fileToByteArray: (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file provided'));
        return;
      }

      console.log('📁 Processing file:', { name: file.name, size: file.size, type: file.type });

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        reject(new Error('File size must be less than 5MB'));
        return;
      }

      // Validate file type
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type)) {
        reject(new Error('Only JPG, PNG, and GIF files are allowed'));
        return;
      }

      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const arrayBuffer = event.target.result;
          const byteArray = Array.from(new Uint8Array(arrayBuffer));
          console.log('✅ File converted to byte array:', byteArray.length, 'bytes');
          resolve(byteArray);
        } catch (conversionError) {
          console.error('❌ Error converting ArrayBuffer to byte array:', conversionError);
          reject(new Error('Failed to convert file data'));
        }
      };
      
      reader.onerror = (error) => {
        console.error('❌ FileReader error:', error);
        reject(new Error('Failed to read file: ' + error.message));
      };

      reader.onabort = () => {
        console.error('❌ FileReader aborted');
        reject(new Error('File reading was aborted'));
      };
      
      try {
        reader.readAsArrayBuffer(file);
      } catch (readerError) {
        console.error('❌ Error starting FileReader:', readerError);
        reject(new Error('Failed to start reading file'));
      }
    });
  },

  // ✅ Legacy avatar upload method (deprecated - use updateProfileWithAvatar instead)
  uploadAvatar: async (file) => {
    console.warn('⚠️ uploadAvatar is deprecated. Use updateProfileWithAvatar instead.');
    
    if (!file) {
      console.error('No file provided for avatar upload');
      return null;
    }
    
    try {
      // Convert to byte array and use profile update
      const currentProfile = {
        fullname: localStorage.getItem('user_fullname') || '',
        email: localStorage.getItem('user_email') || '',
        phone: localStorage.getItem('user_phone') || ''
      };
      
      return await userService.updateProfileWithAvatar(currentProfile, file);
    } catch (error) {
      console.error('❌ Legacy avatar upload failed:', error);
      
      // ✅ Development fallback
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Using local fallback for avatar in development mode');
        const fallbackUrl = URL.createObjectURL(file);
        localStorage.setItem('user_avatar', fallbackUrl);
        return {
          avatarUrl: fallbackUrl,
          avatar: null
        };
      }
      
      throw error;
    }
  },

  // Change password using query parameters (if supported)
  changePassword: async (passwordData) => {
    try {
      const oldPassword = passwordData.currentPassword || passwordData.oldPassword;
      const newPassword = passwordData.newPassword;
      
      if (!oldPassword || !newPassword) {
        throw new Error('Both old and new passwords are required');
      }
      
      console.log('🔐 Changing password...');
      
      // ✅ Try query parameter method first
      const queryParams = `?oldPassword=${encodeURIComponent(oldPassword)}&newPassword=${encodeURIComponent(newPassword)}`;
      
      try {
        const response = await api.put(`/users/password${queryParams}`);
        console.log('✅ Password changed successfully');
        return response.data || response;
      } catch (error) {
        // Try POST method as fallback
        if (error.response?.status === 405) {
          console.log('PUT failed, trying POST for password change...');
          const response = await api.post(`/users/password${queryParams}`);
          console.log('✅ Password changed via POST');
          return response.data || response;
        }
        throw error;
      }
      
    } catch (error) {
      console.error('❌ Change password failed:', error);
      
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        throw new Error(error.response.data?.message || 'Password change failed. Please check your current password.');
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw new Error('No response from server. Please check your internet connection.');
      }
      
      throw error;
    }
  }
};

// ✅ Export helper functions for external use
const processProfileData = userService.processProfileData;

export { processProfileData };