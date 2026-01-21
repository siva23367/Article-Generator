import axios from 'axios';

const API_BASE_URL = 'https://article-generator-backend-9hj2.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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

export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/api/login', { username, password });
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/api/me');
    return response.data;
  },
};

export const articleAPI = {
  generateFullArticle: async (query, url) => {
    const response = await api.post('/api/generate-full-article', { query, url });
    return response.data;
  },
  generateArticle: async (query, url) => {
    const response = await api.post('/api/generate-article', { query, url });
    return response.data;
  },
  generateSEO: async (article) => {
    const response = await api.post('/api/generate-seo', article);
    return response.data;
  },
  generateHTML: async (article, seo) => {
    const response = await api.post('/api/generate-html', { article, seo });
    return response.data;
  },
};

export default api;
