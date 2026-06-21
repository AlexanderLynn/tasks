import api from './api';

export interface List {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export const listsApi = {
  getAll: async () => {
    const response = await api.get<List[]>('/lists');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<List>(`/lists/${id}`);
    return response.data;
  },

  create: async (data: { name: string; description?: string }) => {
    const response = await api.post<List>('/lists', data);
    return response.data;
  },

  update: async (id: string, data: { name?: string; description?: string }) => {
    const response = await api.put<List>(`/lists/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/lists/${id}`);
  },
};
