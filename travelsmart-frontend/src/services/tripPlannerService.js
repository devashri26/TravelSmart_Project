import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/trip-planner';

const getAuthHeader = () => {
  const authData = localStorage.getItem('auth-storage');
  if (authData) {
    const { state } = JSON.parse(authData);
    const token = state?.token;
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

export const generateItinerary = async (tripData) => {
  try {
    console.log('Sending trip data:', tripData);
    console.log('Auth headers:', getAuthHeader());
    const response = await axios.post(`${API_URL}/generate`, tripData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error generating itinerary:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

export default {
  generateItinerary
};
