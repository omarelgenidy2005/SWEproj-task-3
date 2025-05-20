import axios from "axios";

export const getAllEvents = () => {
  return axios.get("/api/v1/events");
};
export const getEventById = (id) => {
  return axios.get(`/api/v1/events/${id}`);
};
const api = axios.create({
  baseURL: "http://localhost:5001/api/v1", // ✅ adjust if your backend uses a different port
  withCredentials: true, // optional, depending on auth setup
});



export default api;


