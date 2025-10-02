// frontend/src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api", // Ajusta si tu backend está en otra ruta o usa proxy en dev
});

// Interceptor para agregar el token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar 401 y redirigir al login
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Importante: redirigimos duro para limpiar estado
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
