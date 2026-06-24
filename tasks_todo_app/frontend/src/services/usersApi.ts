import api from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthData {
  user: User;
  apiKey: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const usersApi = {
  getCurrent: async () => {
    const response = await api.get<ApiResponse<{ user: User }>>('/users/me');
    return response.data.data.user;
  },

  create: async (data: { name: string; email: string; password: string }) => {
    const response = await api.post<ApiResponse<AuthData>>('/users', data);
    return response.data.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post<ApiResponse<AuthData>>('/users/login', data);
    return response.data.data;
  },

  getApiKey: async () => {
    const response = await api.get<ApiResponse<{ apiKey: string }>>('/users/me/api-key');
    return response.data.data.apiKey;
  },
};
