import api from '../utils/api';

export const paymentService = {
  createOrder: async (orderData) => {
    const response = await api.post('/v1/payments/create-order', orderData);
    return response.data;
  },

  verifyPayment: async (verificationData) => {
    const response = await api.post('/v1/payments/verify', verificationData);
    return response.data;
  },

  getUserPayments: async () => {
    const response = await api.get('/v1/payments/my-payments');
    return response.data;
  },

  getPaymentByOrderId: async (orderId) => {
    const response = await api.get(`/v1/payments/order/${orderId}`);
    return response.data;
  },
};
