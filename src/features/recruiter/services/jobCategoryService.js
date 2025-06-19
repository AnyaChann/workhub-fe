import api from '../../../shared/utils/helpers/api';

export const jobCategoryService = {
  // Get all job categories
  getAllJobCategories: async () => {
    try {
      const response = await api.get('/job-categories');
      return response;
    } catch (error) {
      console.error('Error fetching job categories:', error);
      throw error;
    }
  },

  // Get job category by ID
  getJobCategoryById: async (id) => {
    try {
      const response = await api.get(`/job-categories/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching job category:', error);
      throw error;
    }
  },

  // Create new job category
  createJobCategory: async (categoryData) => {
    try {
      const response = await api.post('/job-categories', categoryData);
      return response;
    } catch (error) {
      console.error('Error creating job category:', error);
      throw error;
    }
  },

  // Update job category
  updateJobCategory: async (id, categoryData) => {
    try {
      const response = await api.put(`/job-categories/${id}`, categoryData);
      return response;
    } catch (error) {
      console.error('Error updating job category:', error);
      throw error;
    }
  },

  // Delete job category
  deleteJobCategory: async (id) => {
    try {
      const response = await api.delete(`/job-categories/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting job category:', error);
      throw error;
    }
  }
};