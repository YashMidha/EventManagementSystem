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

  async addEvent(eventData) {
    const response = await axios.post(`${BASE_URL}/api/event/add`, eventData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  
  async removeEvent(eventId) {
    const response = await axios.post(
        `${BASE_URL}/api/event/remove`,
        { eventId },
        { withCredentials: true, }
    );
    return response.data;
  },

  
  async listUsersForEvent(eventId) {
    const response = await axios.post(
        `${BASE_URL}/api/event/participants`, 
        { eventId },
        { withCredentials: true, }
    );
    return response.data;
  },
};