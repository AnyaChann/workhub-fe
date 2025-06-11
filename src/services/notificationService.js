// src/services/notificationService.js
import api from './api';

export const notificationService = {
  // Get user notifications
  getUserNotifications: async (userId) => {
    return await api.get(`/notifications/${userId}`);
  },

  // Send notification
  sendNotification: async (notificationData) => {
    return await api.post('/notifications', notificationData);
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    return await api.patch(`/notifications/${notificationId}/read`);
  },
};