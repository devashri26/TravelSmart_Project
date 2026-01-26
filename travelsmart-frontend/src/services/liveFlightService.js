import api from '../utils/api';

export const liveFlightService = {
  /**
   * Search live flights by route
   * @param {string} from - Departure airport IATA code (e.g., 'DEL')
   * @param {string} to - Arrival airport IATA code (e.g., 'BOM')
   */
  searchLiveFlights: async (from, to) => {
    try {
      const response = await api.get(`/v1/live-flights/search?from=${from}&to=${to}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch live flights:', error);
      throw error;
    }
  },

  /**
   * Get live status of a specific flight
   * @param {string} flightNumber - Flight number (e.g., 'AI101')
   */
  getFlightStatus: async (flightNumber) => {
    try {
      const response = await api.get(`/v1/live-flights/status/${flightNumber}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch flight status:', error);
      throw error;
    }
  },

  /**
   * Get popular routes with IATA codes
   */
  getPopularRoutes: async () => {
    try {
      const response = await api.get('/v1/live-flights/routes');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch routes:', error);
      throw error;
    }
  },

  /**
   * Convert city name to IATA code
   */
  cityToIATA: {
    'Delhi': 'DEL',
    'Mumbai': 'BOM',
    'Bangalore': 'BLR',
    'Chennai': 'MAA',
    'Kolkata': 'CCU',
    'Hyderabad': 'HYD',
    'Ahmedabad': 'AMD',
    'Pune': 'PNQ',
    'Goa': 'GOI',
    'Jaipur': 'JAI',
    'Lucknow': 'LKO',
    'Chandigarh': 'IXC',
    'Kochi': 'COK',
    'Indore': 'IDR',
    'Bhubaneswar': 'BBI'
  },

  /**
   * Get IATA code from city name
   */
  getIATACode: (cityName) => {
    return liveFlightService.cityToIATA[cityName] || cityName;
  }
};
