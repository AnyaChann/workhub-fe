import api from '../../../shared/utils/helpers/api';

export const companyService = {
  // Lấy thông tin công ty hiện tại của người dùng
  getCurrentCompany: async () => {
    try {
      const response = await api.get('/users/company');
      console.log('Company data fetched successfully:', response.data);
      return response.data || null;
    } catch (error) {
      console.error('Error fetching company data:', error);
      
      // Trả về lỗi để component xử lý
      throw new Error(error.response?.data?.message || 'Failed to fetch company data');
    }
  },
  
  // Lấy chi tiết công ty theo ID
  getCompanyById: async (id) => {
    try {
      const response = await api.get(`/companies/${id}`);
      return response.data || null;
    } catch (error) {
      console.error(`Error fetching company ID ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to fetch company details');
    }
  },
  
  // Lấy danh sách tất cả công ty (thường dành cho admin)
  getAllCompanies: async () => {
    try {
      const response = await api.get('/companies');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching companies list:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch companies list');
    }
  },
  
  // Cập nhật thông tin công ty
  updateCompany: async (companyData) => {
    try {
      const { id, ...data } = companyData;
      
      if (!id) {
        throw new Error('Company ID is required for update');
      }
      
      const response = await api.put(`/companies/${id}`, data);
      console.log('Company updated successfully:', response.data);
      return response.data || null;
    } catch (error) {
      console.error('Error updating company:', error);
      throw new Error(error.response?.data?.message || 'Failed to update company');
    }
  },
  
  // Upload logo công ty
  uploadCompanyLogo: async (id, file) => {
    try {
      if (!file) {
        throw new Error('No file selected');
      }
      
      const formData = new FormData();
      formData.append('logo', file);
      
      const response = await api.post(`/companies/${id}/logo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Logo uploaded successfully:', response.data);
      return response.data || null;
    } catch (error) {
      console.error('Error uploading company logo:', error);
      throw new Error(error.response?.data?.message || 'Failed to upload logo');
    }
  },
  
  // Cập nhật trạng thái công ty (dành cho admin)
  updateCompanyStatus: async (id, status) => {
    try {
      if (!['active', 'pending', 'inactive'].includes(status)) {
        throw new Error('Invalid status value');
      }
      
      const response = await api.put(`/companies/${id}/status?status=${status}`);
      return response.data || null;
    } catch (error) {
      console.error(`Error updating company ${id} status:`, error);
      throw new Error(error.response?.data?.message || 'Failed to update company status');
    }
  },
  
  // Cập nhật loại kiểm định công ty (dành cho admin)
  updateCompanyInspection: async (id, inspection) => {
    try {
      if (!['none', 'prestige'].includes(inspection)) {
        throw new Error('Invalid inspection value');
      }
      
      const response = await api.put(`/companies/${id}/inspection?inspection=${inspection}`);
      return response.data || null;
    } catch (error) {
      console.error(`Error updating company ${id} inspection:`, error);
      throw new Error(error.response?.data?.message || 'Failed to update company inspection');
    }
  },
  
  // Tạo công ty mới (nếu cần)
  createCompany: async (companyData) => {
    try {
      const response = await api.post('/companies', companyData);
      console.log('Company created successfully:', response.data);
      return response.data || null;
    } catch (error) {
      console.error('Error creating company:', error);
      throw new Error(error.response?.data?.message || 'Failed to create company');
    }
  }
};