import axios from "axios";

const API_BASE = "/api/v1";

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const getAllEvents = () => axios.get(`${API_BASE}/events`);
export const getEventById = (id) => axios.get(`${API_BASE}/events/${id}`);
export const createEvent = (data) => axios.post(`${API_BASE}/events`, data, { headers: getAuthHeaders() });
export const updateEvent = (id, data) => axios.put(`${API_BASE}/events/${id}`, data, { headers: getAuthHeaders() });
export const deleteEvent = (id) => axios.delete(`${API_BASE}/events/${id}`, { headers: getAuthHeaders() });
export const getMyEvents = () => axios.get(`${API_BASE}/events/my-events`, { headers: getAuthHeaders() });
export const getEventAnalytics = (id) => axios.get(`${API_BASE}/events/${id}/analytics`, { headers: getAuthHeaders() });

// ✅ Admin-only
export const getAllEventsForAdmin = () => axios.get(`${API_BASE}/events/all`, { headers: getAuthHeaders() });
export const updateEventStatus = (id, status) => axios.put(`${API_BASE}/events/${id}/status`, { status }, { headers: getAuthHeaders() });

export const getAllUsers = () => axios.get(`${API_BASE}/users`, { headers: getAuthHeaders() });
export const deleteUser = (id) => axios.delete(`${API_BASE}/users/${id}`, { headers: getAuthHeaders() });
export const updateUserRole = (id, role) => axios.put(`${API_BASE}/users/${id}`, { role }, { headers: getAuthHeaders() });