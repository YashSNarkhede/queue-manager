import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // your backend
});

// ✅ Add this to attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default api;
