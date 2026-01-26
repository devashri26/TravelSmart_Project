import axios from 'axios';

const API_URL = 'http://localhost:8080/api/seat-locks';

// Generate a unique session ID for the browser
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('seatLockSessionId');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('seatLockSessionId', sessionId);
  }
  return sessionId;
};

// Get user ID from localStorage
const getUserId = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.id || 1; // Default to 1 if not logged in
};

export const seatLockService = {
  /**
   * Lock a single seat
   */
  async lockSeat(seatId, inventoryType, inventoryId, price) {
    try {
      const requestData = {
        seatId,
        inventoryType: inventoryType.toUpperCase(),
        inventoryId: inventoryId || 1, // Default to 1 if not provided
        userId: getUserId(),
        sessionId: getSessionId(),
        price: price || 0
      };
      
      console.log('Locking seat with data:', requestData);
      
      const response = await axios.post(`${API_URL}/lock`, requestData);
      return response.data;
    } catch (error) {
      console.error('Error locking seat:', error);
      console.error('Error response:', error.response?.data);
      throw error.response?.data || error;
    }
  },

  /**
   * Lock multiple seats
   */
  async lockMultipleSeats(seatIds, inventoryType, inventoryId, prices) {
    try {
      const response = await axios.post(`${API_URL}/lock-multiple`, {
        seatIds,
        inventoryType: inventoryType.toUpperCase(),
        inventoryId,
        userId: getUserId(),
        sessionId: getSessionId(),
        prices
      });
      return response.data;
    } catch (error) {
      console.error('Error locking seats:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Unlock a seat
   */
  async unlockSeat(seatId, inventoryType, inventoryId) {
    try {
      const response = await axios.post(`${API_URL}/unlock`, {
        seatId,
        inventoryType: inventoryType.toUpperCase(),
        inventoryId,
        userId: getUserId(),
        sessionId: getSessionId()
      });
      return response.data;
    } catch (error) {
      console.error('Error unlocking seat:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Release all user locks
   */
  async releaseUserLocks() {
    try {
      const response = await axios.post(`${API_URL}/release-user-locks`, {
        userId: getUserId(),
        sessionId: getSessionId()
      });
      return response.data;
    } catch (error) {
      console.error('Error releasing locks:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Get locked seats for an inventory
   * Returns object with lockedSeats (temporary) and bookedSeats (permanent)
   */
  async getLockedSeats(inventoryType, inventoryId) {
    try {
      const response = await axios.get(`${API_URL}/locked-seats`, {
        params: {
          inventoryType: inventoryType.toUpperCase(),
          inventoryId
        }
      });
      console.log('🔍 Seat lock API response:', response.data);
      return {
        lockedSeats: response.data.lockedSeats || [],
        bookedSeats: response.data.bookedSeats || [],
        allUnavailable: response.data.allUnavailable || []
      };
    } catch (error) {
      console.error('Error getting locked seats:', error);
      return {
        lockedSeats: [],
        bookedSeats: [],
        allUnavailable: []
      };
    }
  },

  /**
   * Get user's active locks
   */
  async getUserLocks() {
    try {
      const response = await axios.get(`${API_URL}/user-locks`, {
        params: {
          userId: getUserId(),
          sessionId: getSessionId()
        }
      });
      return response.data.locks || [];
    } catch (error) {
      console.error('Error getting user locks:', error);
      return [];
    }
  },

  /**
   * Mark locks as booked (after payment)
   */
  async markLocksAsBooked() {
    try {
      const response = await axios.post(`${API_URL}/mark-booked`, {
        userId: getUserId(),
        sessionId: getSessionId()
      });
      return response.data;
    } catch (error) {
      console.error('Error marking locks as booked:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Check if a seat is available
   */
  async checkAvailability(seatId, inventoryType, inventoryId) {
    try {
      const response = await axios.get(`${API_URL}/check-availability`, {
        params: {
          seatId,
          inventoryType: inventoryType.toUpperCase(),
          inventoryId
        }
      });
      return response.data.available;
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  },

  /**
   * Format time remaining (seconds to MM:SS)
   */
  formatTimeRemaining(seconds) {
    if (seconds <= 0) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },

  /**
   * Get session ID
   */
  getSessionId() {
    return getSessionId();
  },

  /**
   * Get user ID
   */
  getUserId() {
    return getUserId();
  }
};

export default seatLockService;
