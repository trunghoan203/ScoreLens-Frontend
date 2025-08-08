import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000/api',
});

instance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const adminToken = localStorage.getItem('adminAccessToken');
      const superAdminToken = localStorage.getItem('superAdminAccessToken');
      const token = superAdminToken || adminToken;
      if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance; 