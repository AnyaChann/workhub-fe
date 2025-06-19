import api from '../../../shared/utils/helpers/api';

export const packageService = {
  // ✅ Get user's packages by userId (updated to use correct endpoint)
  getUserPackages: async (userId = null) => {
    try {
      console.log('📦 Fetching user packages...');
      
      let endpoint;
      if (userId) {
        // Use specific userId
        endpoint = `/user-packages/user/${userId}`;
      } else {
        // Try to get current user's packages - we need to get user ID first
        const currentUser = await api.get('/auth/me'); // or '/users/me' or '/user/profile'
        const currentUserId = currentUser?.id || currentUser?.data?.id;
        
        if (!currentUserId) {
          throw new Error('Cannot determine current user ID');
        }
        
        endpoint = `/user-packages/user/${currentUserId}`;
      }
      
      console.log('📦 Fetching from endpoint:', endpoint);
      const userPackages = await api.get(endpoint);
      console.log('📦 User packages response:', userPackages);
      
      let packages = [];
      if (Array.isArray(userPackages)) {
        packages = userPackages;
      } else if (userPackages && Array.isArray(userPackages.data)) {
        packages = userPackages.data;
      } else if (userPackages && userPackages.data) {
        // Single package response
        packages = [userPackages.data];
      } else if (userPackages) {
        // Single package response
        packages = [userPackages];
      }
      
      console.log('📦 Processed packages:', packages);
      return packages;
      
    } catch (error) {
      console.error('❌ Error fetching user packages:', error);
      
      if (error.response?.status === 404) {
        console.log('📦 No packages found for user');
        return [];
      }
      
      throw error;
    }
  },

  // ✅ Get user's active package (updated to use new endpoint)
  getUserActivePackage: async (userId = null) => {
    try {
      console.log('📦 Fetching user active package...');
      
      const packages = await this.getUserPackages(userId);
      
      if (!packages || packages.length === 0) {
        console.log('📦 No packages found for user');
        return null;
      }
      
      // Find active package that hasn't expired
      const now = new Date();
      const activePackage = packages.find(pkg => {
        const isActive = pkg.status === 'active';
        const notExpired = new Date(pkg.expirationDate) > now;
        
        console.log('📦 Checking package:', {
          id: pkg.id,
          status: pkg.status,
          expirationDate: pkg.expirationDate,
          isActive,
          notExpired
        });
        
        return isActive && notExpired;
      });
      
      if (!activePackage) {
        console.log('📦 No active package found');
        return null;
      }
      
      console.log('📦 Active package found:', activePackage);
      return activePackage;
      
    } catch (error) {
      console.error('❌ Error fetching user active package:', error);
      
      if (error.response?.status === 404) {
        return null;
      }
      
      throw error;
    }
  },

  // ✅ Get specific user package by ID (unchanged)
  getUserPackageById: async (packageId) => {
    try {
      console.log('📦 Fetching user package by ID:', packageId);
      
      const response = await api.get(`/user-packages/${packageId}`);
      console.log('📦 Package details:', response);
      
      return response;
    } catch (error) {
      console.error('❌ Error fetching user package by ID:', error);
      throw error;
    }
  },

  // ✅ Get current user info to get userId
  getCurrentUser: async () => {
    try {
      console.log('👤 Fetching current user...');
      
      // Try different possible endpoints
      let response;
      try {
        response = await api.get('/auth/me');
        console.log('👤 Got user from /auth/me:', response);
      } catch (e) {
        try {
          response = await api.get('/users/me');
          console.log('👤 Got user from /users/me:', response);
        } catch (e2) {
          try {
            response = await api.get('/user/profile');
            console.log('👤 Got user from /user/profile:', response);
          } catch (e3) {
            // Try to get from localStorage as fallback
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              response = JSON.parse(storedUser);
              console.log('👤 Got user from localStorage:', response);
            } else {
              throw new Error('Unable to fetch current user from any endpoint');
            }
          }
        }
      }
      
      // Normalize response
      const user = response?.data || response;
      console.log('👤 Normalized user:', user);
      
      return user;
    } catch (error) {
      console.error('❌ Error fetching current user:', error);
      throw error;
    }
  },

  // ✅ Get available service packages for purchase
  getAvailablePackages: async () => {
    try {
      console.log('📦 Fetching available service packages...');
      
      const response = await api.get('/service-packages');
      console.log('📦 Available packages:', response);
      
      let packages = [];
      if (Array.isArray(response)) {
        packages = response;
      } else if (response && Array.isArray(response.data)) {
        packages = response.data;
      }
      
      // Filter active packages
      const activePackages = packages.filter(pkg => pkg.status === 'active');
      
      return activePackages;
    } catch (error) {
      console.error('❌ Error fetching available packages:', error);
      throw error;
    }
  },

  // ✅ Purchase a package
  purchasePackage: async (packageId, paymentData) => {
    try {
      console.log('💳 Purchasing package:', packageId, paymentData);
      
      const response = await api.post('/user-packages', {
        servicePackageId: packageId,
        ...paymentData
      });
      
      console.log('✅ Package purchased successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Error purchasing package:', error);
      throw error;
    }
  },

  // ✅ Renew existing package
  renewPackage: async (userPackageId) => {
    try {
      console.log('🔄 Renewing package:', userPackageId);
      
      const response = await api.post(`/user-packages/${userPackageId}/renew`);
      console.log('✅ Package renewed successfully:', response);
      
      return response;
    } catch (error) {
      console.error('❌ Error renewing package:', error);
      throw error;
    }
  },

  // ✅ Cancel package
  cancelPackage: async (userPackageId) => {
    try {
      console.log('❌ Canceling package:', userPackageId);
      
      const response = await api.delete(`/user-packages/${userPackageId}`);
      console.log('✅ Package canceled successfully');
      
      return response;
    } catch (error) {
      console.error('❌ Error canceling package:', error);
      throw error;
    }
  },

  // ✅ Get package usage statistics
  getPackageUsage: async (userPackageId) => {
    try {
      console.log('📊 Fetching package usage:', userPackageId);
      
      const response = await api.get(`/user-packages/${userPackageId}/usage`);
      console.log('📊 Package usage:', response);
      
      return response;
    } catch (error) {
      console.error('❌ Error fetching package usage:', error);
      
      // Return default usage if API doesn't exist yet
      return {
        jobPostsUsed: 0,
        jobPostsLimit: 0,
        cvViewsUsed: 0,
        cvViewsLimit: 0,
        urgentPostsUsed: 0,
        urgentPostsLimit: 0
      };
    }
  },

  // ✅ Calculate remaining posts from package features
  calculateRemainingPosts: async (userPackage, currentJobCount) => {
    try {
      console.log('📊 Calculating remaining posts:', { userPackage, currentJobCount });
      
      if (!userPackage?.servicePackage?.features) {
        return {
          total: 0,
          byType: {},
          availableTypes: []
        };
      }
      
      const features = userPackage.servicePackage.features;
      let totalLimit = 0;
      const byType = {};
      const availableTypes = [];
      
      features.forEach(feature => {
        if (feature.jobPostLimit && feature.jobPostLimit > 0) {
          totalLimit += feature.jobPostLimit;
          
          if (feature.postAt) {
            const used = currentJobCount[feature.postAt] || 0;
            const remaining = Math.max(0, feature.jobPostLimit - used);
            
            byType[feature.postAt] = {
              limit: feature.jobPostLimit,
              used: used,
              remaining: remaining
            };
            
            if (remaining > 0) {
              availableTypes.push({
                type: feature.postAt,
                name: this.getPostTypeName(feature.postAt),
                description: feature.description,
                remaining: remaining,
                feature: feature
              });
            }
          }
        }
      });
      
      const totalUsed = Object.values(currentJobCount).reduce((sum, count) => sum + (count || 0), 0);
      const totalRemaining = Math.max(0, totalLimit - totalUsed);
      
      return {
        total: totalRemaining,
        byType: byType,
        availableTypes: availableTypes
      };
    } catch (error) {
      console.error('❌ Error calculating remaining posts:', error);
      return {
        total: 0,
        byType: {},
        availableTypes: []
      };
    }
  },

  // ✅ Helper function to get post type display name
  getPostTypeName: (postType) => {
    const typeNames = {
      'standard': 'Standard Post',
      'premium': 'Premium Post', 
      'urgent': 'Urgent Post',
      'proposal': 'Proposal Post'
    };
    return typeNames[postType] || postType;
  },

  // ✅ Test package endpoints
  testPackageEndpoints: async () => {
    try {
      console.log('🧪 Testing package endpoints...');
      
      const results = {
        currentUser: null,
        userPackages: null,
        activePackage: null,
        availablePackages: null,
        errors: []
      };
      
      // Test getting current user
      try {
        results.currentUser = await this.getCurrentUser();
        console.log('✅ Current user test passed');
      } catch (error) {
        console.log('❌ Current user test failed:', error.message);
        results.errors.push(`Current user: ${error.message}`);
      }
      
      // Test getting user packages
      try {
        const userId = results.currentUser?.id;
        if (userId) {
          results.userPackages = await this.getUserPackages(userId);
          console.log('✅ User packages test passed');
        } else {
          throw new Error('No user ID available');
        }
      } catch (error) {
        console.log('❌ User packages test failed:', error.message);
        results.errors.push(`User packages: ${error.message}`);
      }
      
      // Test getting active package
      try {
        results.activePackage = await this.getUserActivePackage();
        console.log('✅ Active package test passed');
      } catch (error) {
        console.log('❌ Active package test failed:', error.message);
        results.errors.push(`Active package: ${error.message}`);
      }
      
      // Test getting available packages
      try {
        results.availablePackages = await this.getAvailablePackages();
        console.log('✅ Available packages test passed');
      } catch (error) {
        console.log('❌ Available packages test failed:', error.message);
        results.errors.push(`Available packages: ${error.message}`);
      }
      
      console.log('🧪 Package endpoints test results:', results);
      return results;
    } catch (error) {
      console.error('❌ Package endpoints test failed:', error);
      return {
        currentUser: null,
        userPackages: null,
        activePackage: null,
        availablePackages: null,
        errors: [error.message]
      };
    }
  }
};

