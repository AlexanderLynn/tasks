import { describe, expect, it } from 'vitest';
import { estimateNextDueAt, estimatePreviousDueAt } from './scheduleEstimate';

describe('scheduleEstimate', () => {
  it('estimates the next daily due date', () => {
    const next = estimateNextDueAt(
      { type: 'daily', interval: 1, timezone: 'UTC', time: '09:00' },
      new Date('2026-06-21T08:00:00.000Z')
    );
    expect(next).toContain('2026-06-22');
  });

  it('estimates the previous due date for undo', () => {
    const previous = estimatePreviousDueAt(
      { type: 'weekly', interval: 1, timezone: 'UTC' },
      '2026-06-28T09:00:00.000Z'
    );
    expect(new Date(previous).getTime()).toBeLessThan(new Date('2026-06-28T09:00:00.000Z').getTime());
  });
});
