import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000/api',
});

instance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const path = (() => {
        const raw = config.url || '';
        try {
          if (raw.startsWith('http')) return new URL(raw).pathname;
          const base = config.baseURL || instance.defaults.baseURL || '';
          return new URL(raw, base).pathname;
        } catch {
          return raw.startsWith('/') ? raw : `/${raw}`;
        }
      })();

      const managerToken = localStorage.getItem('managerAccessToken');
      const adminToken = localStorage.getItem('adminAccessToken');
      const superAdminToken = localStorage.getItem('superAdminAccessToken');

      let token: string | null = null;
      const p = path.toLowerCase();
      if (p.startsWith('/superadmin')) token = superAdminToken;
      else if (p.startsWith('/admin')) token = adminToken;
      else if (p.startsWith('/manager')) token = managerToken;
      if (!token) token = superAdminToken || adminToken || managerToken;

      if (token) {
        config.headers = config.headers || {};
        if (!('Authorization' in config.headers)) {
          (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance; 