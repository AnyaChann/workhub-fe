import api from '../../../shared/utils/helpers/api';

export const userService = {
  // Get current user profile
  getCurrentUserProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data || response;
    } catch (error) {
      console.error('Get user profile failed:', error);
      // Fallback data for development or when API fails
      return {
        fullname: localStorage.getItem('user_fullname') || '',
        phone: localStorage.getItem('user_phone') || '',
        avatar: localStorage.getItem('user_avatar') || '',
        email: localStorage.getItem('user_email') || ''
      };
    }
  },

  // Update user profile - chỉ gửi các trường có thể chỉnh sửa
  updateUserProfile: async (profileData) => {
    try {
      // Chỉ gửi các trường được phép chỉnh sửa theo API spec
      const payload = {
        fullname: profileData.fullname,
        email: profileData.email,
        phone: profileData.phone,
        // avatar không gửi ở đây, sẽ xử lý riêng qua uploadAvatar
      };
      
      console.log('Updating profile with payload:', payload);
      
      const response = await api.put('/users/profile', payload);
      
      // Cache data for offline/fallback use
      if (payload.fullname) localStorage.setItem('user_fullname', payload.fullname);
      if (payload.phone) localStorage.setItem('user_phone', payload.phone);
      if (payload.email) localStorage.setItem('user_email', payload.email);
      
      return response.data || response;
    } catch (error) {
      console.error('Update user profile failed:', error);
      
      // Log detailed error information
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

  // Change password using query parameters
  changePassword: async (passwordData) => {
    try {
      // Extract password values
      const oldPassword = passwordData.currentPassword || passwordData.oldPassword;
      const newPassword = passwordData.newPassword;
      
      if (!oldPassword || !newPassword) {
        throw new Error('Both old and new passwords are required');
      }
      
      console.log('Changing password...');
      
      // Send as query parameters as per API spec
      const response = await api.put(`/users/password?oldPassword=${encodeURIComponent(oldPassword)}&newPassword=${encodeURIComponent(newPassword)}`);
      
      return response.data || response;
    } catch (error) {
      console.error('Change password failed:', error);
      
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
  },

  // Upload user avatar with enhanced error handling
  uploadAvatar: async (file) => {
    if (!file) {
      console.error('No file provided for avatar upload');
      return null;
    }
    
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      console.log('Uploading avatar file:', file.name, file.type, `${Math.round(file.size / 1024)} KB`);
      
      const response = await api.post('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Cache avatar URL for offline/fallback use
      if (response.data?.avatarUrl) {
        localStorage.setItem('user_avatar', response.data.avatarUrl);
      }
      
      return response.data || response;
    } catch (error) {
      console.error('Upload avatar failed:', error);
      
      // For development or when API fails
      if (process.env.NODE_ENV === 'development') {
        console.log('Using local fallback for avatar in development mode');
        return {
          avatarUrl: URL.createObjectURL(file)
        };
      }
      
      throw new Error('Failed to upload profile picture. Please try again.');
    }
  },

  // Các phương thức khác giữ nguyên...
  getCompanyInfo: async () => { /* ... existing code ... */ },
  updateCompanyInfo: async (companyData) => { /* ... existing code ... */ },
  // ...
};