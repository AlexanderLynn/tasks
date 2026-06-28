# Data Models

The shared type definitions live in [`tasks_todo_app/backend/src/shared/types/index.ts`](/Users/alexanderlynn/Desktop/tasks/tasks_todo_app/backend/src/shared/types/index.ts), and the SQLite schema lives in [`tasks_todo_app/backend/src/db/schema.ts`](/Users/alexanderlynn/Desktop/tasks/tasks_todo_app/backend/src/db/schema.ts).

This file keeps only the stable, repo-wide structures that are still relevant.

## Core Entities

### User

- Identity record
- Email + password login on the API side
- API key for authenticated API access

### List

- Top-level container for items
- `type` is `personal` or `shared`
- Owned by a user
- Uses a `version` field for optimistic updates

### ListMember

- Connects users to shared lists
- Permissions are `view`, `edit`, or `admin`

### Item

- Main work unit: `habit`, `chore`, or `task`
- Belongs to a list
- Carries `status`, `schedule`, optional `assignedTo`, optional `sharedWith`, optional `tags`
- Stores `nextDueAt` so the backend can sort and query efficiently

### Completion

- Immutable completion history for an item
- Supports undo metadata

### AuditLog

- Tracks create, update, delete, complete, and undo actions

## Schedule Shape

The shared schedule contract is:

```ts
interface ScheduleRule {
  type: 'once' | 'daily' | 'weekly' | 'monthly' | 'custom';
  daysOfWeek?: number[];
  dayOfMonth?: number[];
  interval?: number;
  time?: string;
  endDate?: Date;
  timezone: string;
}
```

Supported recurrence types remain:

- `once`
- `daily`
- `weekly`
- `monthly`
- `custom`

The scheduling helpers are implemented in [`tasks_todo_app/backend/src/services/schedule.service.ts`](/Users/alexanderlynn/Desktop/tasks/tasks_todo_app/backend/src/services/schedule.service.ts).

## Validation

Shared Zod schemas live in [`tasks_todo_app/backend/src/shared/schemas/index.ts`](/Users/alexanderlynn/Desktop/tasks/tasks_todo_app/backend/src/shared/schemas/index.ts). Those schemas are the best source of truth for current input requirements such as:

- UUID expectations
- string length limits
- allowed enum values
- schedule validation shape
