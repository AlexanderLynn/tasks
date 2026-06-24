import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { storage } from './storage';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add API key
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const apiKey = storage.getApiKey();
  if (apiKey) {
    config.headers['X-API-Key'] = apiKey;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      storage.removeApiKey();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
