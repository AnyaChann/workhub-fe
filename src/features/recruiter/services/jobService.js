import api from '../../../shared/utils/helpers/api';

export const jobService = {
  // ✅ Updated getRecruiterJobs to handle correct API structure
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

      // ✅ Enhanced mapping for correct API structure
      const mappedJobs = jobs.map((job, index) => {
        console.log(`📋 Processing job ${index}:`, job);
        
        // ✅ According to API schema - category, type, position, skills are strings/arrays
        const categoryString = job.category || '';
        const typeString = job.type || '';
        const positionString = job.position || '';
        const skillsArray = Array.isArray(job.skills) ? job.skills : [];

        console.log(`📋 Job ${index} string data:`, {
          category: categoryString,
          type: typeString,
          position: positionString,
          skills: skillsArray
        });

        const mappedJob = {
          // ✅ Direct mapping from API response
          id: job.id,
          title: job.title || 'Untitled Job',
          description: job.description || 'No description available',
          location: job.location || 'Not specified',
          salaryRange: job.salaryRange || 'Competitive',
          experience: job.experience || 'Not specified',
          deadline: job.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),

          // ✅ Store string values as-is from API
          category: categoryString,
          categoryId: null, // No ID in this API structure
          categoryName: categoryString,

          type: typeString,
          typeId: null, // No ID in this API structure
          typeName: typeString,

          position: positionString,
          positionId: null, // No ID in this API structure
          positionName: positionString,

          skills: skillsArray,
          skillIds: [], // No IDs in this API structure
          skillNames: skillsArray,

          // ✅ Company info
          companyName: job.companyName || 'Company Name',
          companyLogo: job.companyLogo || null,

          // ✅ Computed fields for frontend
          createdAt: job.createdAt || new Date().toISOString(),
          postAt: job.postAt || 'STANDARD',

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
          displayCategory: categoryString || 'General',
          displayType: typeString || 'Full-time',
          displayPosition: positionString || 'Position',

          // ✅ Skills formatting
          skillsList: skillsArray,
          skillsDisplay: skillsArray.length > 0 
            ? skillsArray.join(', ') 
            : 'No skills specified'
        };

        console.log(`📋 Mapped job ${index}:`, mappedJob);
        return mappedJob;
      });

      console.log('✅ All mapped jobs:', mappedJobs);
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
            console.error('🔍 Endpoint not found - Check API URL: /jobs/recruiter');
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

  // ✅ Update createJob method to match new API structure
  createJob: async (jobData) => {
    try {
      console.log('📝 Creating job with data:', jobData);

      // ✅ Map form data to API expected format (strings not objects)
      const apiPayload = {
        title: jobData.title,
        description: jobData.description,
        salaryRange: jobData.salaryRange || 'Competitive',
        experience: jobData.experience || 'Not specified',
        location: jobData.location,
        deadline: jobData.deadline,

        // ✅ Send strings for category, type, position - not objects with IDs
        category: jobData.categoryName || jobData.category || '',
        type: jobData.typeName || jobData.type || '',
        position: jobData.positionName || jobData.position || '',

        // ✅ Skills as array of strings
        skills: Array.isArray(jobData.skillNames) 
          ? jobData.skillNames 
          : Array.isArray(jobData.skills) 
            ? jobData.skills.map(skill => typeof skill === 'string' ? skill : skill.name || skill)
            : []
      };

      console.log('📤 API payload:', apiPayload);

      const response = await api.post('/jobs', apiPayload);
      console.log('✅ Job created successfully:', response);

      return response;
    } catch (error) {
      console.error('❌ Error creating job:', error);

      // Enhanced error handling for create job
      if (error.response) {
        console.error('📥 Create job error response:', error.response.data);

        let errorMessage = 'Failed to create job';

        if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Invalid job data provided';
        } else if (error.response.status === 401) {
          errorMessage = 'Authentication required. Please log in again.';
        } else if (error.response.status === 403) {
          errorMessage = 'You do not have permission to create jobs';
        } else if (error.response.status === 422) {
          errorMessage = 'Validation failed. Please check your input data.';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }

        const enhancedError = new Error(errorMessage);
        enhancedError.status = error.response.status;
        enhancedError.validationErrors = error.response.data?.errors;
        throw enhancedError;
      }

      throw error;
    }
  },

  updateJob: async (jobId, jobData) => {
    try {
      console.log('✏️ Updating job:', jobId, jobData);

      // Kiểm tra ID hợp lệ
      if (!jobId || isNaN(parseInt(jobId))) {
        throw new Error('Invalid job ID provided');
      }

      // ✅ Map form data to API expected format (strings not objects)
      const apiPayload = {
        title: jobData.title,
        description: jobData.description,
        location: jobData.location,
        salaryRange: jobData.salaryRange,
        experience: jobData.experience,
        deadline: jobData.deadline,

        // ✅ Send strings for category, type, position - not objects with IDs
        category: jobData.categoryName || jobData.category || '',
        type: jobData.typeName || jobData.type || '',
        position: jobData.positionName || jobData.position || '',

        // ✅ Skills as array of strings
        skills: Array.isArray(jobData.skillNames) 
          ? jobData.skillNames 
          : Array.isArray(jobData.skills) 
            ? jobData.skills.map(skill => typeof skill === 'string' ? skill : skill.name || skill)
            : []
      };

      console.log('📤 API payload for update:', apiPayload);

      // Gọi API để cập nhật job
      const response = await api.put(`/jobs/${jobId}`, apiPayload);

      console.log('✅ Job updated successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Error updating job:', error);

      // Enhanced error handling for update job
      if (error.response) {
        console.error('📥 Update job error response:', error.response.data);

        let errorMessage = 'Failed to update job';
        let validationErrors = {};

        // Xử lý các loại lỗi từ API trả về
        if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Invalid job data provided';
          validationErrors = error.response.data?.errors || {};
        } else if (error.response.status === 401) {
          errorMessage = 'Your session has expired. Please log in again.';
        } else if (error.response.status === 403) {
          errorMessage = 'You do not have permission to edit this job';
        } else if (error.response.status === 404) {
          errorMessage = 'Job not found. It may have been deleted.';
        } else if (error.response.status === 422) {
          errorMessage = 'Validation failed. Please check your input data.';
          validationErrors = error.response.data?.errors || {};
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }

        // Tạo error object có thêm thông tin
        const enhancedError = new Error(errorMessage);
        enhancedError.status = error.response.status;
        enhancedError.validationErrors = validationErrors;
        enhancedError.originalError = error;

        throw enhancedError;
      }

      // Nếu không phải lỗi response (như network error)
      throw error;
    }
  },

  // ✅ Thêm phương thức editJob như alias của updateJob để mã dễ đọc hơn
  editJob: async (jobId, jobData) => {
    return jobService.updateJob(jobId, jobData);
  },

  // Rest of existing methods...
  testConnection: async () => {
    try {
      console.log('🔌 Testing API connection...');
      const response = await api.get('/jobs');
      console.log('✅ General jobs API connection successful:', response);
      return true;
    } catch (error) {
      console.error('❌ API connection failed:', error);
      return false;
    }
  },

  testRecruiterEndpoint: async () => {
    try {
      console.log('� Testing recruiter jobs endpoint...');
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

  getCurrentUser: async () => {
    try {
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

  getJobFormOptions: async () => {
    try {
      console.log('📋 Fetching job form options...');

      const [categoriesRes, typesRes, positionsRes, skillsRes] = await Promise.allSettled([
        api.get('/categories'),
        api.get('/job-types'),
        api.get('/positions'),
        api.get('/skills')
      ]);

      return {
        categories: categoriesRes.status === 'fulfilled' ? categoriesRes.value : [],
        types: typesRes.status === 'fulfilled' ? typesRes.value : [],
        positions: positionsRes.status === 'fulfilled' ? positionsRes.value : [],
        skills: skillsRes.status === 'fulfilled' ? skillsRes.value : []
      };
    } catch (error) {
      console.error('❌ Error fetching form options:', error);
      return {
        categories: [],
        types: [],
        positions: [],
        skills: []
      };
    }
  },

  deleteJob: async (jobId) => {
    try {
      console.log('🗑️ Deleting job:', jobId);

      if (!jobId || isNaN(parseInt(jobId))) {
        throw new Error('Invalid job ID provided');
      }

      const response = await api.delete(`/jobs/${jobId}`);
      console.log('✅ Job deleted successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Error deleting job:', error);

      if (error.response) {
        console.error('📥 Delete job error response:', error.response.data);

        let errorMessage = 'Failed to delete job';

        if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Invalid job ID provided';
        } else if (error.response.status === 401) {
          errorMessage = 'Your session has expired. Please log in again.';
        } else if (error.response.status === 403) {
          errorMessage = 'You do not have permission to delete this job';
        } else if (error.response.status === 404) {
          errorMessage = 'Job not found. It may have been deleted already.';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }

        const enhancedError = new Error(errorMessage);
        enhancedError.status = error.response.status;
        enhancedError.originalError = error;

        throw enhancedError;
      }

      throw error;
    }
  }
};

// Helper functions remain the same
function deriveJobStatusFromAPI(job) {
  try {
    const now = new Date();
    const deadline = job.deadline ? new Date(job.deadline) : null;

    if (!deadline) {
      return 'active';
    }

    if (deadline < now) {
      return 'expired';
    }

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