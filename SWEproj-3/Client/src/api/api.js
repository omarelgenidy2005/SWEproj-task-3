import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api/v1",
  withCredentials: true,
})

export const getAllEvents = () => {
  return axios.get("/api/v1/events");
};
export const getEventById = (id) => {
  return axios.get(`/api/v1/events/${id}`);
};

export default api;