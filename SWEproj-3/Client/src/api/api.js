import axios from "axios";

// Base configuration
const API_BASE = "/api/v1";

// Authorization headers
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

// ===== Event API =====
export const getAllEvents = () => {
  return axios.get(`${API_BASE}/events`);
};

export const getEventById = (id) => {
  return axios.get(`${API_BASE}/events/${id}`);
};

export const createEvent = (eventData) => {
  return axios.post(`${API_BASE}/events`, eventData, {
    headers: getAuthHeaders()
  });
};

export const updateEvent = (id, eventData) => {
  return axios.put(`${API_BASE}/events/${id}`, eventData, {
    headers: getAuthHeaders()
  });
};

export const deleteEvent = (id) => {
  return axios.delete(`${API_BASE}/events/${id}`, {
    headers: getAuthHeaders()
  });
};

export const getMyEvents = () => {
  return axios.get(`${API_BASE}/events/my-events`, {
    headers: getAuthHeaders()
  });
};

export const getEventAnalytics = (id) => {
  return axios.get(`${API_BASE}/events/${id}/analytics`, {
    headers: getAuthHeaders()
  });
};
