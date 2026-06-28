# REST API

The backend API is mounted at `/api` by [`tasks_todo_app/backend/src/index.ts`](/Users/alexanderlynn/Desktop/tasks/tasks_todo_app/backend/src/index.ts).

Typical local base URL:

```text
http://localhost:8080/api
```

## Authentication

Most routes require an API key in the `Authorization` header:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  http://localhost:8080/api/items
```

## Response Shape

Handlers return a shared success/error envelope:

```ts
{
  success: boolean;
  data?: unknown;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}
```

## Route Groups

### Users

Implemented in [`tasks_todo_app/backend/src/api/users.ts`](/Users/alexanderlynn/Desktop/tasks/tasks_todo_app/backend/src/api/users.ts).

- `POST /users`
- `POST /users/login`
- `GET /users/me`
- `GET /users/me/api-key`

### Lists

Implemented in [`tasks_todo_app/backend/src/api/lists.ts`](/Users/alexanderlynn/Desktop/tasks/tasks_todo_app/backend/src/api/lists.ts).

- `GET /lists`
- `GET /lists/:id`
- `POST /lists`
- `PUT /lists/:id`
- `DELETE /lists/:id`
- `POST /lists/:id/members`
- `PUT /lists/:id/members/:userId`
- `DELETE /lists/:id/members/:userId`

### Items

Implemented in [`tasks_todo_app/backend/src/api/items.ts`](/Users/alexanderlynn/Desktop/tasks/tasks_todo_app/backend/src/api/items.ts).

- `GET /items`
- `GET /items/:id`
- `POST /items`
- `PUT /items/:id`
- `DELETE /items/:id`
- `POST /items/:id/complete`
- `POST /items/:id/undo`

## Health Check

The non-authenticated health endpoint is:

```text
GET /health
```

## Validation Source

Input contracts are defined in [`tasks_todo_app/backend/src/shared/schemas/index.ts`](/Users/alexanderlynn/Desktop/tasks/tasks_todo_app/backend/src/shared/schemas/index.ts). If API behavior changes, that file is the right place to confirm the accepted payload shape.
