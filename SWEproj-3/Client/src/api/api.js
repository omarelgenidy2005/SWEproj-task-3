import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api/v1", // ✅ adjust if your backend uses a different port
  withCredentials: true, // optional, depending on auth setup
});



export default api;


