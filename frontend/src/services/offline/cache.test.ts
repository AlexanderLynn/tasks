import { describe, expect, it } from 'vitest';
import { loadCachedData, saveCachedData, upsertItem } from './cache';
import type { Item } from '../itemsApi';

const sampleItem = (id: string): Item => ({
  id,
  listId: 'list-1',
  title: 'Test',
  type: 'task',
  status: 'active',
  schedule: { type: 'daily', timezone: 'UTC' },
  nextDueAt: '2026-01-01T00:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  version: 0,
});

describe('offline cache', () => {
  it('persists and loads cached lists and items', () => {
    saveCachedData({
      lists: [{ id: 'list-1', name: 'Home', type: 'personal', ownerId: 'user-1', createdAt: '', updatedAt: '', version: 0 }],
      items: [sampleItem('item-1')],
      members: {},
    });

    const cached = loadCachedData();
    expect(cached?.lists).toHaveLength(1);
    expect(cached?.items).toHaveLength(1);
  });

  it('upserts items by id', () => {
    upsertItem(sampleItem('item-1'));
    upsertItem({ ...sampleItem('item-1'), title: 'Updated' });

    const cached = loadCachedData();
    expect(cached?.items[0]?.title).toBe('Updated');
  });
});
