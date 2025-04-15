import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

export const eventService = {
  async getEvents() {
    const response = await axios.get(`${BASE_URL}/api/event/list`, {
      withCredentials: true
    });
    return response.data;
  },

  async getEventDetails(eventId) {
    const response = await axios.get(`${BASE_URL}/api/event/${eventId}`, {
      withCredentials: true
    });
    return response.data;
  },

  async searchEvents(filters) {
    const response = await axios.get(`${BASE_URL}/api/event/search`, {
      params: filters,
      withCredentials: true
    });
    return response.data;
  },

  async getRecommendedEvents() {
    const response = await axios.get(`${BASE_URL}/api/user/recommdation`, {
      withCredentials: true
    });
    return response.data;
  },

  async getCategories() {
    const response = await axios.get(`${BASE_URL}/api/event/categories`, {
      withCredentials: true
    });
    return response.data;
  }
};

export const userEventService = {
  async getRegisteredEvents() {
    const response = await axios.get(`${BASE_URL}/api/user/events`, {
      withCredentials: true
    });
    
    return response.data;
  },

  async registerForEvent(eventId) {
    const response = await axios.post(`${BASE_URL}/api/user/events/register`, 
      { eventId }, 
      { withCredentials: true }
    );
    return response.data;
  },

  async unregisterFromEvent(eventId) {
    const response = await axios.post(`${BASE_URL}/api/user/events/remove`, 
      { eventId }, 
      { withCredentials: true }
    );
    return response.data;
  },

  async isRegistered(eventId){
    const response = await axios.post(`${BASE_URL}/api/user/isEventRegistered`, 
      { eventId }, 
      { withCredentials: true }
    );
    return response.data;
  }
};