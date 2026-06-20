# Data Models

Complete database schema and TypeScript type definitions for the Habit & Chore Tracker.

## Overview

All data models are designed with:
- **History tracking**: Complete audit log for undo/redo
- **Version control**: Optimistic concurrency support
- **AI-ready**: Clear structure for MCP tools
- **Home Assistant compatible**: Simple SQLite schema
- **Flexible sharing**: Lists can be shared, individual items can be shared
- **Grouping support**: Items can be tagged for grouping (by room, category, etc.)

## Core Entities

### User

Represents a user of the system.

```typescript
interface User {
  id: string;              // UUID
  name: string;            // Display name
  email: string;           // Email address (unique)
  apiKey: string;          // API key for MCP/AI access
  createdAt: Date;         // Timestamp
  updatedAt: Date;         // Timestamp
}
```

**Database Schema:**
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  api_key TEXT UNIQUE NOT NULL,
  created_at TEXT NOT NULL,  -- ISO 8601
  updated_at TEXT NOT NULL   -- ISO 8601
);
```

### List

Represents a personal or shared list of items.

```typescript
interface List {
  id: string;              // UUID
  name: string;            // List name
  type: 'personal' | 'shared';
  ownerId: string;         // User.id (owner is always admin)
  createdAt: Date;
  updatedAt: Date;
  version: number;         // For optimistic concurrency
}
```

**Database Schema:**
```sql
CREATE TABLE lists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('personal', 'shared')),
  owner_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);
