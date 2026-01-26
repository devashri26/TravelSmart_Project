import api from '../utils/api';

export const chatbotService = {
  sendMessage: async (message, conversationId = null) => {
    const response = await api.post('/chatbot/message', {
      message,
      conversationId,
    });
    return response.data;
  },

  getConversationHistory: async (conversationId) => {
    const response = await api.get(`/chatbot/conversation/${conversationId}`);
    return response.data;
  },

  generateItinerary: async (preferences) => {
    const response = await api.post('/chatbot/generate-itinerary', preferences);
    return response.data;
  },
};
