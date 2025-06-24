import api from '../../../shared/utils/helpers/api';
import { servicePackageService } from './servicePackageService';

export const packageService = {
  // ✅ Get user's packages - sử dụng servicePackageService
  getUserPackages: async (userId = null) => {
    try {
      console.log('📦 Getting user packages via servicePackageService...');
      return await servicePackageService.getUserPackages(userId);
    } catch (error) {
      console.error('❌ Error in packageService.getUserPackages:', error);
      throw error;
    }
  },

  // ✅ Get user's active package with enhanced logic
  getUserActivePackage: async (userId = null) => {
    try {
      console.log('📦 Finding user active package...');
      
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      const packages = await servicePackageService.getUserPackages(userId);
      
      if (!packages || packages.length === 0) {
        console.log('📦 No packages found for user');
        return null;
      }
      
      // ✅ Find active package that hasn't expired
      const now = new Date();
      console.log('📅 Current time:', now.toISOString());
      
      const activePackages = packages.filter(pkg => {
        const isActive = pkg.status === 'active';
        const expirationDate = new Date(pkg.expirationDate);
        const notExpired = expirationDate > now;
        
        console.log('📦 Checking package:', {
          id: pkg.id,
          name: pkg.servicePackage?.name,
          status: pkg.status,
          expirationDate: pkg.expirationDate,
          isActive,
          notExpired,
          daysUntilExpiry: Math.ceil((expirationDate - now) / (1000 * 60 * 60 * 24))
        });
        
        return isActive && notExpired;
      });
      
      if (activePackages.length === 0) {
        console.log('📦 No active non-expired packages found');
        return null;
      }
      
      // ✅ If multiple active packages, choose the one with latest expiration
      const selectedPackage = activePackages.reduce((latest, current) => {
        const latestExp = new Date(latest.expirationDate);
        const currentExp = new Date(current.expirationDate);
        return currentExp > latestExp ? current : latest;
      });
      
      console.log('📦 Selected active package:', {
        id: selectedPackage.id,
        name: selectedPackage.servicePackage?.name,
        features: selectedPackage.servicePackage?.features?.length || 0,
        expirationDate: selectedPackage.expirationDate
      });
      
      return selectedPackage;
      
    } catch (error) {
      console.error('❌ Error getting user active package:', error);
      
      if (error.response?.status === 404) {
        return null;
      }
      
      throw error;
    }
  },

  // ✅ Get specific user package by ID
  getUserPackageById: async (packageId) => {
    try {
      console.log('📦 Getting user package by ID via servicePackageService...');
      return await servicePackageService.getUserPackageById(packageId);
    } catch (error) {
      console.error('❌ Error in packageService.getUserPackageById:', error);
      throw error;
    }
  },

  // ✅ Calculate remaining posts from package features
  calculateRemainingPosts: async (userPackage, currentJobCount) => {
    try {
      console.log('📊 Calculating remaining posts:', { 
        packageId: userPackage?.id,
        packageName: userPackage?.servicePackage?.name,
        currentJobCount 
      });
      
      if (!userPackage?.servicePackage?.features) {
        console.log('📊 No package features found');
        return {
          total: 0,
          byType: {},
          availableTypes: []
        };
      }
      
      const features = userPackage.servicePackage.features;
      console.log('📊 Package features:', features);
      
      let totalLimit = 0;
      const byType = {};
      const availableTypes = [];
      
      features.forEach(feature => {
        console.log('📊 Processing feature:', {
          id: feature.id,
          featureName: feature.featureName,
          postAt: feature.postAt,
          jobPostLimit: feature.jobPostLimit,
          description: feature.description
        });
        
        if (feature.jobPostLimit && feature.jobPostLimit > 0) {
          totalLimit += feature.jobPostLimit;
          
          if (feature.postAt) {
            const used = currentJobCount[feature.postAt] || 0;
            const remaining = Math.max(0, feature.jobPostLimit - used);
            
            byType[feature.postAt] = {
              limit: feature.jobPostLimit,
              used: used,
              remaining: remaining,
              featureName: feature.featureName
            };
            
            console.log('📊 Post type calculation:', {
              type: feature.postAt,
              limit: feature.jobPostLimit,
              used,
              remaining
            });
            
            // ✅ Add to available types even if remaining is 0 (for display)
            availableTypes.push({
              type: feature.postAt,
              name: this.getPostTypeName(feature.postAt),
              description: feature.description || feature.featureName,
              remaining: remaining,
              limit: feature.jobPostLimit,
              used: used,
              feature: feature,
              isAvailable: remaining > 0
            });
          }
        }
      });
      
      // ✅ Calculate total used and remaining
      const totalUsed = Object.values(currentJobCount).reduce((sum, count) => {
        return sum + (typeof count === 'number' ? count : 0);
      }, 0) - (currentJobCount.total || 0); // Subtract total to avoid double counting
      
      const actualTotalUsed = Math.max(0, currentJobCount.total || totalUsed);
      const totalRemaining = Math.max(0, totalLimit - actualTotalUsed);
      
      const result = {
        total: totalRemaining,
        totalLimit: totalLimit,
        totalUsed: actualTotalUsed,
        byType: byType,
        availableTypes: availableTypes.sort((a, b) => {
          // Sort by available first, then by remaining count
          if (a.isAvailable && !b.isAvailable) return -1;
          if (!a.isAvailable && b.isAvailable) return 1;
          return b.remaining - a.remaining;
        })
      };
      
      console.log('📊 Final calculation result:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Error calculating remaining posts:', error);
      return {
        total: 0,
        totalLimit: 0,
        totalUsed: 0,
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
    return typeNames[postType] || postType.charAt(0).toUpperCase() + postType.slice(1);
  },

  // ✅ Get available service packages for purchase
  getAvailablePackages: async () => {
    try {
      console.log('📦 Getting available packages via servicePackageService...');
      const packages = await servicePackageService.getAllPackages();
      
      // ✅ Filter active packages only
      const activePackages = packages.filter(pkg => pkg.status === 'active');
      console.log('📦 Active available packages:', activePackages);
      
      return activePackages;
    } catch (error) {
      console.error('❌ Error getting available packages:', error);
      throw error;
    }
  },

  // ✅ Purchase a package
  purchasePackage: async (userId, packageId) => {
    try {
      console.log('💰 Purchasing package for user:', userId, 'Package:', packageId);
      
      // ✅ Lấy thông tin gói để biết giá
      const packageInfo = await servicePackageService.getPackageById(packageId);
      if (!packageInfo) {
        throw new Error('Package not found');
      }
      
      const price = packageInfo.price || 499000; // Fallback price
      const description = `Purchase: ${packageInfo.name || 'Package'}`;
      
      // ✅ Gọi API test payment (sẽ được thay thế bằng endpoint thực tế)
      const response = await servicePackageService.purchasePackageTest(
        packageId, 
        price, 
        description
      );
      
      return {
        success: true,
        data: response,
        message: `Package ${packageInfo.name || 'Package'} purchased successfully!`
      };
      
    } catch (error) {
      console.error('❌ Error purchasing package:', error);
      
      return {
        success: false,
        error: error.message || 'Failed to purchase package',
        details: error.response?.data || {},
        statusCode: error.response?.status || 500
      };
    }
  },

  // ✅ Renew a package
  renewPackage: async (userId, userPackageId) => {
    try {
      console.log('🔄 Renewing package for user:', userId, 'UserPackage:', userPackageId);
      
      // ✅ Lấy thông tin gói người dùng đang sử dụng
      const userPackageInfo = await servicePackageService.getUserPackageById(userPackageId);
      if (!userPackageInfo) {
        throw new Error('User package not found');
      }
      
      const packageId = userPackageInfo.servicePackage?.id;
      if (!packageId) {
        throw new Error('Invalid package reference');
      }
      
      const price = userPackageInfo.price || userPackageInfo.servicePackage?.price || 499000;
      const packageName = userPackageInfo.servicePackage?.name || 'Package';
      const description = `Renewal: ${packageName}`;
      
      // ✅ Gọi API test renewal (sẽ được thay thế bằng endpoint thực tế)
      const response = await servicePackageService.renewPackageTest(
        packageId,
        price,
        description
      );
      
      return {
        success: true,
        data: response,
        message: `Package ${packageName} renewed successfully!`
      };
      
    } catch (error) {
      console.error('❌ Error renewing package:', error);
      
      return {
        success: false,
        error: error.message || 'Failed to renew package',
        details: error.response?.data || {},
        statusCode: error.response?.status || 500
      };
    }
  },

  // ✅ Enhanced package validation
  validatePackageForJobPosting: (userPackage, postType = 'standard') => {
    if (!userPackage) {
      return {
        isValid: false,
        error: 'No active package found',
        canPost: false
      };
    }

    if (userPackage.status !== 'active') {
      return {
        isValid: false,
        error: 'Package is not active',
        canPost: false
      };
    }

    const now = new Date();
    const expirationDate = new Date(userPackage.expirationDate);
    if (expirationDate <= now) {
      return {
        isValid: false,
        error: 'Package has expired',
        canPost: false
      };
    }

    const features = userPackage.servicePackage?.features || [];
    const relevantFeature = features.find(f => f.postAt === postType && f.jobPostLimit > 0);
    
    if (!relevantFeature) {
      return {
        isValid: false,
        error: `Post type '${postType}' is not available in your package`,
        canPost: false
      };
    }

    return {
      isValid: true,
      error: null,
      canPost: true,
      feature: relevantFeature
    };
  }
};

// ✅ Job count functionality
export const jobServiceExtension = {
  // Get current user's job count by type
  getUserJobCount: async () => {
    try {
      console.log('📊 Fetching user job count...');
      
      // ✅ Try dedicated count endpoint first
      try {
        const response = await api.get('/jobs/recruiter/count');
        console.log('📊 Job count from dedicated endpoint:', response);
        
        const count = response?.data || response || {};
        
        // ✅ Ensure all required fields exist
        return {
          total: count.total || 0,
          standard: count.standard || 0,
          premium: count.premium || 0,
          urgent: count.urgent || 0,
          proposal: count.proposal || 0
        };
      } catch (countError) {
        console.log('📊 Dedicated count endpoint failed, falling back to jobs list...');
        
        // ✅ Fallback: get all jobs and count them
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
          const postType = job.postAt || 'standard';
          if (count.hasOwnProperty(postType)) {
            count[postType] = (count[postType] || 0) + 1;
          } else {
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