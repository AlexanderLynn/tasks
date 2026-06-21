# Scheduling Behavior Documentation

## Overview

The scheduling system calculates next due dates for habits, chores, and tasks based on flexible recurrence rules. All scheduling logic is server-side to ensure consistency across all clients (API, MCP server, frontend).

## Schedule Rule Structure

```typescript
interface ScheduleRule {
  type: 'once' | 'daily' | 'weekly' | 'monthly' | 'custom';
  daysOfWeek?: number[];        // 0-6 (Sunday-Saturday) for weekly
  dayOfMonth?: number[];        // 1-31 for monthly
  interval?: number;            // Days between occurrences for custom
  time?: string;                // HH:MM format (24-hour)
  endDate?: Date;               // Optional recurrence end date
  timezone: string;             // IANA timezone (e.g., 'America/Denver')
}
```

## Schedule Types

### Once
One-time tasks that occur at a specific time or immediately.

- **Behavior**: Returns the scheduled time if in the future, otherwise returns a far-future date
- **Required fields**: `timezone`
- **Optional fields**: `time`
- **Example**: 
  ```json
  {
    "type": "once",
    "time": "15:00",
    "timezone": "America/Denver"
  }
  ```

### Daily
Tasks that recur every day.

- **Behavior**: Adds 1 day to the base date
- **Required fields**: `timezone`
- **Optional fields**: `time`
- **Example**:
  ```json
  {
    "type": "daily",
    "time": "09:00",
    "timezone": "America/Denver"
  }
  ```

### Weekly
Tasks that recur on specific days of the week.

- **Behavior**: Finds the next occurrence based on `daysOfWeek` array
- **Required fields**: `timezone`, `daysOfWeek`
- **Optional fields**: `time`
- **Days of week**: 0 (Sunday) through 6 (Saturday)
- **Example**:
  ```json
  {
    "type": "weekly",
    "daysOfWeek": [1, 3, 5],  // Monday, Wednesday, Friday
    "time": "08:00",
    "timezone": "America/Denver"
  }
  ```

### Monthly
Tasks that recur on specific days of the month.

- **Behavior**: Finds the next occurrence based on `dayOfMonth` array
- **Required fields**: `timezone`, `dayOfMonth`
- **Optional fields**: `time`
- **Days of month**: 1 through 31
- **Edge cases**: If a day doesn't exist in a month (e.g., 31 in February), it rolls over to the next month
- **Example**:
  ```json
  {
    "type": "monthly",
    "dayOfMonth": [1, 15],  // 1st and 15th of each month
    "time": "10:00",
    "timezone": "America/Denver"
  }
  ```

### Custom
Tasks that recur at a custom interval (in days).

- **Behavior**: Adds `interval` days to the base date
- **Required fields**: `timezone`, `interval`
- **Optional fields**: `time`
- **Interval**: Must be >= 1
- **Example**:
  ```json
  {
    "type": "custom",
    "interval": 3,  // Every 3 days
    "time": "12:00",
    "timezone": "America/Denver"
  }
  ```

## Timezone Handling

The scheduling system uses IANA timezone strings (e.g., 'America/Denver', 'Asia/Tokyo', 'Europe/London').

- All date calculations are performed in the specified timezone
- Timezone conversion uses JavaScript's `toLocaleString` with the `timeZone` option
- This ensures that recurring events happen at the same local time regardless of daylight saving time changes

**Note**: The current implementation uses basic timezone handling. For production use with complex timezone scenarios, consider using a dedicated library like `luxon` or `date-fns-tz`.

## Time Specification

The optional `time` field specifies when during the day the task should occur.

- **Format**: HH:MM (24-hour format)
- **Validation**: Must match regex `/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/`
- **Examples**: "09:00", "15:30", "23:45"
- **Behavior**: If specified, the time is set on the calculated date. If not specified, the time from the base date is preserved.

## Recurrence End Date

The optional `endDate` field specifies when the recurrence should stop.

- **Behavior**: If the calculated next due date exceeds the `endDate`, the function returns a far-future date (effectively marking the item as complete)
- **Validation**: Must be a valid date in the future
- **Example**:
  ```json
  {
    "type": "daily",
    "endDate": "2024-12-31T23:59:59Z",
    "timezone": "America/Denver"
  }
  ```

## Schedule Validation

The `validateSchedule()` function performs comprehensive validation:

1. **Timezone validation**: Checks if the timezone string is valid
2. **Time format validation**: Ensures time matches HH:MM format if provided
3. **End date validation**: Ensures end date is valid and not in the past
4. **Type-specific validation**:
   - Weekly: Requires `daysOfWeek` array with values 0-6
   - Monthly: Requires `dayOfMonth` array with values 1-31
   - Custom: Requires `interval` >= 1

**Returns**: `{ valid: boolean, error?: string }`

## Calculation Logic

The `calculateNextDueDate()` function:

1. Takes a `ScheduleRule` and optional `lastCompleted` date
2. Calculates the next occurrence based on the schedule type
3. Applies time specification if provided
4. Converts to the specified timezone
5. Checks against the end date if provided
6. Returns the next due date

**Base date**: If `lastCompleted` is provided, uses that as the base. Otherwise uses the current time.

## Edge Cases

### Month Boundaries
- Monthly schedules with day 31 in February roll over to March
- The system uses `Math.min(targetDay, daysInMonth)` to handle months with fewer days

### Year Boundaries
- Schedules correctly wrap from December to January
- Leap years are handled automatically by JavaScript's Date object

### Timezone Conversion
- Converting between timezones may shift the date
- The system preserves the local time in the specified timezone

### Empty Arrays
- Weekly schedules without `daysOfWeek` default to same day next week
- Monthly schedules without `dayOfMonth` default to same day next month

## Usage Examples

### Creating a daily habit
```typescript
const schedule: ScheduleRule = {
  type: 'daily',
  time: '07:00',
  timezone: 'America/Denver'
};
const nextDue = calculateNextDueDate(schedule);
```

### Creating a weekly chore
```typescript
const schedule: ScheduleRule = {
  type: 'weekly',
  daysOfWeek: [6], // Saturday
  time: '10:00',
  timezone: 'America/Denver',
  endDate: new Date('2024-06-30')
};
const nextDue = calculateNextDueDate(schedule);
```

### Validating a schedule
```typescript
const schedule: ScheduleRule = {
  type: 'weekly',
  daysOfWeek: [1, 3, 5],
  timezone: 'America/Denver'
};
const validation = validateSchedule(schedule);
if (!validation.valid) {
  console.error(validation.error);
}
```

## Testing

The scheduling system includes comprehensive test coverage:

- 18 validation tests covering all validation scenarios
- 19 calculation tests covering all schedule types and edge cases
- Tests for timezone conversion, month/year boundaries, leap years
- Tests for end date handling

Run tests with:
```bash
cd backend
npm test
```

## Future Enhancements

Potential improvements for production use:

1. **Advanced timezone handling**: Use `luxon` or `date-fns-tz` for more robust timezone support
2. **Business day calculations**: Skip weekends/holidays for business schedules
3. **Relative scheduling**: "First Monday of the month", "Last Friday of the quarter"
4. **Schedule exceptions**: Allow skipping specific occurrences
5. **Schedule patterns**: More complex recurrence patterns (e.g., "every 2 weeks on Monday and Wednesday")
