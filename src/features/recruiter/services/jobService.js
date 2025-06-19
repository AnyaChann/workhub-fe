import api from '../../../shared/utils/helpers/api';

export const jobService = {
  // ✅ Updated to handle actual API response structure
  getRecruiterJobs: async () => {
    try {
      console.log('📋 Fetching recruiter jobs...');
      console.log('🔐 Current auth state:', {
        token: localStorage.getItem('accessToken') ? 'Present' : 'Missing',
        user: JSON.parse(localStorage.getItem('user') || '{}')
      });
      
      const response = await api.get('/jobs/recruiter');
      
      console.log('📥 Raw API response:', response);
      console.log('📊 Response type:', typeof response);
      console.log('📊 Response keys:', Object.keys(response || {}));
      
      // ✅ Handle API response - should be array of jobs
      let jobs = [];
      
      if (Array.isArray(response)) {
        jobs = response;
      } else if (response && Array.isArray(response.data)) {
        jobs = response.data;
      } else if (response && typeof response === 'object') {
        console.log('📊 Response structure:', response);
        jobs = []; // Empty array if no jobs found
      } else {
        console.warn('⚠️ Unexpected response format:', response);
        jobs = [];
      }
      
      console.log('📋 Jobs array from API:', jobs);
      
      // ✅ Map API response to frontend format based on actual API structure
      const mappedJobs = jobs.map(job => ({
        // ✅ Direct mapping from API response
        id: job.id,
        title: job.title || 'Untitled Job',
        description: job.description || 'No description available',
        location: job.location || 'Not specified',
        salaryRange: job.salaryRange || 'Competitive',
        experience: job.experience || 'Not specified',
        deadline: job.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        
        // ✅ Additional fields from API
        companyName: job.companyName || 'Company Name',
        companyLogo: job.companyLogo || null,
        category: job.category || 'General',
        type: job.type || 'Full-time',
        position: job.position || 'Position',
        skills: job.skills || [],
        
        // ✅ Computed fields for frontend
        createdAt: job.createdAt || new Date().toISOString(), // API might not return this
        postAt: job.postAt || 'STANDARD', // Default post type
        
        // ✅ Status derivation based on deadline
        status: deriveJobStatusFromAPI(job),
        isExpired: job.deadline ? new Date(job.deadline) < new Date() : false,
        daysUntilDeadline: job.deadline ? calculateDaysUntilDeadline(job.deadline) : null,
        isRecent: job.createdAt ? isRecentJob(job.createdAt) : true,
        
        // ✅ Display formatting
        displaySalary: formatSalaryRange(job.salaryRange),
        displayLocation: job.location || 'Remote',
        displayExperience: formatExperience(job.experience),
        displayCompany: job.companyName || 'Your Company',
        displayCategory: job.category || 'General',
        displayType: job.type || 'Full-time',
        displayPosition: job.position || 'Position',
        
        // ✅ Skills formatting
        skillsList: Array.isArray(job.skills) ? job.skills : [],
        skillsDisplay: Array.isArray(job.skills) ? job.skills.join(', ') : 'No skills specified'
      }));
      
      console.log('✅ Mapped jobs:', mappedJobs);
      return mappedJobs;
      
    } catch (error) {
      console.error('❌ Error fetching recruiter jobs:', error);
      
      // Enhanced error logging
      if (error.response) {
        console.error('📤 Request URL:', error.config?.url);
        console.error('📤 Request headers:', error.config?.headers);
        console.error('📥 Response status:', error.response.status);
        console.error('📥 Response headers:', error.response.headers);
        console.error('📥 Response data:', error.response.data);
        
        // Handle specific HTTP errors
        switch (error.response.status) {
          case 401:
            console.error('🔐 Unauthorized - Token might be expired or invalid');
            break;
          case 403:
            console.error('🚫 Forbidden - User might not be a recruiter or lack permissions');
            break;
          case 404:
            console.error('� Endpoint not found - Check API URL: /jobs/recruiter');
            break;
          case 500:
            console.error('💥 Server error - Backend issue');
            console.error('💡 This might be due to:');
            console.error('   - Database connection issues');
            console.error('   - Missing JWT token processing');
            console.error('   - Backend service errors');
            break;
          default:
            console.error(`❓ HTTP ${error.response.status}: ${error.response.statusText}`);
        }
      } else if (error.request) {
        console.error('📡 Network error - No response received:', error.request);
        console.error('💡 This might be due to:');
        console.error('   - Backend server is down');
        console.error('   - CORS issues');
        console.error('   - Network connectivity problems');
      } else {
        console.error('⚙️ Request setup error:', error.message);
      }
      
      // Re-throw with more context
      const enhancedError = new Error(
        error.response?.data?.message || 
        error.response?.data?.error ||
        error.message || 
        'Failed to fetch jobs'
      );
      enhancedError.status = error.response?.status;
      enhancedError.originalError = error;
      
      throw enhancedError;
    }
  },

  // ✅ Test connection with actual jobs endpoint
  testConnection: async () => {
    try {
      console.log('🔌 Testing API connection...');
      
      // Test the general jobs endpoint first
      const response = await api.get('/jobs');
      console.log('✅ General jobs API connection successful:', response);
      return true;
    } catch (error) {
      console.error('❌ API connection failed:', error);
      return false;
    }
  },

  // ✅ Test recruiter endpoint specifically
  testRecruiterEndpoint: async () => {
    try {
      console.log('🔌 Testing recruiter jobs endpoint...');
      
      const response = await api.get('/jobs/recruiter');
      console.log('✅ Recruiter jobs endpoint successful:', response);
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ Recruiter endpoint failed:', error);
      return { 
        success: false, 
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      };
    }
  },

  // ✅ Get current user info
  getCurrentUser: async () => {
    try {
      // Try different possible user endpoints
      let response;
      try {
        response = await api.get('/auth/me');
      } catch (e) {
        try {
          response = await api.get('/users/me');
        } catch (e2) {
          response = await api.get('/user/profile');
        }
      }
      
      console.log('👤 Current user:', response);
      return response;
    } catch (error) {
      console.error('❌ Failed to get current user:', error);
      throw error;
    }
  },

  // ✅ Create job with API structure
  createJob: async (jobData) => {
    try {
      console.log('📝 Creating job with data:', jobData);
      
      // Map to API expected format
      const apiPayload = {
        title: jobData.title,
        description: jobData.description,
        location: jobData.location,
        salaryRange: jobData.salaryRange,
        experience: jobData.experience,
        deadline: jobData.deadline,
        category: jobData.category,
        type: jobData.type,
        position: jobData.position,
        skills: jobData.skills || []
      };
      
      console.log('📤 API payload:', apiPayload);
      
      const response = await api.post('/jobs', apiPayload);
      console.log('✅ Job created successfully:', response);
      
      return response;
    } catch (error) {
      console.error('❌ Error creating job:', error);
      throw error;
    }
  },

  // ✅ Update job
  updateJob: async (jobId, jobData) => {
    try {
      console.log('✏️ Updating job:', jobId, jobData);
      
      const apiPayload = {
        title: jobData.title,
        description: jobData.description,
        location: jobData.location,
        salaryRange: jobData.salaryRange,
        experience: jobData.experience,
        deadline: jobData.deadline,
        category: jobData.category,
        type: jobData.type,
        position: jobData.position,
        skills: jobData.skills || []
      };
      
      const response = await api.put(`/jobs/${jobId}`, apiPayload);
      console.log('✅ Job updated successfully:', response);
      
      return response;
    } catch (error) {
      console.error('❌ Error updating job:', error);
      throw error;
    }
  },

  // ✅ Delete job
  deleteJob: async (jobId) => {
    try {
      console.log('🗑️ Deleting job:', jobId);
      const response = await api.delete(`/jobs/${jobId}`);
      console.log('✅ Job deleted successfully');
      return response;
    } catch (error) {
      console.error('❌ Error deleting job:', error);
      throw error;
    }
  }
};

