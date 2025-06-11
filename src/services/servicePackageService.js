// src/services/servicePackageService.js
import api from './api';

export const servicePackageService = {
  // Get all service packages (employer)
  getAllPackages: async () => {
    return await api.get('/service-packages');
  },

  // Get package by ID (employer)
  getPackageById: async (id) => {
    return await api.get(`/service-packages/${id}`);
  },

  // Create package (admin)
  createPackage: async (packageData) => {
    return await api.post('/service-packages', packageData);
  },

  // Update package (admin)
  updatePackage: async (id, packageData) => {
    return await api.put(`/service-packages/${id}`, packageData);
  },

  // Delete package (admin)
  deletePackage: async (id) => {
    return await api.delete(`/service-packages/${id}`);
  },
};