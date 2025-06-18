import api from './api';

export const userService = {
  // Get current user profile
  getCurrentUserProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response;
    } catch (error) {
      console.error('Get user profile failed:', error);
      return {
        firstName: 'John',
        lastName: 'Doe',
        fullname: 'John Doe',
        phone: '+84123456789',
        lastPasswordChange: new Date().toISOString(),
        emailVerified: true
      };
    }
  },

  // ✅ Updated to use /users/profile
  updateUserProfile: async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response;
    } catch (error) {
      console.error('Update user profile failed:', error);
      return profileData;
    }
  },

  // ✅ Updated to use /users/password  
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/users/password', passwordData);
      return response;
    } catch (error) {
      console.error('Change password failed:', error);
      throw error;
    }
  },

  // Upload user avatar
  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await api.post('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      console.error('Upload avatar failed:', error);
      // Mock response for development
      return {
        avatarUrl: URL.createObjectURL(file)
      };
    }
  },

  // Get company info (for employers)
  getCompanyInfo: async () => {
    try {
      const response = await api.get('/companies/my-company');
      return response;
    } catch (error) {
      console.error('Get company info failed:', error);
      // Mock company data
      return {
        companyName: 'WorkHub Tech Company',
        abn: '12 345 678 901',
        industry: 'Technology',
        companySize: '50-100 employees',
        website: 'https://workhub.com',
        description: 'A leading technology company focused on workforce solutions.'
      };
    }
  },

  // Update company info
  updateCompanyInfo: async (companyData) => {
    try {
      const response = await api.put('/companies/my-company', companyData);
      return response;
    } catch (error) {
      console.error('Update company info failed:', error);
      return companyData;
    }
  },

  // Update billing info
  updateBillingInfo: async (billingData) => {
    try {
      const response = await api.put('/users/billing-info', billingData);
      return response;
    } catch (error) {
      console.error('Update billing info failed:', error);
      return billingData;
    }
  },

  // Get company users (for manage users)
  getCompanyUsers: async () => {
    try {
      const response = await api.get('/companies/users');
      return response;
    } catch (error) {
      console.error('Get company users failed:', error);
      throw error;
    }
  },

  // Invite user to company
  inviteUser: async (userData) => {
    try {
      const response = await api.post('/companies/users/invite', userData);
      return response;
    } catch (error) {
      console.error('Invite user failed:', error);
      throw error;
    }
  },

  // Remove user from company
  removeUser: async (userId) => {
    try {
      const response = await api.delete(`/companies/users/${userId}`);
      return response;
    } catch (error) {
      console.error('Remove user failed:', error);
      throw error;
    }
  },

  // Get user packages/billing info
  getUserPackages: async () => {
    try {
      const response = await api.get('/users/packages');
      return response;
    } catch (error) {
      console.error('Get user packages failed:', error);
      // Mock packages data
      return {
        activeJobs: 5,
        applications: 23,
        plan: 'Professional',
        billingCycle: 'monthly',
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };
    }
  },

  // Get billing history
  getBillingHistory: async () => {
    try {
      const response = await api.get('/users/billing-history');
      return response;
    } catch (error) {
      console.error('Get billing history failed:', error);
      // Mock billing data
      return {
        billingInfo: {
          firstName: 'John',
          lastName: 'Doe',
          billingPhone: '+84123456789',
          billingAddress: '123 Tech Street',
          suburb: 'Tech District',
          state: 'Sydney',
          postCode: '2000',
          country: 'Australia'
        },
        history: []
      };
    }
  },


  // Delete account
  deleteAccount: async () => {
    try {
      const response = await api.delete('/users/account');
      return response;
    } catch (error) {
      console.error('Delete account failed:', error);
      throw error;
    }
  }
};