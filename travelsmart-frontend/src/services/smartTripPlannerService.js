import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/smart-trip-planner';

const getAuthHeader = () => {
  const authData = localStorage.getItem('auth-storage');
  if (authData) {
    const { state } = JSON.parse(authData);
    const token = state?.token;
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

export const generateSmartItinerary = async (tripData) => {
  try {
    console.log('Sending smart trip data:', tripData);
    const response = await axios.post(`${API_URL}/generate`, tripData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error generating smart itinerary:', error);
    throw error;
  }
};

export const optimizeBudget = async (budgetData) => {
  try {
    const response = await axios.post(`${API_URL}/optimize-budget`, budgetData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error optimizing budget:', error);
    throw error;
  }
};

export const getAlternatives = async (alternativeData) => {
  try {
    const response = await axios.post(`${API_URL}/get-alternatives`, alternativeData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error getting alternatives:', error);
    throw error;
  }
};

export const saveCustomizedItinerary = async (itineraryData) => {
  try {
    const response = await axios.post(`${API_URL}/save-customized`, itineraryData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error saving customized itinerary:', error);
    throw error;
  }
};

export default {
  generateSmartItinerary,
  optimizeBudget,
  getAlternatives,
  saveCustomizedItinerary
};