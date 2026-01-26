import api from '../utils/api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/v1/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/v1/auth/register', userData);
    return response.data;
  },

  confirmAccount: async (token) => {
    const response = await api.get(`/v1/auth/confirm?token=${token}`);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/v1/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token, newPassword) => {
    const response = await api.post('/v1/auth/reset-password', { token, newPassword });
    return response.data;
  },
};
