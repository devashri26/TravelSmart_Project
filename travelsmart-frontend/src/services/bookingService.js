import api from '../utils/api';

export const bookingService = {
  createBooking: async (bookingData) => {
    const response = await api.post('/v1/bookings', bookingData);
    return response.data;
  },

  getUserBookings: async () => {
    const response = await api.get('/v1/bookings');
    return response.data;
  },

  getBookingById: async (id) => {
    const response = await api.get(`/v1/bookings/${id}`);
    return response.data;
  },

  cancelBooking: async (id) => {
    const response = await api.delete(`/v1/bookings/${id}`);
    return response.data;
  },

  // NEW: Get booked seats for a specific inventory
  getBookedSeats: async (inventoryType, inventoryId) => {
    const response = await api.get(`/v1/bookings/booked-seats`, {
      params: { inventoryType, inventoryId }
    });
    return response.data;
  },
};
