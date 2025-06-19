import api from '../../../shared/utils/helpers/api';

export const servicePackageService = {
  // ✅ Get all service packages (for recruiter to view/purchase)
  getAllPackages: async () => {
    try {
      console.log('📦 Fetching all service packages');
      const response = await api.get('/service-packages');
      return response;
    } catch (error) {
      console.error('Error fetching service packages:', error);
      throw error;
    }
  },

  // ✅ Get specific package details
  getPackageById: async (packageId) => {
    try {
      console.log('📦 Fetching package details:', packageId);
      const response = await api.get(`/service-packages/${packageId}`);
      return response;
    } catch (error) {
      console.error('Error fetching package details:', error);
      throw error;
    }
  },

  // ✅ Get user's purchased packages
  getUserPackages: async (userId) => {
    try {
      console.log('👤 Fetching user packages:', userId);
      const response = await api.get(`/user-packages/user/${userId}`);
      return response;
    } catch (error) {
      console.error('Error fetching user packages:', error);
      throw error;
    }
  },

  // ✅ Get specific user package details
  getUserPackageById: async (packageId) => {
    try {
      const response = await api.get(`/user-packages/${packageId}`);
      return response;
    } catch (error) {
      console.error('Error fetching user package details:', error);
      throw error;
    }
  }
};

export default servicePackageService;