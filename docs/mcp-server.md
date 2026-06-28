# MCP Server

The repo includes an HTTP MCP server entry point in [`tasks_todo_app/backend/src/mcp-server.ts`](/Users/alexanderlynn/Desktop/tasks/tasks_todo_app/backend/src/mcp-server.ts).

When enabled, it serves:

- `POST /mcp` for MCP requests
- `GET /health` for a basic health check

The default local port is `3000`.

## Enablement

The main backend starts MCP only when `MCP_ENABLED=true` or `ENABLE_MCP_SERVER=true`. In the Home Assistant add-on, that behavior is surfaced as the `enable_mcp_server` option.

## Current Tool Surface

The HTTP MCP server currently advertises these tools:

- `list_items`
- `get_item`
- `create_item`
- `update_item`
- `complete_item`
- `undo_completion`
- `list_lists`
- `create_list`

Those definitions live directly in [`tasks_todo_app/backend/src/mcp-server.ts`](/Users/alexanderlynn/Desktop/tasks/tasks_todo_app/backend/src/mcp-server.ts).

## Relationship to the REST API

The project intention is that MCP mirrors backend capabilities closely. The API route handlers live under [`tasks_todo_app/backend/src/api/`](/Users/alexanderlynn/Desktop/tasks/tasks_todo_app/backend/src/api), and the MCP tool set is the AI-facing companion surface for those operations.

## Operational Note

This doc intentionally stays high-level. For exact payload shapes, the source of truth is the implementation in [`tasks_todo_app/backend/src/mcp-server.ts`](/Users/alexanderlynn/Desktop/tasks/tasks_todo_app/backend/src/mcp-server.ts), since earlier long-form MCP docs had become stale.
