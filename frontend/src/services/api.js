import axios from "axios";
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://luxdrive-plateforme-de-location-de.onrender.com/api",
});
// Attach token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
// Handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default API;
