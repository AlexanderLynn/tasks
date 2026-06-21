import api from './api';

export interface Item {
  id: string;
  listId: string;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: string;
  dueDate?: string;
  schedule?: any;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export const itemsApi = {
  getByListId: async (listId: string) => {
    const response = await api.get<Item[]>(`/lists/${listId}/items`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Item>(`/items/${id}`);
    return response.data;
  },

  create: async (listId: string, data: {
    title: string;
    description?: string;
    dueDate?: string;
    schedule?: any;
    tags?: string[];
  }) => {
    const response = await api.post<Item>(`/lists/${listId}/items`, data);
    return response.data;
  },

  update: async (id: string, data: {
    title?: string;
    description?: string;
    completed?: boolean;
    dueDate?: string;
    schedule?: any;
    tags?: string[];
  }) => {
    const response = await api.put<Item>(`/items/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/items/${id}`);
  },

  complete: async (id: string) => {
    const response = await api.post<Item>(`/items/${id}/complete`);
    return response.data;
  },

  undo: async (id: string) => {
    const response = await api.post<Item>(`/items/${id}/undo`);
    return response.data;
  },
};
