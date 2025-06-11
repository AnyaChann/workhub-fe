// src/services/userPackageService.js
import api from './api';

export const userPackageService = {
  // Get all user packages (admin)
  getAllUserPackages: async () => {
    return await api.get('/user-packages');
  },

  // Get user packages by user ID (employer)
  getUserPackages: async (userId) => {
    return await api.get(`/user-packages/user/${userId}`);
  },

  // Get user package by ID (employer)
  getUserPackageById: async (id) => {
    return await api.get(`/user-packages/${id}`);
  },

  // Update user package
  updateUserPackage: async (id, packageData) => {
    return await api.put(`/user-packages/${id}`, packageData);
  },

  // Delete user package
  deleteUserPackage: async (id) => {
    return await api.delete(`/user-packages/${id}`);
  },
};