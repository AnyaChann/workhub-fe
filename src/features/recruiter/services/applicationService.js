import api from '../../../shared/utils/helpers/api';

export const applicationService = {
  // ✅ Enhanced getJobApplications với mapping applicationId chính xác
  getJobApplications: async (jobId) => {
    try {
      console.log(' Fetching applications for job:', jobId);
      const response = await api.get(`/applications/${jobId}/resumes`);
      
      console.log('📋 Raw API response:', response);
      
      const data = Array.isArray(response) ? response : (response?.data || []);
      console.log('📋 Processed data:', data);
      
      // ✅ Kiểm tra xem API response có chứa applicationId thực không
      data.forEach((app, index) => {
        console.log(`📋 Application ${index} raw data:`, app);
        console.log(`📋 Application ${index} keys:`, Object.keys(app));
        
        // ✅ Tìm tất cả các field có thể chứa applicationId
        const possibleIds = {
          id: app.id,
          applicationId: app.applicationId,
          application_id: app.application_id,
          appId: app.appId,
          app_id: app.app_id
        };
        console.log(`📋 Application ${index} possible IDs:`, possibleIds);
      });
      
      return data;
    } catch (error) {
      console.error('❌ Error fetching job applications:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch job applications');
    }
  },

  // ✅ Enhanced updateApplicationStatus với validation chặt chẽ hơn
  updateApplicationStatus: async (applicationId, status) => {
    try {
      console.log('🔄 Updating application status:', {
        applicationId,
        applicationIdType: typeof applicationId,
        status,
        statusType: typeof status,
        isGeneratedId: String(applicationId).includes('_'),
        endpoint: `/applications/${applicationId}/status?status=${status}`
      });
      
      // ✅ Kiểm tra nếu là generated ID
      if (String(applicationId).includes('_') || String(applicationId).includes('@')) {
        throw new Error('Cannot update status: Invalid applicationId format. This appears to be a generated ID rather than a real application ID from the backend.');
      }
      
      // ✅ Validate applicationId format (should be numeric for most APIs)
      if (!applicationId || applicationId === 'undefined' || applicationId === 'null') {
        throw new Error('Invalid applicationId: ' + applicationId);
      }
      
      // ✅ Validate status
      const validStatuses = ['pending', 'accepted', 'rejected'];
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }
      
      console.log('🔄 Making PUT request to:', `/applications/${applicationId}/status?status=${status}`);
      
      const response = await api.put(`/applications/${applicationId}/status?status=${status}`);
      console.log('✅ Application status updated:', response);
      return response;
    } catch (error) {
      console.error('❌ Error updating application status:', error);
      console.error('❌ Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: error.config
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to update application status');
    }
  },

  // ✅ Rest of methods remain the same...
  downloadResumeByApplication: async (applicationId, fileName = null) => {
    try {
      console.log('📥 Downloading resume by application ID:', applicationId);
      
      if (!applicationId || applicationId === 'undefined' || applicationId === 'null') {
        throw new Error('Invalid applicationId for download: ' + applicationId);
      }
      
      const response = await api.get(`/applications/${applicationId}/resume/download`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || `resume_app_${applicationId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return response;
    } catch (error) {
      console.error('❌ Error downloading resume by application:', error);
      throw new Error(error.response?.data?.message || 'Failed to download resume');
    }
  },

  downloadResumeById: async (resumeId, fileName = null) => {
    try {
      console.log('📥 Downloading resume by resume ID:', resumeId);
      
      if (!resumeId || resumeId === 'undefined' || resumeId === 'null') {
        throw new Error('Invalid resumeId for download: ' + resumeId);
      }
      
      const response = await api.get(`/applications/resumes/${resumeId}/download`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || `resume_${resumeId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return response;
    } catch (error) {
      console.error('❌ Error downloading resume by ID:', error);
      throw new Error(error.response?.data?.message || 'Failed to download resume');
    }
  }
};

export default applicationService;