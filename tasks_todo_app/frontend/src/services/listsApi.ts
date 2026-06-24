import api from './api';

export type ListType = 'personal' | 'shared';
export type MemberPermission = 'view' | 'edit' | 'admin';

export interface List {
  id: string;
  name: string;
  type: ListType;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface ListMember {
  id: string;
  listId: string;
  userId: string;
  permission: MemberPermission;
  joinedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const listsApi = {
  getAll: async () => {
    const response = await api.get<ApiResponse<{ lists: List[]; members: Record<string, ListMember[]> }>>('/lists');
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<{ list: List; items: unknown[]; members: ListMember[] }>>(`/lists/${id}`);
    return response.data.data;
  },

  create: async (data: { name: string; type: ListType }) => {
    const response = await api.post<ApiResponse<{ list: List }>>('/lists', data);
    return response.data.data.list;
  },

  update: async (id: string, data: { name?: string; version: number }) => {
    const response = await api.put<ApiResponse<{ list: List }>>(`/lists/${id}`, data);
    return response.data.data.list;
  },

  delete: async (id: string) => {
    await api.delete(`/lists/${id}`);
  },

  addMember: async (listId: string, data: { userId: string; permission: MemberPermission }) => {
    const response = await api.post<ApiResponse<{ member: ListMember }>>(`/lists/${listId}/members`, data);
    return response.data.data.member;
  },

  updateMember: async (listId: string, userId: string, data: { permission: MemberPermission }) => {
    const response = await api.put<ApiResponse<{ member: ListMember }>>(`/lists/${listId}/members/${userId}`, data);
    return response.data.data.member;
  },

  removeMember: async (listId: string, userId: string) => {
    await api.delete(`/lists/${listId}/members/${userId}`);
  },
};
