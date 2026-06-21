# MCP Server

Model Context Protocol (MCP) server integration for AI agents to interact with the Habit & Chore Tracker.

## Overview

The MCP server exposes all CRUD operations as tools that AI agents can use to:
- Create, update, delete items
- Query items, lists, and completions
- Complete and undo completions
- Manage lists and permissions
- Search and filter data

All MCP tools respect the permission model and use the same validation as the REST API.

## MCP Tools

### Query Tools

#### `list_items`

List all items with optional filtering.

```typescript
{
  name: "list_items",
  description: "List all items with optional filtering",
  inputSchema: {
    type: "object",
    properties: {
      listId: { type: "string", description: "Filter by list ID" },
      type: { type: "string", enum: ["habit", "chore", "task"], description: "Filter by item type" },
      status: { type: "string", enum: ["active", "archived", "deleted"], description: "Filter by status" },
      assignedTo: { type: "string", description: "Filter by assigned user ID" },
      limit: { type: "number", description: "Maximum number of results" },
      offset: { type: "number", description: "Offset for pagination" }
    }
  }
}
```

**Response:**
```typescript
{
  items: Item[],
  total: number
}
```

#### `get_item`

Get a single item with full details.

```typescript
{
  name: "get_item",
  description: "Get a single item by ID",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "Item ID" }
    },
    required: ["id"]
  }
}
```

**Response:**
```typescript
{
  item: Item,
  completions: Completion[],
  nextDueAt: Date
}
```

#### `list_completions`

Get completion history for an item.

```typescript
{
  name: "list_completions",
  description: "Get completion history for an item",
  inputSchema: {
    type: "object",
    properties: {
      itemId: { type: "string", description: "Item ID" },
      userId: { type: "string", description: "Filter by user ID" },
      undone: { type: "boolean", description: "Include/exclude undone completions" },
      limit: { type: "number", description: "Maximum number of results" }
    },
    required: ["itemId"]
  }
}
```

**Response:**
```typescript
{
  completions: Completion[],
  total: number
}
```

#### `get_next_due`

Calculate the next due date for an item.

```typescript
{
  name: "get_next_due",
  description: "Calculate the next due date for an item",
  inputSchema: {
    type: "object",
    properties: {
      itemId: { type: "string", description: "Item ID" }
    },
    required: ["itemId"]
  }
}
```

**Response:**
```typescript
{
  itemId: string,
  nextDueAt: Date,
  scheduledFor: Date
}
```

#### `search_items`

Search items by title, description, or tags.

```typescript
{
  name: "search_items",
  description: "Search items by title, description, or tags",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string", description: "Search query" },
      listId: { type: "string", description: "Filter by list ID" },
      limit: { type: "number", description: "Maximum number of results" }
    },
    required: ["query"]
  }
}
```

**Response:**
```typescript
{
  items: Item[],
  total: number
}
```

### Action Tools

#### `create_item`

Create a new habit, chore, or task.

```typescript
{
  name: "create_item",
  description: "Create a new habit, chore, or task",
  inputSchema: {
    type: "object",
    properties: {
      listId: { type: "string", description: "List ID" },
      title: { type: "string", description: "Item title" },
      description: { type: "string", description: "Item description" },
      type: { type: "string", enum: ["habit", "chore", "task"], description: "Item type" },
      schedule: { type: "object", description: "Schedule rule" },
      assignedTo: { type: "string", description: "Assigned user ID" }
    },
    required: ["listId", "title", "type", "schedule"]
  }
}
```

**Response:**
```typescript
{
  item: Item,
  nextDueAt: Date
}
```

#### `update_item`

Update an existing item.

```typescript
{
  name: "update_item",
  description: "Update an existing item",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "Item ID" },
      title: { type: "string", description: "Item title" },
      description: { type: "string", description: "Item description" },
      type: { type: "string", enum: ["habit", "chore", "task"], description: "Item type" },
      status: { type: "string", enum: ["active", "archived", "deleted"], description: "Item status" },
      schedule: { type: "object", description: "Schedule rule" },
      assignedTo: { type: "string", description: "Assigned user ID" },
      version: { type: "number", description: "Current version for optimistic concurrency" }
    },
    required: ["id"]
  }
}
```

**Response:**
```typescript
{
  item: Item,
  nextDueAt: Date
}
```

#### `delete_item`

Delete an item (soft delete).

```typescript
{
  name: "delete_item",
  description: "Delete an item (soft delete)",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "Item ID" }
    },
    required: ["id"]
  }
}
```

**Response:**
```typescript
{
  success: boolean,
  itemId: string
}
```

#### `complete_item`

Mark an item as complete.

```typescript
{
  name: "complete_item",
  description: "Mark an item as complete",
  inputSchema: {
    type: "object",
    properties: {
      itemId: { type: "string", description: "Item ID" },
      completedAt: { type: "string", description: "Completion time (ISO 8601), defaults to now" }
    },
    required: ["itemId"]
  }
}
```

**Response:**
```typescript
{
  completion: Completion,
  nextDueAt: Date
}
```

#### `undo_completion`

Undo the last completion for an item.

