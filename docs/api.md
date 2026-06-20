# REST API Reference

Complete REST API documentation for the Habit & Chore Tracker.

## Overview

All API endpoints use the same validation and business logic as the MCP server. The API is designed for:
- PWA frontend communication
- Home Assistant integration
- Third-party integrations
- Webhooks and automation

## Base URL

```
http://localhost:8080/api
```

## Authentication

### API Key Authentication

Include the API key in the `Authorization` header:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  http://localhost:8080/api/items
```

### Home Assistant Token Authentication

When running as a Home Assistant addon, you can use HA Long-Lived Access Tokens:

```bash
curl -H "Authorization: Bearer HA_TOKEN" \
  http://homeassistant.local:8080/api/items
```

## Response Format

All responses follow this structure:

```typescript
{
  success: boolean,
  data?: any,
  error?: {
    code: string,
    message: string,
    details?: any
  }
}
```

## Endpoints

### Items

#### GET /api/items

List all items with optional filtering.

**Query Parameters:**
- `listId` (string, optional): Filter by list ID
- `type` (string, optional): Filter by type (habit/chore/task)
- `status` (string, optional): Filter by status (active/archived/deleted)
- `assignedTo` (string, optional): Filter by assigned user ID
- `limit` (number, optional): Maximum results (default: 50)
- `offset` (number, optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "item-123",
        "listId": "list-456",
        "title": "Daily Scripture Reading",
        "description": "Read scriptures for 15 minutes",
        "type": "habit",
        "status": "active",
        "schedule": {
          "type": "daily",
          "time": "09:00",
          "timezone": "America/Denver"
        },
        "assignedTo": null,
        "nextDueAt": "2026-06-21T09:00:00-06:00",
        "createdAt": "2026-06-01T00:00:00-06:00",
        "updatedAt": "2026-06-01T00:00:00-06:00",
        "version": 0
      }
    ],
    "total": 1
  }
}
```

#### GET /api/items/:id

Get a single item by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "item": { /* item object */ },
    "completions": [ /* completion objects */ ],
    "nextDueAt": "2026-06-21T09:00:00-06:00"
  }
}
```

#### POST /api/items

Create a new item.

**Request Body:**
```json
{
  "listId": "list-456",
  "title": "Daily Scripture Reading",
  "description": "Read scriptures for 15 minutes",
  "type": "habit",
  "schedule": {
    "type": "daily",
    "time": "09:00",
    "timezone": "America/Denver"
  },
  "assignedTo": null
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "item": { /* created item object */ },
    "nextDueAt": "2026-06-21T09:00:00-06:00"
  }
}
```

#### PUT /api/items/:id

Update an existing item.

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "schedule": { /* updated schedule */ },
  "version": 0
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "item": { /* updated item object */ },
    "nextDueAt": "2026-06-21T09:00:00-06:00"
  }
}
```

#### DELETE /api/items/:id

Delete an item (soft delete).

**Response:**
```json
{
  "success": true,
  "data": {
    "itemId": "item-123"
  }
}
```

#### POST /api/items/:id/complete

Mark an item as complete.

**Request Body:**
```json
{
  "completedAt": "2026-06-20T15:30:00-06:00"  // Optional, defaults to now
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "completion": {
      "id": "comp-789",
      "itemId": "item-123",
      "userId": "user-456",
      "completedAt": "2026-06-20T15:30:00-06:00",
      "scheduledFor": "2026-06-20T09:00:00-06:00",
      "undone": false
    },
    "nextDueAt": "2026-06-21T09:00:00-06:00"
  }
}
```

#### POST /api/items/:id/undo

Undo the last completion for an item.

**Request Body:**
```json
{
  "completionId": "comp-789"  // Optional, defaults to last completion
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "completion": {
      "id": "comp-789",
      "itemId": "item-123",
      "userId": "user-456",
      "completedAt": "2026-06-20T15:30:00-06:00",
      "scheduledFor": "2026-06-20T09:00:00-06:00",
      "undone": true,
      "undoneAt": "2026-06-20T16:00:00-06:00",
      "undoneBy": "user-456"
    },
    "nextDueAt": "2026-06-20T09:00:00-06:00"
  }
}
```

### Lists

#### GET /api/lists

Get all lists accessible to the user.

**Query Parameters:**
- `type` (string, optional): Filter by type (personal/shared)

**Response:**
```json
{
  "success": true,
  "data": {
    "lists": [
      {
        "id": "list-456",
        "name": "My Daily Habits",
        "type": "personal",
        "ownerId": "user-123",
        "createdAt": "2026-06-01T00:00:00-06:00",
        "updatedAt": "2026-06-01T00:00:00-06:00",
        "version": 0
      }
    ],
    "members": {
      "list-456": [
        {
          "id": "member-789",
          "listId": "list-456",
          "userId": "user-123",
          "permission": "admin",
          "joinedAt": "2026-06-01T00:00:00-06:00"
        }
      ]
    }
  }
}
```

#### GET /api/lists/:id

Get a single list by ID with items.

**Response:**
```json
{
  "success": true,
  "data": {
    "list": { /* list object */ },
    "items": [ /* item objects */ ],
    "members": [ /* member objects */ ]
  }
}
```

#### POST /api/lists

Create a new list.

**Request Body:**
```json
{
  "name": "My Daily Habits",
  "type": "personal"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "list": { /* created list object */ }
  }
}
```

