import api from '../utils/api';

export const trainService = {
  searchTrains: async (searchParams) => {
    // Backend expects GET with query params with ISO DateTime format
    // Convert date from YYYY-MM-DD to YYYY-MM-DDTHH:mm:ss
    const dateTime = searchParams.date.includes('T') 
      ? searchParams.date 
      : `${searchParams.date}T00:00:00`;
    
    const params = new URLSearchParams({
      origin: searchParams.origin,
      destination: searchParams.destination,
      date: dateTime
    });
    const response = await api.get(`/v1/trains/search?${params.toString()}`);
    return response.data;
  },

  getTrainById: async (id) => {
    const response = await api.get(`/v1/trains/${id}`);
    return response.data;
  },
};
