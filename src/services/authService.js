// src/services/authService.js
import api from './api';

export const authService = {
  // Login
  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    if (response.token) {
      localStorage.setItem('authToken', response.token);
    }
    return response;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/logout');
    localStorage.removeItem('authToken');
    return response;
  },

  // Get current user info
  getCurrentUser: async () => {
    return await api.get('/me');
  },
};