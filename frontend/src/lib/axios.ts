import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  withCredentials: true, // Needed for Sanctum to handle cookies
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
});

// Optional: Interceptor to log or handle errors globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error("API error:", error.response.data);
    } else {
      console.error("Network or CORS error", error);
    }
    return Promise.reject(error);
  }
);

export default api;
