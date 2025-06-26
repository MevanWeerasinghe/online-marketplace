// src/config/api.js
const API_CONFIG = {
  // Development URL
  development: "http://localhost:5000",

  // Production URL - replace with your actual production API URL
  production: "https://your-api-domain.com",

  // Test URL (optional)
  test: "http://localhost:5000",
};

// Automatically detect environment and set base URL
const getBaseURL = () => {
  // Check if we're in browser environment
  if (typeof window !== "undefined") {
    // Client-side detection
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return API_CONFIG.development;
    }
    return API_CONFIG.production;
  } else {
    // Server-side detection (for SSR)
    return process.env.NODE_ENV === "production"
      ? API_CONFIG.production
      : API_CONFIG.development;
  }
};

export const API_BASE_URL = getBaseURL();

// Utility function to create full API URLs
export const createApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/api/${cleanEndpoint}`;
};

// Common API endpoints
export const API_ENDPOINTS = {
  ITEMS: "items",
  CATEGORIES: "categories",
  CART: "cart",
  UPLOAD: "items/upload",
};

export default API_BASE_URL;
