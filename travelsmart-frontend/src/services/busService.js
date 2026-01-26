import api from '../utils/api';

export const busService = {
  searchBuses: async (searchParams) => {
    // Backend expects GET with query params: ?origin=Mumbai&destination=Pune&date=2024-12-15T00:00:00
    // Convert date to LocalDateTime format (ISO format with time)
    const dateTime = searchParams.date.includes('T') ? searchParams.date : `${searchParams.date}T00:00:00`;
    
    const params = new URLSearchParams({
      origin: searchParams.origin,
      destination: searchParams.destination,
      date: dateTime
    });
    const response = await api.get(`/v1/buses/search?${params.toString()}`);
    return response.data;
  },

  getBusById: async (id) => {
    const response = await api.get(`/v1/buses/${id}`);
    return response.data;
  },
};
