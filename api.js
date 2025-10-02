import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Example: Add auth token from localStorage or .env
    // const token = localStorage.getItem("authToken");
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || "An error occurred";
    return Promise.reject(new Error(message));
  }
);

// Specific API method for fetching metadata
export const getMetadataById = async (id) => {
  const response = await api.get(`/metadata/${id}`);
  return response.data;
};

export default api;
