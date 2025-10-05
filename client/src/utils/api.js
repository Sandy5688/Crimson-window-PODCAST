import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,  // 10s timeout to avoid eternal hangs
});

// Request interceptor for authentication (ENABLED)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "An error occurred";
    return Promise.reject(new Error(message));
  }
);

// Fetch metadata by ID
export const getMetadataById = async (id) => {
  const response = await api.get(`/metadata/${id}`);
  return response.data;
};

// TODO: For future uploads (e.g., AutoUploadForm): Use { headers: { 'Content-Type': 'multipart/form-data' } } in api.post

export default api;
