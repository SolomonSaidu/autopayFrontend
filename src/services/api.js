import axios from "axios";

// Create a unified Axios instance bound to your development port
const api = axios.create({
  baseURL: "http://localhost:3100/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 * Automatically injects the authentication token from localStorage
 * into the HTTP Authorization header for secure backend endpoints.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("flex_auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Centralized interceptor to catch systemic backend API errors,
 * like automatic logouts when a session token expires.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the backend returns 401 Unauthorized OR an error message containing "token"
    // we clear the session and force a reload to the auth wall.
    const errorMessage = error.response?.data?.message?.toLowerCase() || "";
    if (
      (error.response && error.response.status === 401) || 
      errorMessage.includes("invalid token") || 
      errorMessage.includes("token expired")
    ) {
      localStorage.removeItem("flex_auth_token");
      window.location.href = "/"; // Force hard redirect to clear state
    }
    return Promise.reject(error);
  }
);

export default api;
