import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL,
});

// Attach JWT token from localStorage on every request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = window.localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Redirect to login on 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export async function getKPIs() {
  const res = await api.get('/api/kpis');
  return res.data;
}

export async function getMonthlySummary() {
  const res = await api.get('/api/monthly-summary');
  return res.data;
}

export async function getBatches(filters = {}) {
  const res = await api.get('/api/batches', { params: filters });
  return res.data;
}

export async function getBatch(id) {
  const res = await api.get(`/api/batches/${id}`);
  return res.data;
}

export async function createBatch(data) {
  const res = await api.post('/api/batches', data);
  return res.data;
}

export async function updateBatch(id, data) {
  const res = await api.put(`/api/batches/${id}`, data);
  return res.data;
}

export async function deleteBatch(id) {
  const res = await api.delete(`/api/batches/${id}`);
  return res.data;
}

export async function getProcurement() {
  const res = await api.get('/api/procurement');
  return res.data;
}

export async function createProcurement(data) {
  const res = await api.post('/api/procurement', data);
  return res.data;
}

export async function getSilos() {
  const res = await api.get('/api/silos');
  return res.data;
}

export async function updateSilo(id, data) {
  const res = await api.put(`/api/silos/${id}`, data);
  return res.data;
}

export async function login(email, password) {
  const res = await api.post('/api/auth/login', { email, password });
  return res.data;
}

export default api;