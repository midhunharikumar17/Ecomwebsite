import axios from "axios";
import { store } from "../redux/store";
import { logout } from "../redux/slices/authSlice";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api", // ✅ FIX 2
});

// ✅ FIX 1: Read token from Redux store directly, not localStorage
axiosInstance.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ FIX 3: Response interceptor — handle expired tokens globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());              // auto logout on token expiry
      window.location.href = "/login";       // hard redirect to login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;