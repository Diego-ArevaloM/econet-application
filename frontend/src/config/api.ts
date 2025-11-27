import axios from 'axios';

export const API_BASE_URL = 
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true 
});

api.interceptors.request.use(request => {
  console.log('Petición enviada:', request.method?.toUpperCase(), request.url);
  return request;
});

export default api;