// ✅ Helper functions updated for API response
function deriveJobStatusFromAPI(job) {
  try {
    const now = new Date();
    const deadline = job.deadline ? new Date(job.deadline) : null;
    
    // If no deadline, consider it active
    if (!deadline) {
      return 'active';
    }
    
    // If deadline has passed, it's expired
    if (deadline < now) {
      return 'expired';
    }
    
    // Default to active
    return 'active';
  } catch (error) {
    console.warn('⚠️ Error deriving job status:', error);
    return 'active';
  }
}

function calculateDaysUntilDeadline(deadline) {
  try {
    if (!deadline) return null;
    
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch (error) {
    console.warn('⚠️ Error calculating days until deadline:', error);
    return null;
  }
}

function isRecentJob(createdAt) {
  try {
    if (!createdAt) return false;
    
    const now = new Date();
    const created = new Date(createdAt);
    const diffDays = (now - created) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  } catch (error) {
    console.warn('⚠️ Error checking if job is recent:', error);
    return false;
  }
}

function formatSalaryRange(salaryRange) {
  try {
    if (!salaryRange) return 'Competitive';
    
    if (typeof salaryRange === 'string') {
      return salaryRange;
    }
    
    if (typeof salaryRange === 'object') {
      const { min, max, currency = 'USD' } = salaryRange;
      if (min && max) {
        return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
      }
    }
    
    return salaryRange.toString();
  } catch (error) {
    console.warn('⚠️ Error formatting salary range:', error);
    return 'Competitive';
  }
}

function formatExperience(experience) {
  try {
    if (!experience) return 'Not specified';
    
    if (typeof experience === 'number') {
      return `${experience}+ years`;
    }
    
    return experience.toString();
  } catch (error) {
    console.warn('⚠️ Error formatting experience:', error);
    return 'Not specified';
  }
}

export default jobService;