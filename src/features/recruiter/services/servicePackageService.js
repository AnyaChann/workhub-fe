import api from '../../../shared/utils/helpers/api';

export const servicePackageService = {
  // ✅ Lấy tất cả gói dịch vụ (GET /service-packages)
  getAllPackages: async () => {
    try {
      console.log('📦 Fetching all service packages from /service-packages');
      const response = await api.get('/service-packages');
      console.log('📦 Service packages response:', response);
      
      // ✅ API trả về array trực tiếp theo documentation
      if (Array.isArray(response)) {
        return response;
      } else if (response?.data && Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn('⚠️ Unexpected response format:', response);
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching service packages:', error);
      throw error;
    }
  },

  // ✅ Lấy chi tiết gói dịch vụ theo ID (GET /service-packages/{id})
  getPackageById: async (packageId) => {
    try {
      console.log('📦 Fetching package details for ID:', packageId);
      const response = await api.get(`/service-packages/${packageId}`);
      console.log('📦 Package details response:', response);
      
      // ✅ API trả về object trực tiếp theo documentation
      return response?.data || response;
    } catch (error) {
      console.error('❌ Error fetching package details:', error);
      throw error;
    }
  },

  // ✅ Lấy tất cả các gói của người dùng (GET /user-packages/user/{userId})
  getUserPackages: async (userId) => {
    try {
      console.log('👤 Fetching user packages for userId:', userId);
      
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      const response = await api.get(`/user-packages/user/${userId}`);
      console.log('👤 User packages response:', response);
      
      // ✅ API trả về array trực tiếp theo documentation
      if (Array.isArray(response)) {
        return response;
      } else if (response?.data && Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn('⚠️ Unexpected user packages response format:', response);
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching user packages:', error);
      
      if (error.response?.status === 404) {
        console.log('📦 No packages found for user');
        return [];
      }
      
      throw error;
    }
  },

  // ✅ Lấy chi tiết gói người dùng theo ID (GET /user-packages/{id})
  getUserPackageById: async (packageId) => {
    try {
      console.log('📦 Fetching user package details for ID:', packageId);
      const response = await api.get(`/user-packages/${packageId}`);
      console.log('📦 User package details response:', response);
      
      // ✅ API trả về object trực tiếp theo documentation
      return response?.data || response;
    } catch (error) {
      console.error('❌ Error fetching user package details:', error);
      throw error;
    }
  },

  // ✅ API mô phỏng mua gói dịch vụ - CHỜ ENDPOINT THỰC TẾ
  purchasePackageTest: async (packageId, price, description = 'Test payment') => {
    try {
      console.log('💳 Test purchase package:', { packageId, price, description });
      
      // ✅ TODO: Thay thế bằng endpoint mua package thực tế khi backend ready
      // Hiện tại sử dụng endpoint test
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
      
      // ✅ Fallback response for development
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Using development fallback for package purchase');
        return {
          success: true,
          message: 'Package purchased successfully (development mode)',
          packageId,
          price,
          description
        };
      }
      
      throw error;
    }
  },

  // ✅ API mô phỏng gia hạn gói dịch vụ - CHỜ ENDPOINT THỰC TẾ
  renewPackageTest: async (packageId, price, description = 'Package renewal') => {
    try {
      console.log('🔄 Test renew package:', { packageId, price, description });
      
      // ✅ TODO: Thay thế bằng endpoint gia hạn package thực tế khi backend ready
      // Hiện tại sử dụng endpoint test
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
      
      // ✅ Fallback response for development
      if (process.env.NODE_ENV === 'development') {
        console.log('� Using development fallback for package renewal');
        return {
          success: true,
          message: 'Package renewed successfully (development mode)',
          packageId,
          price,
          description
        };
      }
      
      throw error;
    }
  },

  // ✅ Lấy tất cả tính năng dịch vụ từ packages (không có endpoint riêng)
  getAllFeatures: async () => {
    try {
      console.log('🛠️ Extracting all service features from packages...');
      
      // ✅ Lấy features từ tất cả packages vì không có endpoint /service-features
      const packages = await this.getAllPackages();
      const allFeatures = [];
      const seenFeatures = new Set();
      
      packages.forEach(pkg => {
        if (pkg.features && Array.isArray(pkg.features)) {
          pkg.features.forEach(feature => {
            // ✅ Tránh duplicate features dựa trên ID
            if (feature.id && !seenFeatures.has(feature.id)) {
              seenFeatures.add(feature.id);
              allFeatures.push({
                ...feature,
                // ✅ Thêm thông tin package để reference
                packageName: pkg.name,
                packageId: pkg.id
              });
            }
          });
        }
      });
      
      console.log('🛠️ Extracted unique features from packages:', allFeatures);
      return allFeatures;
    } catch (error) {
      console.error('❌ Error extracting service features:', error);
      return [];
    }
  },

  // ✅ Lấy chi tiết tính năng dịch vụ theo ID từ packages
  getFeatureById: async (featureId) => {
    try {
      console.log('🛠️ Finding service feature with ID:', featureId);
      
      // ✅ Tìm feature trong tất cả packages
      const packages = await this.getAllPackages();
      for (const pkg of packages) {
        if (pkg.features && Array.isArray(pkg.features)) {
          const feature = pkg.features.find(f => f.id === parseInt(featureId));
          if (feature) {
            console.log('🛠️ Found feature in package:', pkg.name);
            return {
              ...feature,
              packageName: pkg.name,
              packageId: pkg.id,
              packagePrice: pkg.price
            };
          }
        }
      }
      
      throw new Error(`Feature with ID ${featureId} not found`);
    } catch (error) {
      console.error('❌ Error finding service feature:', error);
      throw error;
    }
  }
};

export default servicePackageService;