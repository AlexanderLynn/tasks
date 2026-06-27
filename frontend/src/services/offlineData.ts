import type { Item, ItemType, ItemStatus } from './itemsApi';
import { itemsApi } from './itemsApi';
import type { List, ListMember, ListType, MemberPermission } from './listsApi';
import { listsApi } from './listsApi';
import { loadCachedData, removeItem, saveCachedData, upsertItem, upsertList } from './offline/cache';
import { enqueue, getPendingCount } from './offline/queue';
import { estimateNextDueAt, estimatePreviousDueAt } from './offline/scheduleEstimate';
import { isNetworkError, isOffline, syncOfflineQueue, type SyncResult } from './offline/sync';
import type { SyncConflict } from './offline/types';
import { createUuid } from '../utils/id';

export type { SyncConflict };

function tempId(prefix: 'list' | 'item'): string {
  return `temp-${prefix}-${createUuid()}`;
}

export async function fetchDashboardData(): Promise<{
  lists: List[];
  members: Record<string, ListMember[]>;
  items: Item[];
  fromCache: boolean;
}> {
  try {
    const [listData, itemData] = await Promise.all([
      listsApi.getAll(),
      itemsApi.getAll({ status: 'active' }),
    ]);
    saveCachedData({
      lists: listData.lists,
      items: itemData.items,
      members: listData.members,
    });
    return {
      lists: listData.lists,
      members: listData.members,
      items: itemData.items,
      fromCache: false,
    };
  } catch (error) {
    const cached = loadCachedData();
    if (cached && (isOffline() || isNetworkError(error))) {
      return {
        lists: cached.lists,
        members: cached.members,
        items: cached.items,
        fromCache: true,
      };
    }
    throw error;
  }
}

export async function fetchListData(listId: string): Promise<{
  list: List;
  members: ListMember[];
  items: Item[];
  fromCache: boolean;
}> {
  try {
    const [listData, items] = await Promise.all([listsApi.getById(listId), itemsApi.getByListId(listId)]);
    upsertList(listData.list, listData.members);
    items.forEach(upsertItem);
    return {
      list: listData.list,
      members: listData.members,
      items,
      fromCache: false,
    };
  } catch (error) {
    const cached = loadCachedData();
    if (cached && (isOffline() || isNetworkError(error))) {
      const list = cached.lists.find((entry) => entry.id === listId);
      if (!list) {
        throw error;
      }
      return {
        list,
        members: cached.members[listId] ?? [],
        items: cached.items.filter((item) => item.listId === listId),
        fromCache: true,
      };
    }
    throw error;
  }
}

export async function fetchItemData(itemId: string): Promise<{
  item: Item;
  completions?: Awaited<ReturnType<typeof itemsApi.getById>>['completions'];
  fromCache: boolean;
}> {
  try {
    const data = await itemsApi.getById(itemId);
    upsertItem(data.item);
    return { item: data.item, completions: data.completions, fromCache: false };
  } catch (error) {
    const cached = loadCachedData();
    if (cached && (isOffline() || isNetworkError(error))) {
      const item = cached.items.find((entry) => entry.id === itemId);
      if (!item) {
        throw error;
      }
      return { item, fromCache: true };
    }
    throw error;
  }
}

async function runOrQueue<T>(
  onlineAction: () => Promise<T>,
  queueAction: () => void
): Promise<{ result?: T; queued: boolean }> {
  if (isOffline()) {
    queueAction();
    return { queued: true };
  }

  try {
    const result = await onlineAction();
    return { result, queued: false };
  } catch (error) {
    if (isNetworkError(error)) {
      queueAction();
      return { queued: true };
    }
    throw error;
  }
}

export async function createListOffline(data: { name: string; type: ListType }): Promise<List> {
  const optimistic: List = {
    id: tempId('list'),
    name: data.name,
    type: data.type,
    ownerId: 'local',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 0,
  };

  const { result } = await runOrQueue(
    () => listsApi.create(data),
    () => enqueue('list.create', { tempId: optimistic.id, ...data })
  );

  const list = result ?? optimistic;
  upsertList(list);
  return list;
}

export async function updateListOffline(id: string, data: { name?: string; version: number }): Promise<List> {
  const cached = loadCachedData()?.lists.find((list) => list.id === id);
  const optimistic: List = {
    ...(cached ?? {
      id,
      name: data.name ?? 'List',
      type: 'personal',
      ownerId: 'local',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: data.version,
    }),
    name: data.name ?? cached?.name ?? 'List',
    updatedAt: new Date().toISOString(),
    version: data.version + 1,
  };

  const { result } = await runOrQueue(
    () => listsApi.update(id, data),
    () => enqueue('list.update', { id, ...data })
  );

  const list = result ?? optimistic;
  upsertList(list);
  return list;
}

export async function createItemOffline(data: {
  listId: string;
  title: string;
  description?: string;
  type: ItemType;
  schedule: Item['schedule'];
  assignedTo?: string;
  sharedWith?: string[];
  tags?: string[];
}): Promise<Item> {
  const optimistic: Item = {
    id: tempId('item'),
    listId: data.listId,
    title: data.title,
    description: data.description ?? null,
    type: data.type,
    status: 'active',
    schedule: data.schedule,
    assignedTo: data.assignedTo ?? null,
    sharedWith: data.sharedWith ?? null,
    tags: data.tags ?? null,
    nextDueAt: estimateNextDueAt(data.schedule),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 0,
  };

  const { result } = await runOrQueue(
    () => itemsApi.create(data),
    () => enqueue('item.create', { tempId: optimistic.id, ...data })
  );

  const item = result ?? optimistic;
  upsertItem(item);
  return item;
}

