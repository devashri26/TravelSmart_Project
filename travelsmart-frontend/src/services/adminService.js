import api from '../utils/api';

export const adminService = {
  // Dashboard APIs
  getDashboardStats: async () => {
    const response = await api.get('/v1/admin/stats');
    return response.data;
  },

  getRecentBookings: async (limit = 10) => {
    const response = await api.get(`/v1/admin/dashboard/recent-bookings?limit=${limit}`);
    return response.data;
  },

  getRevenueChart: async (period = '7d') => {
    const response = await api.get(`/v1/admin/dashboard/revenue?period=${period}`);
    return response.data;
  },

  // Bookings Management APIs
  getAllBookings: async (page = 0, size = 20, search = '', status = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(search && { search }),
      ...(status && { status })
    });
    const response = await api.get(`/v1/admin/bookings?${params}`);
    return response.data;
  },

  getBookingDetails: async (bookingId) => {
    const response = await api.get(`/v1/admin/bookings/${bookingId}`);
    return response.data;
  },

  cancelBooking: async (bookingId, reason) => {
    const response = await api.put(`/v1/admin/bookings/${bookingId}/cancel`, { reason });
    return response.data;
  },

  unlockSeats: async (bookingId) => {
    const response = await api.post(`/v1/admin/bookings/${bookingId}/unlock-seats`);
    return response.data;
  },

  processRefund: async (bookingId, amount, reason) => {
    const response = await api.post(`/v1/admin/bookings/${bookingId}/refund`, { amount, reason });
    return response.data;
  },

  // Users Management APIs
  getAllUsers: async (page = 0, size = 20, search = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(search && { search })
    });
    const response = await api.get(`/v1/admin/users?${params}`);
    return response.data;
  },

  getUserDetails: async (userId) => {
    const response = await api.get(`/v1/admin/users/${userId}`);
    return response.data;
  },

  blockUser: async (userId, reason) => {
    const response = await api.put(`/v1/admin/users/${userId}/block`, { reason });
    return response.data;
  },

  unblockUser: async (userId) => {
    const response = await api.put(`/v1/admin/users/${userId}/unblock`);
    return response.data;
  },

  resetUserPassword: async (userId) => {
    const response = await api.put(`/v1/admin/users/${userId}/reset-password`);
    return response.data;
  },

  // Payments Management APIs
  getAllPayments: async (page = 0, size = 20, status = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(status && { status })
    });
    const response = await api.get(`/v1/admin/payments?${params}`);
    return response.data;
  },

  getPaymentDetails: async (paymentId) => {
    const response = await api.get(`/v1/admin/payments/${paymentId}`);
    return response.data;
  },

  processPaymentRefund: async (paymentId, amount, reason) => {
    const response = await api.post(`/v1/admin/payments/${paymentId}/refund`, { amount, reason });
    return response.data;
  },

  getPaymentLogs: async (paymentId) => {
    const response = await api.get(`/v1/admin/payments/${paymentId}/logs`);
    return response.data;
  },

  // ==================== FLIGHTS MANAGEMENT ====================
  
  getAllFlights: async (page = 0, size = 20, search = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(search && { search })
    });
    const response = await api.get(`/v1/admin/flights?${params}`);
    return response.data;
  },

  getFlightById: async (id) => {
    const response = await api.get(`/v1/admin/flights/${id}`);
    return response.data;
  },

  createFlight: async (flightData) => {
    const response = await api.post('/v1/admin/flights', flightData);
    return response.data;
  },

  updateFlight: async (id, flightData) => {
    const response = await api.put(`/v1/admin/flights/${id}`, flightData);
    return response.data;
  },

  deleteFlight: async (id) => {
    const response = await api.delete(`/v1/admin/flights/${id}`);
    return response.data;
  },

  // ==================== HOTELS MANAGEMENT ====================
  
  getAllHotels: async (page = 0, size = 20, search = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(search && { search })
    });
    const response = await api.get(`/v1/admin/hotels?${params}`);
    return response.data;
  },

  getHotelById: async (id) => {
    const response = await api.get(`/v1/admin/hotels/${id}`);
    return response.data;
  },

  createHotel: async (hotelData) => {
    const response = await api.post('/v1/admin/hotels', hotelData);
    return response.data;
  },

  updateHotel: async (id, hotelData) => {
    const response = await api.put(`/v1/admin/hotels/${id}`, hotelData);
    return response.data;
  },

  deleteHotel: async (id) => {
    const response = await api.delete(`/v1/admin/hotels/${id}`);
    return response.data;
  },

  // ==================== BUSES MANAGEMENT ====================
  
  getAllBuses: async (page = 0, size = 20, search = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(search && { search })
    });
    const response = await api.get(`/v1/admin/buses?${params}`);
    return response.data;
  },

  getBusById: async (id) => {
    const response = await api.get(`/v1/admin/buses/${id}`);
    return response.data;
  },

  createBus: async (busData) => {
    const response = await api.post('/v1/admin/buses', busData);
    return response.data;
  },

  updateBus: async (id, busData) => {
    const response = await api.put(`/v1/admin/buses/${id}`, busData);
    return response.data;
  },

  deleteBus: async (id) => {
    const response = await api.delete(`/v1/admin/buses/${id}`);
    return response.data;
  },

  // ==================== TRAINS MANAGEMENT ====================
  
  getAllTrains: async (page = 0, size = 20, search = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(search && { search })
    });
    const response = await api.get(`/v1/admin/trains?${params}`);
    return response.data;
  },

  getTrainById: async (id) => {
    const response = await api.get(`/v1/admin/trains/${id}`);
    return response.data;
  },

  createTrain: async (trainData) => {
    const response = await api.post('/v1/admin/trains', trainData);
    return response.data;
  },

  updateTrain: async (id, trainData) => {
    const response = await api.put(`/v1/admin/trains/${id}`, trainData);
    return response.data;
  },

  deleteTrain: async (id) => {
    const response = await api.delete(`/v1/admin/trains/${id}`);
    return response.data;
  }
};