// ✅ Export job count functionality to main jobService
export const jobServiceExtension = {
  // Get current user's job count by type
  getUserJobCount: async () => {
    try {
      console.log('📊 Fetching user job count...');
      
      // Try dedicated count endpoint first
      try {
        const response = await api.get('/jobs/recruiter/count');
        console.log('📊 Job count from dedicated endpoint:', response);
        
        return response || { total: 0, standard: 0, premium: 0, urgent: 0, proposal: 0 };
      } catch (countError) {
        console.log('📊 Dedicated count endpoint failed, falling back to jobs list...');
        
        // Fallback: get all jobs and count them
        const jobs = await api.get('/jobs/recruiter');
        console.log('📊 Jobs for counting:', jobs);
        
        const jobsArray = Array.isArray(jobs) ? jobs : (jobs?.data || []);
        
        const count = {
          total: jobsArray.length,
          standard: 0,
          premium: 0,
          urgent: 0,
          proposal: 0
        };
        
        jobsArray.forEach(job => {
          if (job.postAt) {
            count[job.postAt] = (count[job.postAt] || 0) + 1;
          } else {
            // Default to standard if no postAt specified
            count.standard = (count.standard || 0) + 1;
          }
        });
        
        console.log('📊 Calculated job count:', count);
        return count;
      }
    } catch (error) {
      console.error('❌ Error fetching job count:', error);
      return { total: 0, standard: 0, premium: 0, urgent: 0, proposal: 0 };
    }
  }
};

export default packageService;