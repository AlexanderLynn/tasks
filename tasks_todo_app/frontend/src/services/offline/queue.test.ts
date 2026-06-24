import { describe, expect, it } from 'vitest';
import { enqueue, getPendingCount, getQueue, removeOperation } from './queue';

describe('offline queue', () => {
  it('enqueues and reads operations', () => {
    enqueue('item.complete', { id: 'item-1', estimatedNextDueAt: '2026-01-01T00:00:00.000Z' });
    expect(getPendingCount()).toBe(1);
    expect(getQueue()[0]?.type).toBe('item.complete');
  });

  it('removes processed operations', () => {
    const operation = enqueue('list.create', { tempId: 'temp-list-1', name: 'Groceries', type: 'personal' });
    removeOperation(operation.id);
    expect(getPendingCount()).toBe(0);
  });
});
