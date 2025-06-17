import api from './api';

export const jobPositionService = {
  // Get all job positions
  getAllJobPositions: async () => {
    try {
      const response = await api.get('/job-positions');
      return response;
    } catch (error) {
      console.error('Error fetching job positions:', error);
      throw error;
    }
  },

  // Get job positions by category ID
  getJobPositionsByCategory: async (categoryId) => {
    try {
      const response = await api.get(`/job-positions?categoryId=${categoryId}`);
      return response;
    } catch (error) {
      console.error('Error fetching job positions by category:', error);
      throw error;
    }
  },

  // Get job position by ID
  getJobPositionById: async (id) => {
    try {
      const response = await api.get(`/job-positions/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching job position:', error);
      throw error;
    }
  },

  // Create new job position
  createJobPosition: async (positionData) => {
    try {
      const response = await api.post('/job-positions', positionData);
      return response;
    } catch (error) {
      console.error('Error creating job position:', error);
      throw error;
    }
  },

  // Update job position
  updateJobPosition: async (id, positionData) => {
    try {
      const response = await api.put(`/job-positions/${id}`, positionData);
      return response;
    } catch (error) {
      console.error('Error updating job position:', error);
      throw error;
    }
  },

  // Delete job position
  deleteJobPosition: async (id) => {
    try {
      const response = await api.delete(`/job-positions/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting job position:', error);
      throw error;
    }
  }
};