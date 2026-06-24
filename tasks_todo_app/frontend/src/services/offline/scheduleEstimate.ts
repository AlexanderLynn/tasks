import type { ScheduleRule } from '../itemsApi';

export function estimateNextDueAt(schedule: ScheduleRule, from = new Date()): string {
  const next = new Date(from);

  switch (schedule.type) {
    case 'daily':
      next.setDate(next.getDate() + (schedule.interval ?? 1));
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7 * (schedule.interval ?? 1));
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + (schedule.interval ?? 1));
      break;
    case 'once':
      next.setFullYear(next.getFullYear() + 10);
      break;
    case 'custom':
      next.setDate(next.getDate() + (schedule.interval ?? 1));
      break;
    default:
      next.setDate(next.getDate() + 1);
  }

  if (schedule.time) {
    const [hours, minutes] = schedule.time.split(':').map(Number);
    if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
      next.setHours(hours, minutes, 0, 0);
    }
  }

  if (schedule.endDate) {
    const end = new Date(schedule.endDate);
    if (next.getTime() > end.getTime()) {
      return end.toISOString();
    }
  }

  return next.toISOString();
}

export function estimatePreviousDueAt(schedule: ScheduleRule, currentDueAt: string): string {
  const current = new Date(currentDueAt);
  const previous = new Date(current);

  switch (schedule.type) {
    case 'daily':
      previous.setDate(previous.getDate() - (schedule.interval ?? 1));
      break;
    case 'weekly':
      previous.setDate(previous.getDate() - 7 * (schedule.interval ?? 1));
      break;
    case 'monthly':
      previous.setMonth(previous.getMonth() - (schedule.interval ?? 1));
      break;
    default:
      previous.setDate(previous.getDate() - 1);
  }

  if (schedule.time) {
    const [hours, minutes] = schedule.time.split(':').map(Number);
    if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
      previous.setHours(hours, minutes, 0, 0);
    }
  }

  return previous.toISOString();
}
