import api from '../utils/api';

export const hotelService = {
  searchHotels: async (searchParams) => {
    // Backend expects GET with query params: ?city=Mumbai&guests=2
    const params = new URLSearchParams({
      city: searchParams.city,
      guests: searchParams.guests || 1
    });
    const response = await api.get(`/v1/hotels/search?${params.toString()}`);
    return response.data;
  },

  getHotelById: async (id) => {
    const response = await api.get(`/v1/hotels/${id}`);
    return response.data;
  },

  getAllHotels: async () => {
    const response = await api.get('/v1/hotels');
    return response.data;
  },

  getHotelReviews: async (hotelId) => {
    const response = await api.get(`/v1/hotels/${hotelId}/reviews`);
    return response.data;
  },

  addReview: async (hotelId, review) => {
    const response = await api.post(`/v1/hotels/${hotelId}/reviews`, review);
    return response.data;
  },
};
