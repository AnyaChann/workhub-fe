// src/services/savedJobService.js
import api from './api';

export const savedJobService = {
  // Get saved jobs (candidate)
  getSavedJobs: async () => {
    return await api.get('/saved-jobs');
  },

  // Save job (candidate)
  saveJob: async (jobId) => {
    return await api.post('/saved-jobs', { jobId });
  },

  // Remove saved job (candidate)
  removeSavedJob: async (savedJobId) => {
    return await api.delete(`/saved-jobs/${savedJobId}`);
  },
};