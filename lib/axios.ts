import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Interceptor: Xử lý trước khi request gửi đi
api.interceptors.request.use((config) => {
  // Nếu có token lưu trong cookie/localStorage, thêm vào header
  return config;
});

// Interceptor: Xử lý lỗi toàn cục
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.log("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;