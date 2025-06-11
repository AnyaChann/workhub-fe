// src/services/messageService.js
import api from './api';

export const messageService = {
  // Get user messages
  getUserMessages: async (userId) => {
    return await api.get(`/messages/${userId}`);
  },

  // Send message
  sendMessage: async (messageData) => {
    return await api.post('/messages', messageData);
  },
};