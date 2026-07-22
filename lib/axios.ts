import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

api.interceptors.request.use((config) => {
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.log('API Error:', error.response ? error.response.data.error : error.message);
    console.log('Error config:', error.response ? error.response.error : '');
    return Promise.reject(error);
  }
);

export default api;