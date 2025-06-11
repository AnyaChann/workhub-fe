// src/services/jobService.js
import api from './api';

export const jobService = {
  // Get all jobs (for candidates)
  getAllJobs: async (params) => {
    return await api.get('/jobs', { params });
  },

  // Get jobs by location
  getJobsByLocation: async (postAt) => {
    return await api.get(`/jobs/postat/${postAt}`);
  },

  // Get employer's jobs
  getEmployerJobs: async (userId) => {
    return await api.get(`/jobs/${userId}`);
  },

  // Create new job (employer)
  createJob: async (userId, jobData) => {
    return await api.post(`/jobs/${userId}`, jobData);
  },

  // Update job (employer)
  updateJob: async (userId, jobId, jobData) => {
    return await api.put(`/jobs/${userId}/${jobId}`, jobData);
  },

  // Delete job (employer)
  deleteJob: async (userId, jobId) => {
    return await api.delete(`/jobs/${userId}/${jobId}`);
  },
};