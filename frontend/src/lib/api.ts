import axios from "axios";

// Get the API URL based on environment
const getApiUrl = () => {
  // Check if we're in development mode
  const isDev = process.env.NODE_ENV === "development";

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    // If accessing from localhost
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:5000/api";
    }

    // If accessing from network IP (mobile, other devices)
    // Use the same hostname but port 5000
    return `http://${hostname}:5000/api`;
  }

  // Fallback for server-side
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
};

const API_URL = getApiUrl();

// Log the API URL in development
if (process.env.NODE_ENV === "development") {
  console.log(`🔗 API URL: ${API_URL}`);
}

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
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === "ERR_NETWORK") {
      console.error("❌ Cannot connect to backend.");
      console.error(`   Backend URL: ${API_URL}`);
      console.error("   Make sure backend is running on port 5000");
      console.error("   Run: cd backend && npm run dev");
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
        // Don't redirect automatically, let components handle it
      }
    }

    return Promise.reject(error);
  },
);

export default api;
