import api from '../utils/api';

export const flightService = {
  searchFlights: async (searchParams) => {
    // Backend expects GET with query params: ?from=Mumbai&to=Delhi&date=2024-12-15
    const params = new URLSearchParams({
      from: searchParams.departureCity,
      to: searchParams.arrivalCity,
      date: searchParams.date
    });
    const response = await api.get(`/v1/flights/search?${params.toString()}`);
    return response.data;
  },

  getFlightById: async (id) => {
    const response = await api.get(`/v1/flights/${id}`);
    return response.data;
  },

  getAllFlights: async () => {
    const response = await api.get('/v1/flights');
    return response.data;
  },
};