```typescript
{
  name: "undo_completion",
  description: "Undo the last completion for an item",
  inputSchema: {
    type: "object",
    properties: {
      itemId: { type: "string", description: "Item ID" },
      completionId: { type: "string", description: "Specific completion ID to undo (optional, defaults to last)" }
    },
    required: ["itemId"]
  }
}
```

**Response:**
```typescript
{
  completion: Completion,
  nextDueAt: Date
}
```

### List Management Tools

#### `list_lists`

Get all lists accessible to the user.

```typescript
{
  name: "list_lists",
  description: "Get all lists accessible to the user",
  inputSchema: {
    type: "object",
    properties: {
      type: { type: "string", enum: ["personal", "shared"], description: "Filter by list type" }
    }
  }
}
```

**Response:**
```typescript
{
  lists: List[],
  members: { [listId: string]: ListMember[] }
}
```

#### `create_list`

Create a new list.

```typescript
{
  name: "create_list",
  description: "Create a new list",
  inputSchema: {
    type: "object",
    properties: {
      name: { type: "string", description: "List name" },
      type: { type: "string", enum: ["personal", "shared"], description: "List type" }
    },
    required: ["name", "type"]
  }
}
```

**Response:**
```typescript
{
  list: List
}
```

#### `share_list`

Share a list with another user.

```typescript
{
  name: "share_list",
  description: "Share a list with another user",
  inputSchema: {
    type: "object",
    properties: {
      listId: { type: "string", description: "List ID" },
      userId: { type: "string", description: "User ID to share with" },
      permission: { type: "string", enum: ["view", "edit", "admin"], description: "Permission level" }
    },
    required: ["listId", "userId", "permission"]
  }
}
```

**Response:**
```typescript
{
  member: ListMember
}
```

#### `set_permissions`

Update permissions for a list member.

```typescript
{
  name: "set_permissions",
  description: "Update permissions for a list member",
  inputSchema: {
    type: "object",
    properties: {
      listId: { type: "string", description: "List ID" },
      userId: { type: "string", description: "User ID" },
      permission: { type: "string", enum: ["view", "edit", "admin"], description: "New permission level" }
    },
    required: ["listId", "userId", "permission"]
  }
}
```

**Response:**
```typescript
{
  member: ListMember
}
```

#### `remove_list_member`

Remove a member from a list.

```typescript
{
  name: "remove_list_member",
  description: "Remove a member from a list",
  inputSchema: {
    type: "object",
    properties: {
      listId: { type: "string", description: "List ID" },
      userId: { type: "string", description: "User ID to remove" }
    },
    required: ["listId", "userId"]
  }
}
```

**Response:**
```typescript
{
  success: boolean,
  memberId: string
}
```

## Authentication

MCP server uses API keys for authentication:

1. Each user has an `apiKey` in the User table
2. MCP client must include the API key in the request
3. Server validates the API key and determines the user context
4. All operations are performed in the context of that user
5. Permission checks are enforced based on user's role in lists

## Permission Model

The MCP server respects the permission model:

- **Personal lists**: Only owner can view/edit
- **Shared lists**: 
  - `view`: Can query items and completions
  - `edit`: Can create/update items, complete items
  - `admin`: Full control + manage members

AI agents cannot perform actions beyond the user's permissions.

## Error Handling

All MCP tools return standardized error responses:

```typescript
{
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

Common error codes:
- `UNAUTHORIZED`: Invalid or missing API key
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid input data
- `CONFLICT`: Version conflict (optimistic concurrency)
- `INTERNAL_ERROR`: Server error

## Real-Time Events

The MCP server can push real-time events to subscribed clients:

```typescript
{
  type: "item_created" | "item_updated" | "item_deleted" | "item_completed" | "completion_undone",
  data: {
    item?: Item,
    completion?: Completion,
    listId: string
  },
  timestamp: Date
}
```

Clients can subscribe to events for specific lists or all lists.

## Example Usage

### AI Agent Creating a Daily Habit

```typescript
// AI agent calls MCP tool
const result = await mcpClient.callTool("create_item", {
  listId: "list-123",
  title: "Daily Scripture Reading",
  description: "Read scriptures for 15 minutes",
  type: "habit",
  schedule: {
    type: "daily",
    time: "09:00",
    timezone: "America/Denver"
  }
});

// Response
{
  item: {
    id: "item-456",
    listId: "list-123",
    title: "Daily Scripture Reading",
    type: "habit",
    schedule: { type: "daily", time: "09:00", timezone: "America/Denver" },
    nextDueAt: "2026-06-21T09:00:00-06:00",
    // ...
  },
  nextDueAt: "2026-06-21T09:00:00-06:00"
}
```

### AI Agent Completing a Chore

```typescript
const result = await mcpClient.callTool("complete_item", {
  itemId: "item-789"
});

// Response
{
  completion: {
    id: "comp-101",
    itemId: "item-789",
    userId: "user-123",
    completedAt: "2026-06-20T15:30:00-06:00",
    scheduledFor: "2026-06-20T09:00:00-06:00",
    undone: false
  },
  nextDueAt: "2026-06-27T09:00:00-06:00"  // Next Tuesday
}
```

## Implementation Notes

- All MCP tools use the same service layer as the REST API
- Validation is performed using shared Zod schemas
- Audit logging is automatic for all actions
- Next due date calculation is server-side
- Optimistic concurrency is enforced via version field
