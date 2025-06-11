// src/services/paymentService.js
import api from './api';

export const paymentService = {
  // Simulate payment (test)
  simulatePayment: async (paymentData) => {
    return await api.post('/payments/test/simulate', paymentData);
  },
};