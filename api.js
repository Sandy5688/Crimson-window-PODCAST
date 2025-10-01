// client/src/utils/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchMetadata = async (id) => {
  try {
    const response = await API.get(`/metadata/${id}`);
    return response.data;
  } catch (error) {
    console.error('API fetchMetadata error:', error);
    throw error;
  }
};

export const updateMetadata = async (id, data) => {
  try {
    const response = await API.put(`/metadata/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('API updateMetadata error:', error);
    throw error;
  }
};

export default API;
