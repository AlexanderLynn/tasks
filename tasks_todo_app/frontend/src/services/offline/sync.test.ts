import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AxiosError } from 'axios';
import { enqueue } from './queue';
import { syncOfflineQueue } from './sync';

vi.mock('../itemsApi', () => ({
  itemsApi: {
    complete: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock('../listsApi', () => ({
  listsApi: {
    update: vi.fn(),
    getById: vi.fn(),
  },
}));

import { itemsApi } from '../itemsApi';
import { listsApi } from '../listsApi';

describe('syncOfflineQueue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('syncs queued operations when online', async () => {
    vi.mocked(itemsApi.complete).mockResolvedValue({
      completion: { id: 'c1', undone: false },
      nextDueAt: '2026-06-22T09:00:00.000Z',
    });
    vi.mocked(itemsApi.getById).mockResolvedValue({
      item: {
        id: 'item-1',
        listId: 'list-1',
        title: 'Task',
        type: 'task',
        status: 'active',
        schedule: { type: 'daily', timezone: 'UTC' },
        nextDueAt: '2026-06-22T09:00:00.000Z',
        createdAt: '',
        updatedAt: '',
        version: 1,
      },
      completions: [],
      nextDueAt: '2026-06-22T09:00:00.000Z',
    });

    enqueue('item.complete', { id: 'item-1', estimatedNextDueAt: '2026-06-22T09:00:00.000Z' });
    const result = await syncOfflineQueue();

    expect(result.synced).toBe(1);
    expect(itemsApi.complete).toHaveBeenCalledWith('item-1');
  });

  it('records conflicts and refreshes server state on version mismatch', async () => {
    vi.mocked(listsApi.update).mockRejectedValue(
      new AxiosError('conflict', undefined, undefined, undefined, {
        status: 409,
        statusText: 'Conflict',
        headers: {},
        config: {} as any,
        data: {},
      })
    );
    vi.mocked(listsApi.getById).mockResolvedValue({
      list: {
        id: 'list-1',
        name: 'Server Name',
        type: 'personal',
        ownerId: 'user-1',
        createdAt: '',
        updatedAt: '',
        version: 2,
      },
      items: [],
      members: [],
    });

    enqueue('list.update', { id: 'list-1', name: 'Local Name', version: 1 });
    const result = await syncOfflineQueue();

    expect(result.conflicts).toHaveLength(1);
    expect(result.synced).toBe(1);
    expect(listsApi.getById).toHaveBeenCalledWith('list-1');
  });
});
