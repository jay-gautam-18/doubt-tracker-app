import axios from 'axios';

const api = axios.create({
  // baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  baseURL: 'https://doubt-tracker-backend-u6j9.onrender.com/api' || 'http://localhost:5000/api',

});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api; 