```

### ListMember

Represents membership and permissions for shared lists.

```typescript
interface ListMember {
  id: string;              // UUID
  listId: string;          // List.id
  userId: string;          // User.id
  permission: 'view' | 'edit' | 'admin';
  joinedAt: Date;
}
```

**Database Schema:**
```sql
CREATE TABLE list_members (
  id TEXT PRIMARY KEY,
  list_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  permission TEXT NOT NULL CHECK(permission IN ('view', 'edit', 'admin')),
  joined_at TEXT NOT NULL,
  FOREIGN KEY (list_id) REFERENCES lists(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(list_id, user_id)
);
```

### Item

Represents a habit, chore, or task.

```typescript
interface Item {
  id: string;              // UUID
  listId: string;          // List.id
  title: string;           // Item title
  description?: string;    // Optional description
  type: 'habit' | 'chore' | 'task';
  status: 'active' | 'archived' | 'deleted';
  schedule: ScheduleRule;  // JSON object
  assignedTo?: string;     // User.id (for chore assignment)
  sharedWith?: string[];   // User IDs who can see this item (individual sharing)
  tags?: string[];         // Tags for grouping (e.g., "kitchen", "bedroom", "daily")
  nextDueAt: Date;         // Pre-calculated next due date
  createdAt: Date;
  updatedAt: Date;
  version: number;         // For optimistic concurrency
}
```

**Database Schema:**
```sql
CREATE TABLE items (
  id TEXT PRIMARY KEY,
  list_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK(type IN ('habit', 'chore', 'task')),
  status TEXT NOT NULL CHECK(status IN ('active', 'archived', 'deleted')),
  schedule TEXT NOT NULL,  -- JSON string
  assigned_to TEXT,
  shared_with TEXT,        -- JSON array of user IDs
  tags TEXT,               -- JSON array of tag strings
  next_due_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (list_id) REFERENCES lists(id),
  FOREIGN KEY (assigned_to) REFERENCES users(id)
);
```

### ScheduleRule

Defines when an item should recur.

```typescript
interface ScheduleRule {
  type: 'once' | 'daily' | 'weekly' | 'monthly' | 'custom';
  daysOfWeek?: number[];     // 0-6 (Sunday=0)
  dayOfMonth?: number[];      // 1-31
  interval?: number;          // Every N days
  time?: string;             // HH:mm format
  endDate?: Date;            // Optional end date
  timezone: string;           // IANA timezone (e.g., 'America/Denver')
}
```

**Examples:**
```typescript
// Daily at 9am
{ type: 'daily', time: '09:00', timezone: 'America/Denver' }

// Every Tuesday and Thursday
{ type: 'weekly', daysOfWeek: [2, 4], timezone: 'America/Denver' }

// 1st and 15th of month
{ type: 'monthly', dayOfMonth: [1, 15], timezone: 'America/Denver' }

// Every 3 days
{ type: 'custom', interval: 3, timezone: 'America/Denver' }

// One-time task
{ type: 'once', time: '14:00', timezone: 'America/Denver' }
```

### Completion

Represents a completion of an item (immutable for history).

```typescript
interface Completion {
  id: string;              // UUID
  itemId: string;          // Item.id
  userId: string;          // User.id (who completed it)
  completedAt: Date;       // When it was completed
  scheduledFor: Date;      // When it was due
  undone: boolean;         // Whether this completion was undone
  undoneAt?: Date;         // When it was undone
  undoneBy?: string;       // User.id (who undid it)
}
```

**Database Schema:**
```sql
CREATE TABLE completions (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  completed_at TEXT NOT NULL,
  scheduled_for TEXT NOT NULL,
  undone INTEGER NOT NULL DEFAULT 0,
  undone_at TEXT,
  undone_by TEXT,
  FOREIGN KEY (item_id) REFERENCES items(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (undone_by) REFERENCES users(id)
);
```

### AuditLog

Complete audit trail for all actions (enables undo/redo).

```typescript
interface AuditLog {
  id: string;              // UUID
  entityType: 'item' | 'list' | 'completion' | 'member';
  entityId: string;        // ID of the affected entity
  action: 'create' | 'update' | 'delete' | 'complete' | 'undo';
  userId: string;          // User.id (who performed action)
  changes: Record<string, { old: any; new: any }>;  // What changed
  createdAt: Date;
}
```

**Database Schema:**
```sql
CREATE TABLE audit_log (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL,
  user_id TEXT NOT NULL,
  changes TEXT NOT NULL,    -- JSON string
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Relationships

```
User (1) ----< (N) List (owner)
User (N) >< (N) List (via ListMember)
List (1) ----< (N) Item
List (1) ----< (N) ListMember
Item (1) ----< (N) Completion
User (1) ----< (N) Completion (completer)
User (1) ----< (N) Completion (undoer)
Item (1) ----< (N) AuditLog
List (1) ----< (N) AuditLog
Completion (1) ----< (N) AuditLog
```

## Indexes

```sql
CREATE INDEX idx_items_list_id ON items(list_id);
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_items_next_due ON items(next_due_at);
CREATE INDEX idx_completions_item_id ON completions(item_id);
CREATE INDEX idx_completions_user_id ON completions(user_id);
CREATE INDEX idx_completions_completed_at ON completions(completed_at);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);
```

## Validation

All entities are validated using Zod schemas (shared between backend, MCP, and frontend).

```typescript
import { z } from 'zod';

export const scheduleRuleSchema = z.object({
  type: z.enum(['once', 'daily', 'weekly', 'monthly', 'custom']),
  daysOfWeek: z.array(z.number().min(0).max(6)).optional(),
  dayOfMonth: z.array(z.number().min(1).max(31)).optional(),
  interval: z.number().positive().optional(),
  time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  endDate: z.string().datetime().optional(),
  timezone: z.string(),
});

export const itemSchema = z.object({
  id: z.string().uuid(),
  listId: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  type: z.enum(['habit', 'chore', 'task']),
  status: z.enum(['active', 'archived', 'deleted']),
  schedule: scheduleRuleSchema,
  assignedTo: z.string().uuid().optional(),
  sharedWith: z.array(z.string().uuid()).optional(),
  tags: z.array(z.string()).optional(),
  nextDueAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  version: z.number().int().nonnegative(),
});
```

## Undo/Redo Strategy

1. **Undo Completion**: Mark completion as `undone = true`, record `undoneAt` and `undoneBy`
2. **Undo Create**: Soft delete (status = 'deleted'), create audit log
3. **Undo Update**: Restore previous state from audit log
4. **Redo**: Reverse the undo operation using audit log trail

## Migration Strategy

Since this uses SQLite, migrations are handled via:
- Version tracking in a `migrations` table
- SQL migration files in `/migrations` directory
- Automatic migration on startup
