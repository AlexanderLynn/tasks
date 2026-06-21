import api from './api';

export type ItemType = 'habit' | 'chore' | 'task';
export type ItemStatus = 'active' | 'archived' | 'deleted';
export type ScheduleType = 'once' | 'daily' | 'weekly' | 'monthly' | 'custom';

export interface ScheduleRule {
  type: ScheduleType;
  daysOfWeek?: number[];
  dayOfMonth?: number[];
  interval?: number;
  time?: string;
  endDate?: string;
  timezone: string;
}

export interface Item {
  id: string;
  listId: string;
  title: string;
  description?: string | null;
  type: ItemType;
  status: ItemStatus;
  schedule: ScheduleRule;
  assignedTo?: string | null;
  sharedWith?: string[] | null;
  tags?: string[] | null;
  nextDueAt: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface Completion {
  id: string;
  item_id?: string;
  itemId?: string;
  user_id?: string;
  userId?: string;
  completed_at?: string;
  completedAt?: string;
  scheduled_for?: string;
  scheduledFor?: string;
  undone: boolean | 0 | 1;
  undone_at?: string;
  undoneAt?: string;
  undone_by?: string;
  undoneBy?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const itemsApi = {
  getAll: async (params?: { listId?: string; type?: ItemType; status?: ItemStatus; assignedTo?: string }) => {
    const response = await api.get<ApiResponse<{ items: Item[]; total: number }>>('/items', { params });
    return response.data.data;
  },

  getByListId: async (listId: string) => {
    const response = await api.get<ApiResponse<{ items: Item[]; total: number }>>('/items', { params: { listId } });
    return response.data.data.items;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<{ item: Item; completions: Completion[]; nextDueAt: string }>>(`/items/${id}`);
    return response.data.data;
  },

  create: async (data: {
    listId: string;
    title: string;
    description?: string;
    type: ItemType;
    schedule: ScheduleRule;
    assignedTo?: string;
    sharedWith?: string[];
    tags?: string[];
  }) => {
    const response = await api.post<ApiResponse<{ item: Item; nextDueAt: string }>>('/items', data);
    return response.data.data.item;
  },

  update: async (id: string, data: {
    title?: string;
    description?: string;
    type?: ItemType;
    status?: ItemStatus;
    schedule?: ScheduleRule;
    assignedTo?: string;
    sharedWith?: string[];
    tags?: string[];
    version: number;
  }) => {
    const response = await api.put<ApiResponse<{ item: Item; nextDueAt: string }>>(`/items/${id}`, data);
    return response.data.data.item;
  },

  delete: async (id: string) => {
    await api.delete(`/items/${id}`);
  },

  complete: async (id: string) => {
    const response = await api.post<ApiResponse<{ completion: Completion; nextDueAt: string }>>(`/items/${id}/complete`, {});
    return response.data.data;
  },

  undo: async (id: string, completionId?: string) => {
    const response = await api.post<ApiResponse<{ completion: Completion; nextDueAt: string }>>(`/items/${id}/undo`, { completionId });
    return response.data.data;
  },
};
