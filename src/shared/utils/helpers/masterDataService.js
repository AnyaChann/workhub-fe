// src/services/masterDataService.js
import api from './api';

// Job Categories
export const jobCategoryService = {
  getAll: async () => await api.get('/job-categories'),
  getById: async (id) => await api.get(`/job-categories/${id}`),
  create: async (data) => await api.post('/job-categories', data),
  update: async (id, data) => await api.put(`/job-categories/${id}`, data),
  delete: async (id) => await api.delete(`/job-categories/${id}`),
};

// Job Types
export const jobTypeService = {
  getAll: async () => await api.get('/job-types'),
  getById: async (id) => await api.get(`/job-types/${id}`),
  create: async (data) => await api.post('/job-types', data),
  update: async (id, data) => await api.put(`/job-types/${id}`, data),
  delete: async (id) => await api.delete(`/job-types/${id}`),
};

// Job Positions
export const jobPositionService = {
  getAll: async () => await api.get('/job-positions'),
  getById: async (id) => await api.get(`/job-positions/${id}`),
  create: async (data) => await api.post('/job-positions', data),
  update: async (id, data) => await api.put(`/job-positions/${id}`, data),
  delete: async (id) => await api.delete(`/job-positions/${id}`),
};

// Skills
export const skillService = {
  getAll: async () => await api.get('/skill'),
  create: async (data) => await api.post('/skill', data),
  update: async (id, data) => await api.put(`/skill/${id}`, data),
  delete: async (id) => await api.delete(`/skill/${id}`),
};

// Service Features
export const serviceFeatureService = {
  getAll: async () => await api.get('/service-features'),
  getById: async (id) => await api.get(`/service-features/${id}`),
  create: async (data) => await api.post('/service-features', data),
  update: async (id, data) => await api.put(`/service-features/${id}`, data),
  delete: async (id) => await api.delete(`/service-features/${id}`),
};