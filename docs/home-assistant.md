# Home Assistant

This repo now assumes a git-based Home Assistant add-on install flow. Older copy-and-paste and file-manager installation guides were removed because they were redundant and had drifted away from the current repo layout.

The add-on code stays under `tasks_todo_app/` so the existing repository layout used by Home Assistant remains intact.

## Active Add-on

The add-on is the [`tasks_todo_app/`](/Users/alexanderlynn/Desktop/tasks/tasks_todo_app) directory.

Relevant files:

- [`tasks_todo_app/config.yaml`](/Users/alexanderlynn/Desktop/tasks/tasks_todo_app/config.yaml): add-on metadata and options
- [`tasks_todo_app/Dockerfile`](/Users/alexanderlynn/Desktop/tasks/tasks_todo_app/Dockerfile): container build
- [`tasks_todo_app/run.sh`](/Users/alexanderlynn/Desktop/tasks/tasks_todo_app/run.sh): runtime entrypoint

## Install

1. In Home Assistant, open `Settings -> Add-ons -> Add-on Store`.
2. Add this repository as a custom repository:
   `https://github.com/AlexanderLynn/tasks`
3. Refresh the store and install `Tasks Todo App`.
4. Configure the add-on options.
5. Start the add-on and open the web UI if needed.

## Add-on Options

Current user-facing options come from [`tasks_todo_app/config.yaml`](/Users/alexanderlynn/Desktop/tasks/tasks_todo_app/config.yaml):

- `api_key`
- `timezone`
- `enable_mcp_server`
- `mcp_port`
- `log_level`

The add-on currently exposes:

- `8080/tcp` for the REST API
- `3000/tcp` for MCP HTTP
- `8237/tcp` for the frontend web UI

## Notes

- `api_key` should be changed from the default before real use.
- `enable_mcp_server` controls whether the HTTP MCP service is launched alongside the API.
- The add-on maps Home Assistant `config` and `share` storage.

## Development Context

`tasks_todo_app/` is now the only live application code. Local development should target that same packaged layout so behavior stays as close to HAOS as possible.
