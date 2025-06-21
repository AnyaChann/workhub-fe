// src/services/resumeService.js
import api from '../helpers/api';

export const resumeService = {
  // Get all resumes (employer view)
  getAllResumes: async () => {
    return await api.get('/resumes');
  },

  // Get user's resumes (candidate)
  getUserResumes: async (userId) => {
    return await api.get(`/resumes/${userId}`);
  },

  // Create new resume (candidate)
  createResume: async (userId, resumeData) => {
    return await api.post(`/resumes/${userId}`, resumeData);
  },

  // Update resume (candidate)
  updateResume: async (userId, resumeId, resumeData) => {
    return await api.put(`/resumes/${userId}/${resumeId}`, resumeData);
  },

  // Delete resume (candidate)
  deleteResume: async (userId, resumeId) => {
    return await api.delete(`/resumes/${userId}/${resumeId}`);
  },
};