#### PUT /api/lists/:id

Update a list.

**Request Body:**
```json
{
  "name": "Updated List Name",
  "version": 0
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "list": { /* updated list object */ }
  }
}
```

#### DELETE /api/lists/:id

Delete a list.

**Response:**
```json
{
  "success": true,
  "data": {
    "listId": "list-456"
  }
}
```

### List Members

#### POST /api/lists/:id/members

Add a member to a shared list.

**Request Body:**
```json
{
  "userId": "user-789",
  "permission": "edit"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "member": {
      "id": "member-101",
      "listId": "list-456",
      "userId": "user-789",
      "permission": "edit",
      "joinedAt": "2026-06-20T00:00:00-06:00"
    }
  }
}
```

#### PUT /api/lists/:id/members/:userId

Update member permissions.

**Request Body:**
```json
{
  "permission": "admin"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "member": { /* updated member object */ }
  }
}
```

#### DELETE /api/lists/:id/members/:userId

Remove a member from a list.

**Response:**
```json
{
  "success": true,
  "data": {
    "memberId": "member-101"
  }
}
```

### Completions

#### GET /api/completions

Get completions with optional filtering.

**Query Parameters:**
- `itemId` (string, optional): Filter by item ID
- `userId` (string, optional): Filter by user ID
- `undone` (boolean, optional): Include/exclude undone completions
- `limit` (number, optional): Maximum results
- `offset` (number, optional): Pagination offset

**Response:**
```json
{
  "success": true,
  "data": {
    "completions": [ /* completion objects */ ],
    "total": 10
  }
}
```

#### GET /api/completions/:id

Get a single completion by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "completion": { /* completion object */ }
  }
}
```

### Users

#### GET /api/users/me

Get current user information.

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "name": "John Doe",
      "email": "john@example.com",
      "apiKey": "api-key-456",
      "createdAt": "2026-06-01T00:00:00-06:00",
      "updatedAt": "2026-06-01T00:00:00-06:00"
    }
  }
}
```

#### POST /api/users

Create a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure-password"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { /* created user object */ },
    "apiKey": "generated-api-key"
  }
}
```

#### PUT /api/users/me

Update current user.

**Request Body:**
```json
{
  "name": "Updated Name"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { /* updated user object */ }
  }
}
```

### Search

#### GET /api/search

Search items by title, description, or tags.

**Query Parameters:**
- `q` (string, required): Search query
- `listId` (string, optional): Filter by list ID
- `limit` (number, optional): Maximum results

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [ /* matching item objects */ ],
    "total": 5
  }
}
```

### Audit Log

#### GET /api/audit-log

Get audit log entries.

**Query Parameters:**
- `entityType` (string, optional): Filter by entity type
- `entityId` (string, optional): Filter by entity ID
- `action` (string, optional): Filter by action
- `limit` (number, optional): Maximum results
- `offset` (number, optional): Pagination offset

**Response:**
```json
{
  "success": true,
  "data": {
    "entries": [
      {
        "id": "audit-123",
        "entityType": "item",
        "entityId": "item-456",
        "action": "complete",
        "userId": "user-789",
        "changes": {},
        "createdAt": "2026-06-20T15:30:00-06:00"
      }
    ],
    "total": 100
  }
}
```

## WebSocket

Connect to WebSocket for real-time updates:

```
ws://localhost:8080/ws
```

### Authentication

Include API key in query string:

```
ws://localhost:8080/ws?apiKey=YOUR_API_KEY
```

### Events

#### item_created

```json
{
  "type": "item_created",
  "data": {
    "item": { /* item object */ },
    "listId": "list-456"
  },
  "timestamp": "2026-06-20T15:30:00-06:00"
}
```

#### item_updated

```json
{
  "type": "item_updated",
  "data": {
    "item": { /* item object */ },
    "listId": "list-456"
  },
  "timestamp": "2026-06-20T15:30:00-06:00"
}
```

#### item_deleted

```json
{
  "type": "item_deleted",
  "data": {
    "itemId": "item-123",
    "listId": "list-456"
  },
  "timestamp": "2026-06-20T15:30:00-06:00"
}
```

#### item_completed

```json
{
  "type": "item_completed",
  "data": {
    "completion": { /* completion object */ },
    "item": { /* item object */ },
    "nextDueAt": "2026-06-21T09:00:00-06:00"
  },
  "timestamp": "2026-06-20T15:30:00-06:00"
}
```

#### completion_undone

```json
{
  "type": "completion_undone",
  "data": {
    "completion": { /* completion object */ },
    "item": { /* item object */ },
    "nextDueAt": "2026-06-20T09:00:00-06:00"
  },
  "timestamp": "2026-06-20T15:30:00-06:00"
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | Invalid or missing authentication |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `VALIDATION_ERROR` | Invalid input data |
| `CONFLICT` | Version conflict (optimistic concurrency) |
| `INTERNAL_ERROR` | Server error |

## Rate Limiting

API requests are rate limited to prevent abuse:
- 100 requests per minute per API key
- 1000 requests per hour per API key

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1624567890
```

## Pagination

List endpoints support pagination via `limit` and `offset` parameters. Pagination metadata is included in responses:

```json
{
  "success": true,
  "data": {
    "items": [],
    "total": 150,
    "limit": 50,
    "offset": 0
  }
}
```
