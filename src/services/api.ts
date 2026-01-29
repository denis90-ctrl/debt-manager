import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    console.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Response Error:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  getDebts: async () => {
    const res = await api.get('/debts');
    return res.data;
  },
  // заглушки на будущее
  createDebt: async (payload: any) => {
    const res = await api.post('/debts', payload);
    return res.data;
  },
};

export default api;
