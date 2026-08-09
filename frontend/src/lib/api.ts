import axios from "axios";

// Get the hostname from the browser
const getApiUrl = () => {
  // If we're in the browser, use the current hostname
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    // If accessing from localhost or 127.0.0.1, use localhost
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:5000/api";
    }
    // Otherwise use the network IP
    return `http://${hostname}:5000/api`;
  }
  // Fallback to environment variable
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
};

const API_URL = getApiUrl();

console.log("🔗 API URL:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.code === "ERR_NETWORK") {
      console.error("❌ Cannot connect to backend.");
      console.error("   Backend URL:", API_URL);
      console.error("   Make sure backend is running on port 5000");
    } else if (error.response) {
      console.error(
        `❌ ${error.response.status} ${error.response.data?.message || error.message}`,
      );
    } else {
      console.error("❌ Error:", error.message);
    }

    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
