import api from '../../../shared/utils/helpers/api';

export const resumeService = {
  // ✅ Lấy tất cả hồ sơ (dành cho nhà tuyển dụng/admin)
  getAllResumes: async () => {
    try {
      console.log('📄 Fetching all resumes...');
      const response = await api.get('/resumes');
      console.log('📄 Resumes loaded:', response);
      return Array.isArray(response) ? response : (response?.data || []);
    } catch (error) {
      console.error('❌ Error fetching resumes:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch resumes');
    }
  },

  // ✅ Tạo đánh giá CV mới
  createResumeReview: async (reviewData) => {
    try {
      console.log('⭐ Creating resume review:', reviewData);
      const response = await api.post('/resume-reviews', {
        resumeId: reviewData.resumeId,
        candidateId: reviewData.candidateId,
        recruiterId: reviewData.recruiterId,
        rating: reviewData.rating,
        comment: reviewData.comment
      });
      console.log('✅ Resume review created:', response);
      return response?.data || response;
    } catch (error) {
      console.error('❌ Error creating resume review:', error);
      throw new Error(error.response?.data?.message || 'Failed to create review');
    }
  },

  // ✅ Cập nhật đánh giá CV
  updateResumeReview: async (reviewId, reviewData) => {
    try {
      console.log('📝 Updating resume review:', reviewId, reviewData);
      const response = await api.put(`/resume-reviews/${reviewId}`, {
        resumeId: reviewData.resumeId,
        candidateId: reviewData.candidateId,
        recruiterId: reviewData.recruiterId,
        rating: reviewData.rating,
        comment: reviewData.comment
      });
      console.log('✅ Resume review updated:', response);
      return response?.data || response;
    } catch (error) {
      console.error('❌ Error updating resume review:', error);
      if (error.response?.status === 404) {
        throw new Error('Review not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to update review');
    }
  },

  // ✅ Lấy tất cả đánh giá CV
  getAllResumeReviews: async () => {
    try {
      console.log('📋 Fetching all resume reviews...');
      const response = await api.get('/resume-reviews');
      console.log('📋 Resume reviews loaded:', response);
      return Array.isArray(response) ? response : (response?.data || []);
    } catch (error) {
      console.error('❌ Error fetching resume reviews:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
    }
  },

  // ✅ Lấy đánh giá CV theo ứng viên
  getResumeReviewsByCandidate: async (candidateId) => {
    try {
      console.log('👤 Fetching resume reviews for candidate:', candidateId);
      const response = await api.get(`/resume-reviews/candidate/${candidateId}`);
      console.log('👤 Candidate reviews loaded:', response);
      return Array.isArray(response) ? response : (response?.data || []);
    } catch (error) {
      console.error('❌ Error fetching candidate reviews:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch candidate reviews');
    }
  },

  // ✅ Download resume file (nếu có endpoint)
  downloadResumeFile: async (resumeId, fileName) => {
    try {
      console.log('📥 Downloading resume file:', resumeId, fileName);
      const response = await api.get(`/resumes/${resumeId}/download`, {
        responseType: 'blob'
      });
      
      // Create download link
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
      console.error('❌ Error downloading resume:', error);
      throw new Error('Failed to download resume file');
    }
  }
};

export default resumeService;