export async function updateItemOffline(
  id: string,
  data: {
    title?: string;
    description?: string;
    type?: ItemType;
    status?: ItemStatus;
    schedule?: Item['schedule'];
    assignedTo?: string;
    sharedWith?: string[];
    tags?: string[];
    version: number;
  }
): Promise<Item> {
  const cached = loadCachedData()?.items.find((item) => item.id === id);
  if (!cached) {
    throw new Error('Item not found in cache');
  }

  const optimistic: Item = {
    ...cached,
    ...data,
    nextDueAt: data.schedule ? estimateNextDueAt(data.schedule) : cached.nextDueAt,
    updatedAt: new Date().toISOString(),
    version: data.version + 1,
  };

  const { result } = await runOrQueue(
    () => itemsApi.update(id, data),
    () => enqueue('item.update', { id, ...data })
  );

  const item = result ?? optimistic;
  upsertItem(item);
  return item;
}

export async function deleteItemOffline(id: string): Promise<void> {
  removeItem(id);
  await runOrQueue(
    () => itemsApi.delete(id),
    () => enqueue('item.delete', { id })
  );
}

export async function completeItemOffline(item: Item): Promise<{ nextDueAt: string; queued: boolean }> {
  const estimatedNextDueAt = estimateNextDueAt(item.schedule);
  upsertItem({ ...item, nextDueAt: estimatedNextDueAt, updatedAt: new Date().toISOString() });

  const { result, queued } = await runOrQueue<Awaited<ReturnType<typeof itemsApi.complete>>>(
    () => itemsApi.complete(item.id),
    () => enqueue('item.complete', { id: item.id, estimatedNextDueAt })
  );

  if (result) {
    upsertItem({ ...item, nextDueAt: result.nextDueAt, updatedAt: new Date().toISOString() });
    return { nextDueAt: result.nextDueAt, queued: false };
  }

  return { nextDueAt: estimatedNextDueAt, queued };
}

export async function undoItemOffline(item: Item, completionId?: string): Promise<{ nextDueAt: string; queued: boolean }> {
  const estimatedNextDueAt = estimatePreviousDueAt(item.schedule, item.nextDueAt);
  upsertItem({ ...item, nextDueAt: estimatedNextDueAt, updatedAt: new Date().toISOString() });

  const { result, queued } = await runOrQueue<Awaited<ReturnType<typeof itemsApi.undo>>>(
    () => itemsApi.undo(item.id, completionId),
    () => enqueue('item.undo', { id: item.id, completionId, estimatedNextDueAt })
  );

  if (result) {
    upsertItem({ ...item, nextDueAt: result.nextDueAt, updatedAt: new Date().toISOString() });
    return { nextDueAt: result.nextDueAt, queued: false };
  }

  return { nextDueAt: estimatedNextDueAt, queued };
}

export async function addListMemberOffline(
  listId: string,
  userId: string,
  permission: MemberPermission
): Promise<ListMember> {
  const optimistic: ListMember = {
    id: tempId('item'),
    listId,
    userId,
    permission,
    joinedAt: new Date().toISOString(),
  };

  const { result, queued } = await runOrQueue(
    () => listsApi.addMember(listId, { userId, permission }),
    () => enqueue('list.addMember', { listId, userId, permission })
  );

  if (result) {
    upsertList(
      loadCachedData()?.lists.find((list) => list.id === listId) ?? {
        id: listId,
        name: 'List',
        type: 'personal',
        ownerId: 'local',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 0,
      },
      [...(loadCachedData()?.members[listId] ?? []), result]
    );
    return result;
  }

  if (queued) {
    const cached = loadCachedData();
    if (cached) {
      saveCachedData({
        lists: cached.lists,
        items: cached.items,
        members: {
          ...cached.members,
          [listId]: [...(cached.members[listId] ?? []), optimistic],
        },
      });
    }
  }

  return optimistic;
}

export async function updateListMemberOffline(
  listId: string,
  userId: string,
  permission: MemberPermission
): Promise<ListMember> {
  const cachedMembers = loadCachedData()?.members[listId] ?? [];
  const existing = cachedMembers.find((member) => member.userId === userId);
  const optimistic: ListMember = {
    ...(existing ?? { id: tempId('item'), listId, userId, joinedAt: new Date().toISOString(), permission: 'view' }),
    permission,
  };

  const { result } = await runOrQueue(
    () => listsApi.updateMember(listId, userId, { permission }),
    () => enqueue('list.updateMember', { listId, userId, permission })
  );

  return result ?? optimistic;
}

export async function removeListMemberOffline(listId: string, userId: string): Promise<void> {
  const cached = loadCachedData();
  if (cached) {
    saveCachedData({
      lists: cached.lists,
      items: cached.items,
      members: {
        ...cached.members,
        [listId]: (cached.members[listId] ?? []).filter((member) => member.userId !== userId),
      },
    });
  }

  await runOrQueue(
    () => listsApi.removeMember(listId, userId),
    () => enqueue('list.removeMember', { listId, userId })
  );
}

export async function runBackgroundSync(): Promise<SyncResult> {
  if (isOffline()) {
    return { synced: 0, failed: 0, conflicts: [] };
  }
  return syncOfflineQueue();
}

export function getOfflinePendingCount(): number {
  return getPendingCount();
}

export { isOffline, syncOfflineQueue };
