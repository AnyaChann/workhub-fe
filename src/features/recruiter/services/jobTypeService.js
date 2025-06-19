import api from '../../../shared/utils/helpers/api'; // Import axios instance

export const jobTypeService = {
  // Get all job types
  getAllJobTypes: async () => {
    try {
      const response = await api.get('/job-types');
      return response;
    } catch (error) {
      console.error('Error fetching job types:', error);
      throw error;
    }
  },

  // Get job type by ID
  getJobTypeById: async (id) => {
    try {
      const response = await api.get(`/job-types/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching job type:', error);
      throw error;
    }
  },

  // Create new job type
  createJobType: async (jobTypeData) => {
    try {
      const response = await api.post('/job-types', jobTypeData);
      return response;
    } catch (error) {
      console.error('Error creating job type:', error);
      throw error;
    }
  },

  // Update job type
  updateJobType: async (id, jobTypeData) => {
    try {
      const response = await api.put(`/job-types/${id}`, jobTypeData);
      return response;
    } catch (error) {
      console.error('Error updating job type:', error);
      throw error;
    }
  },

  // Delete job type
  deleteJobType: async (id) => {
    try {
      const response = await api.delete(`/job-types/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting job type:', error);
      throw error;
    }
  }
};