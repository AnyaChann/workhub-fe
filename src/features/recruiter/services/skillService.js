import api from '../../../shared/utils/helpers/api';

export const skillService = {
  // Get all skills
  getAllSkills: async () => {
    try {
      console.log('🛠️ Fetching all skills...');
      const response = await api.get('/skill');
      console.log('🛠️ Skills response:', response);
      
      // Handle response format
      let skills = [];
      if (Array.isArray(response)) {
        skills = response;
      } else if (response && Array.isArray(response.data)) {
        skills = response.data;
      } else if (response?.data) {
        skills = [response.data];
      } else if (response) {
        skills = [response];
      }
      
      console.log('🛠️ Processed skills:', skills);
      return skills;
    } catch (error) {
      console.error('❌ Error fetching skills:', error);
      throw error;
    }
  },

  // Get skill by ID
  getSkillById: async (id) => {
    try {
      console.log('🛠️ Fetching skill by ID:', id);
      const response = await api.get(`/skill/${id}`);
      console.log('🛠️ Skill details:', response);
      
      return response?.data || response;
    } catch (error) {
      console.error('❌ Error fetching skill by ID:', error);
      throw error;
    }
  },

  // Search skills by name
  searchSkills: async (searchTerm) => {
    try {
      console.log('🔍 Searching skills with term:', searchTerm);
      const response = await api.get(`/skill?search=${encodeURIComponent(searchTerm)}`);
      console.log('🔍 Search results:', response);
      
      let skills = [];
      if (Array.isArray(response)) {
        skills = response;
      } else if (response && Array.isArray(response.data)) {
        skills = response.data;
      }
      
      return skills;
    } catch (error) {
      console.error('❌ Error searching skills:', error);
      throw error;
    }
  },

  // Get skills by category (if API supports it)
  getSkillsByCategory: async (categoryId) => {
    try {
      console.log('🛠️ Fetching skills by category:', categoryId);
      const response = await api.get(`/skill?categoryId=${categoryId}`);
      console.log('🛠️ Category skills:', response);
      
      let skills = [];
      if (Array.isArray(response)) {
        skills = response;
      } else if (response && Array.isArray(response.data)) {
        skills = response.data;
      }
      
      return skills;
    } catch (error) {
      console.error('❌ Error fetching skills by category:', error);
      // Return empty array if endpoint doesn't exist
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  }
};

export default skillService;