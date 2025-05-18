import axios from "axios";

export const getAllEvents = () => {
  return axios.get("/api/v1/events");
};
export const getEventById = (id) => {
  return axios.get(`/api/v1/events/${id}`);
};
