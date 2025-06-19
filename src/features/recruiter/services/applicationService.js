import api from '../../../shared/utils/helpers/api';

export const applicationService = {
  // ✅ Get all applications for a specific job (recruiter view)
  getJobApplications: async (jobId) => {
    try {
      console.log('📄 Fetching applications for job:', jobId);
      const response = await api.get(`/applications/${jobId}/resumes`);
      return response;
    } catch (error) {
      console.error('Error fetching job applications:', error);
      throw error;
    }
  },

  // ✅ Update application status (recruiter action)
  updateApplicationStatus: async (applicationId, status) => {
    try {
      console.log('🔄 Updating application status:', { applicationId, status });
      const response = await api.put(`/applications/${applicationId}/status`, { status });
      console.log('✅ Application status updated');
      return response;
    } catch (error) {
      console.error('❌ Error updating application status:', error);
      throw error;
    }
  },

  // ✅ Download resume by application ID
  downloadResumeByApplication: async (applicationId) => {
    try {
      console.log('📥 Downloading resume for application:', applicationId);
      const response = await api.get(`/applications/${applicationId}/resume/download`, {
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      console.error('❌ Error downloading resume:', error);
      throw error;
    }
  },

  // ✅ Download resume by resume ID
  downloadResumeById: async (resumeId) => {
    try {
      console.log('📥 Downloading resume:', resumeId);
      const response = await api.get(`/applications/resumes/${resumeId}/download`, {
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      console.error('❌ Error downloading resume:', error);
      throw error;
    }
  }
};

export default applicationService;