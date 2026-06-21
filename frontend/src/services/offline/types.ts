import type { Item, ScheduleRule } from '../itemsApi';
import type { List, ListMember, ListType, MemberPermission } from '../listsApi';

export type OfflineOperationType =
  | 'list.create'
  | 'list.update'
  | 'item.create'
  | 'item.update'
  | 'item.delete'
  | 'item.complete'
  | 'item.undo'
  | 'list.addMember'
  | 'list.updateMember'
  | 'list.removeMember';

export interface OfflineOperation {
  id: string;
  type: OfflineOperationType;
  payload: Record<string, unknown>;
  createdAt: string;
  retryCount: number;
}

export interface SyncConflict {
  id: string;
  operationId: string;
  entityType: 'list' | 'item';
  entityId: string;
  message: string;
  resolvedAt?: string;
}

export interface CachedData {
  lists: List[];
  items: Item[];
  members: Record<string, ListMember[]>;
  cachedAt: string;
}

export interface ListCreatePayload {
  tempId: string;
  name: string;
  type: ListType;
}

export interface ListUpdatePayload {
  id: string;
  name?: string;
  version: number;
}

export interface ItemCreatePayload {
  tempId: string;
  listId: string;
  title: string;
  description?: string;
  type: Item['type'];
  schedule: ScheduleRule;
  assignedTo?: string;
  sharedWith?: string[];
  tags?: string[];
}

export interface ItemUpdatePayload {
  id: string;
  title?: string;
  description?: string;
  type?: Item['type'];
  status?: Item['status'];
  schedule?: ScheduleRule;
  assignedTo?: string;
  sharedWith?: string[];
  tags?: string[];
  version: number;
}

export interface ItemCompletePayload {
  id: string;
  estimatedNextDueAt: string;
}

export interface ItemUndoPayload {
  id: string;
  completionId?: string;
  estimatedNextDueAt: string;
}

export interface ListMemberPayload {
  listId: string;
  userId: string;
  permission?: MemberPermission;
}
