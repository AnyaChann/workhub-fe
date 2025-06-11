// src/services/applicationService.js
import api from './api';

export const applicationService = {
  // Apply for job (candidate)
  applyForJob: async (jobId, applicationData) => {
    return await api.post(`/applications/${jobId}`, applicationData);
  },

  // Get candidate's applications
  getCandidateApplications: async (userId) => {
    return await api.get(`/applications/users/${userId}`);
  },

  // Get applications for a job (employer)
  getJobApplications: async (jobId) => {
    return await api.get(`/applications/${jobId}/resumes`);
  },

  // Update application status (employer)
  updateApplicationStatus: async (applicationId, status) => {
    return await api.put(`/applications/${applicationId}/status`, { status });
  },

  // Download resume by application ID
  downloadResumeByApplication: async (applicationId) => {
    return await api.get(`/applications/${applicationId}/resume/download`, {
      responseType: 'blob',
    });
  },

  // Download resume by resume ID
  downloadResumeById: async (resumeId) => {
    return await api.get(`/applications/resumes/${resumeId}/download`, {
      responseType: 'blob',
    });
  },
};