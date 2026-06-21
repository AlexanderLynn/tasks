import api from './api';

export interface User {
  id: string;
  apiKey: string;
  createdAt: string;
}

export const usersApi = {
  getCurrent: async () => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  create: async () => {
    const response = await api.post<User>('/users');
    return response.data;
  },
};
