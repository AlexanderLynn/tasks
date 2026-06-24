import { AxiosError } from 'axios';
import { itemsApi } from '../itemsApi';
import { listsApi } from '../listsApi';
import { replaceTempId, upsertItem, upsertList } from './cache';
import { getQueue, incrementRetry, removeOperation } from './queue';
import type {
  ItemCompletePayload,
  ItemCreatePayload,
  ItemUndoPayload,
  ItemUpdatePayload,
  ListCreatePayload,
  ListMemberPayload,
  ListUpdatePayload,
  OfflineOperation,
  SyncConflict,
} from './types';

export interface SyncResult {
  synced: number;
  failed: number;
  conflicts: SyncConflict[];
}

function isConflict(error: unknown): boolean {
  return error instanceof AxiosError && error.response?.status === 409;
}

function isNetworkError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return !error.response;
  }
  return error instanceof TypeError;
}

async function executeOperation(operation: OfflineOperation): Promise<SyncConflict | null> {
  switch (operation.type) {
    case 'list.create': {
      const payload = operation.payload as unknown as ListCreatePayload;
      const list = await listsApi.create({ name: payload.name, type: payload.type });
      replaceTempId(payload.tempId, list.id, 'list');
      upsertList(list);
      return null;
    }
    case 'list.update': {
      const payload = operation.payload as unknown as ListUpdatePayload;
      const list = await listsApi.update(payload.id, { name: payload.name, version: payload.version });
      upsertList(list);
      return null;
    }
    case 'item.create': {
      const payload = operation.payload as unknown as ItemCreatePayload;
      const item = await itemsApi.create({
        listId: payload.listId.startsWith('temp-') ? payload.listId : payload.listId,
        title: payload.title,
        description: payload.description,
        type: payload.type,
        schedule: payload.schedule,
        assignedTo: payload.assignedTo,
        sharedWith: payload.sharedWith,
        tags: payload.tags,
      });
      replaceTempId(payload.tempId, item.id, 'item');
      upsertItem(item);
      return null;
    }
    case 'item.update': {
      const payload = operation.payload as unknown as ItemUpdatePayload;
      const item = await itemsApi.update(payload.id, payload);
      upsertItem(item);
      return null;
    }
    case 'item.delete': {
      const payload = operation.payload as { id: string };
      await itemsApi.delete(payload.id);
      return null;
    }
    case 'item.complete': {
      const payload = operation.payload as unknown as ItemCompletePayload;
      const result = await itemsApi.complete(payload.id);
      upsertItem({ ...(await itemsApi.getById(payload.id)).item, nextDueAt: result.nextDueAt });
      return null;
    }
    case 'item.undo': {
      const payload = operation.payload as unknown as ItemUndoPayload;
      const result = await itemsApi.undo(payload.id, payload.completionId);
      upsertItem({ ...(await itemsApi.getById(payload.id)).item, nextDueAt: result.nextDueAt });
      return null;
    }
    case 'list.addMember': {
      const payload = operation.payload as unknown as ListMemberPayload;
      await listsApi.addMember(payload.listId, {
        userId: payload.userId,
        permission: payload.permission ?? 'view',
      });
      return null;
    }
    case 'list.updateMember': {
      const payload = operation.payload as unknown as ListMemberPayload;
      await listsApi.updateMember(payload.listId, payload.userId, {
        permission: payload.permission ?? 'view',
      });
      return null;
    }
    case 'list.removeMember': {
      const payload = operation.payload as unknown as ListMemberPayload;
      await listsApi.removeMember(payload.listId, payload.userId);
      return null;
    }
    default:
      return null;
  }
}

function buildConflict(operation: OfflineOperation, message: string): SyncConflict {
  const payload = operation.payload;
  const entityId =
    typeof payload.id === 'string'
      ? payload.id
      : typeof payload.tempId === 'string'
        ? payload.tempId
        : 'unknown';

  return {
    id: crypto.randomUUID(),
    operationId: operation.id,
    entityType: operation.type.startsWith('list.') ? 'list' : 'item',
    entityId,
    message,
  };
}

async function resolveConflict(operation: OfflineOperation): Promise<SyncConflict | null> {
  if (operation.type === 'item.update' || operation.type === 'list.update') {
    const payload = operation.payload as unknown as ListUpdatePayload | ItemUpdatePayload;
    try {
      if (operation.type === 'item.update') {
        const latest = await itemsApi.getById(payload.id);
        upsertItem(latest.item);
      } else {
        const latest = await listsApi.getById(payload.id);
        upsertList(latest.list, latest.members);
      }
    } catch {
      // Keep conflict even if refresh fails.
    }
    return buildConflict(operation, 'Changes were overwritten by a newer version on the server.');
  }

  if (operation.type === 'item.complete' || operation.type === 'item.undo') {
    const payload = operation.payload as unknown as ItemCompletePayload | ItemUndoPayload;
    try {
      const latest = await itemsApi.getById(payload.id);
      upsertItem(latest.item);
    } catch {
      // Ignore refresh errors.
    }
    return buildConflict(operation, 'Completion state was updated elsewhere. Local estimate was discarded.');
  }

  return buildConflict(operation, 'Unable to apply this offline change.');
}

export async function syncOfflineQueue(): Promise<SyncResult> {
  const queue = getQueue();
  let synced = 0;
  let failed = 0;
  const conflicts: SyncConflict[] = [];

  for (const operation of queue) {
    try {
      await executeOperation(operation);
      removeOperation(operation.id);
      synced += 1;
    } catch (error) {
      if (isNetworkError(error)) {
        failed += 1;
        break;
      }

      if (isConflict(error)) {
        const conflict = await resolveConflict(operation);
        if (conflict) {
          conflicts.push(conflict);
        }
        removeOperation(operation.id);
        synced += 1;
        continue;
      }

      incrementRetry(operation.id);
      failed += 1;
    }
  }

  return { synced, failed, conflicts };
}

export function isOffline(): boolean {
  return typeof navigator !== 'undefined' && !navigator.onLine;
}

export { isNetworkError };
