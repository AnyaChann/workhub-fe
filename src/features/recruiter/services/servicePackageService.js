import api from '../../../shared/utils/helpers/api';

export const servicePackageService = {
  // ✅ Lấy tất cả gói dịch vụ (cho recruiter xem/mua)
  getAllPackages: async () => {
    try {
      console.log('📦 Fetching all service packages');
      const response = await api.get('/service-packages');
      return response;
    } catch (error) {
      console.error('❌ Error fetching service packages:', error);
      throw error;
    }
  },

  // ✅ Lấy chi tiết gói dịch vụ theo ID
  getPackageById: async (packageId) => {
    try {
      console.log('📦 Fetching package details:', packageId);
      const response = await api.get(`/service-packages/${packageId}`);
      return response;
    } catch (error) {
      console.error('❌ Error fetching package details:', error);
      throw error;
    }
  },

  // ✅ Lấy tất cả các gói của người dùng
  getUserPackages: async (userId) => {
    try {
      console.log('👤 Fetching user packages:', userId);
      const response = await api.get(`/user-packages/user/${userId}`);
      return response;
    } catch (error) {
      console.error('❌ Error fetching user packages:', error);
      throw error;
    }
  },

  // ✅ Lấy chi tiết gói người dùng theo ID
  getUserPackageById: async (packageId) => {
    try {
      console.log('📦 Fetching user package details:', packageId);
      const response = await api.get(`/user-packages/${packageId}`);
      return response;
    } catch (error) {
      console.error('❌ Error fetching user package details:', error);
      throw error;
    }
  },

  // ✅ API mô phỏng mua gói dịch vụ (test/dev)
  purchasePackageTest: async (packageId, price, description = 'Test payment') => {
    try {
      console.log('💳 Test purchase package:', { packageId, price, description });
      const response = await api.post(`/payments/test/simulate`, null, {
        params: {
          packageId,
          price,
          description
        }
      });
      console.log('✅ Test package purchase successful:', response);
      return response;
    } catch (error) {
      console.error('❌ Error in test purchase:', error);
      throw error;
    }
  },

  // ✅ API mô phỏng gia hạn gói dịch vụ (test/dev)
  renewPackageTest: async (packageId, price, description = 'Gia hạn gói') => {
    try {
      console.log('🔄 Test renew package:', { packageId, price, description });
      const response = await api.post(`/payments/test/renew`, null, {
        params: {
          packageId,
          price,
          description
        }
      });
      console.log('✅ Test package renewal successful:', response);
      return response;
    } catch (error) {
      console.error('❌ Error in test renewal:', error);
      throw error;
    }
  },

  // ✅ Lấy tất cả tính năng dịch vụ
  getAllFeatures: async () => {
    try {
      console.log('🛠️ Fetching all service features');
      const response = await api.get('/service-features');
      return response;
    } catch (error) {
      console.error('❌ Error fetching service features:', error);
      throw error;
    }
  },

  // ✅ Lấy chi tiết tính năng dịch vụ theo ID
  getFeatureById: async (featureId) => {
    try {
      console.log('🛠️ Fetching service feature details:', featureId);
      const response = await api.get(`/service-features/${featureId}`);
      return response;
    } catch (error) {
      console.error('❌ Error fetching service feature details:', error);
      throw error;
    }
  }
};

export default servicePackageService;