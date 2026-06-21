import { ScheduleRule } from '../shared/types/index.js';

/**
 * Calculate the next due date for an item based on its schedule rule
 */
export function calculateNextDueDate(schedule: ScheduleRule, lastCompleted?: Date): Date {
  const now = new Date();
  const baseDate = lastCompleted || now;
  const timezone = schedule.timezone;

  switch (schedule.type) {
    case 'once':
      // For one-time tasks, return the scheduled time if it's in the future
      if (schedule.time) {
        const scheduledTime = parseTime(schedule.time, baseDate, timezone);
        return scheduledTime > now ? scheduledTime : new Date(8640000000000000); // Far future if passed
      }
      return baseDate;

    case 'daily':
      return calculateDailyNext(schedule, baseDate, timezone);

    case 'weekly':
      return calculateWeeklyNext(schedule, baseDate, timezone);

    case 'monthly':
      return calculateMonthlyNext(schedule, baseDate, timezone);

    case 'custom':
      return calculateCustomNext(schedule, baseDate, timezone);

    default:
      return baseDate;
  }
}

function calculateDailyNext(schedule: ScheduleRule, baseDate: Date, timezone: string): Date {
  const next = new Date(baseDate);
  next.setDate(next.getDate() + 1);

  if (schedule.time) {
    const time = parseTime(schedule.time, next, timezone);
    return time;
  }

  return toTimezone(next, timezone);
}

function calculateWeeklyNext(schedule: ScheduleRule, baseDate: Date, timezone: string): Date {
  if (!schedule.daysOfWeek || schedule.daysOfWeek.length === 0) {
    // Default to same day next week
    const next = new Date(baseDate);
    next.setDate(next.getDate() + 7);
    return toTimezone(next, timezone);
  }

  const currentDay = baseDate.getDay();
  const targetDays = schedule.daysOfWeek.sort((a: number, b: number) => a - b);

  // Find the next target day
  let nextDay = targetDays.find(day => day > currentDay);
  
  if (nextDay === undefined) {
    // Wrap to next week
    nextDay = targetDays[0];
    const daysUntilNext = (7 - currentDay) + nextDay;
    const next = new Date(baseDate);
    next.setDate(next.getDate() + daysUntilNext);
    
    if (schedule.time) {
      return parseTime(schedule.time, next, timezone);
    }
    return toTimezone(next, timezone);
  }

  const daysUntil = nextDay - currentDay;
  const next = new Date(baseDate);
  next.setDate(next.getDate() + daysUntil);

  if (schedule.time) {
    return parseTime(schedule.time, next, timezone);
  }

  return toTimezone(next, timezone);
}

function calculateMonthlyNext(schedule: ScheduleRule, baseDate: Date, timezone: string): Date {
  if (!schedule.dayOfMonth || schedule.dayOfMonth.length === 0) {
    // Default to same day next month
    const next = new Date(baseDate);
    next.setMonth(next.getMonth() + 1);
    return toTimezone(next, timezone);
  }

  const currentDay = baseDate.getDate();
  const targetDays = schedule.dayOfMonth.sort((a: number, b: number) => a - b);

  // Find the next target day in current month
  let nextDay = targetDays.find(day => day > currentDay);

  if (nextDay === undefined) {
    // Move to next month
    nextDay = targetDays[0];
    const next = new Date(baseDate);
    next.setMonth(next.getMonth() + 1);
    next.setDate(Math.min(nextDay, getDaysInMonth(next.getFullYear(), next.getMonth())));
    
    if (schedule.time) {
      return parseTime(schedule.time, next, timezone);
    }
    return toTimezone(next, timezone);
  }

  const next = new Date(baseDate);
  next.setDate(nextDay);

  if (schedule.time) {
    return parseTime(schedule.time, next, timezone);
  }

  return toTimezone(next, timezone);
}

function calculateCustomNext(schedule: ScheduleRule, baseDate: Date, timezone: string): Date {
  if (!schedule.interval) {
    return baseDate;
  }

  const next = new Date(baseDate);
  next.setDate(next.getDate() + schedule.interval);

  if (schedule.time) {
    return parseTime(schedule.time, next, timezone);
  }

  return toTimezone(next, timezone);
}

function parseTime(time: string, date: Date, timezone: string): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return toTimezone(result, timezone);
}

function toTimezone(date: Date, timezone: string): Date {
  // Simple timezone handling - in production, use a library like luxon or date-fns-tz
  return new Date(date.toLocaleString('en-US', { timeZone: timezone }));
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}
