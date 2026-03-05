import axios from "axios";

// Plain axios instance — no store import, no circular dependency
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export default api;