# Tasks Todo App

Tasks Todo App is a Home Assistant add-on that bundles:

- A REST API for users, lists, items, and completions
- An optional HTTP MCP server for AI-driven automation
- A frontend served from the add-on web UI

The active codebase lives in [`tasks_todo_app/`](/Users/alexanderlynn/Desktop/tasks/tasks_todo_app). Older duplicate root-level app folders were removed so local development stays aligned with the packaged Home Assistant add-on, while preserving the add-on repository layout that Home Assistant is already using successfully.

## Current Repo Layout

```text
tasks/
├── docs/             # Project documentation
└── tasks_todo_app/   # Home Assistant add-on
```

## Local Development

Requirements:

- Node.js 24+
- Docker for containerized local runs

Build the same container Home Assistant uses:

```bash
docker build -f tasks_todo_app/Dockerfile -t tasks-todo-app ./tasks_todo_app
```

If you want to run it locally with the same packaging model, provide a Home Assistant-style `/data/options.json` and run the built image with ports for:

- `8080` for the REST API
- `3000` for MCP
- `8237` for the Home Assistant add-on web UI

## Home Assistant

The Home Assistant install path is intentionally minimal now: add this repository as a git-based custom add-on repository, install the `Tasks Todo App` add-on, then configure the API key and optional MCP settings. The detailed current notes are in [`docs/home-assistant.md`](/Users/alexanderlynn/Desktop/tasks/docs/home-assistant.md).

## Docs

- [`docs/home-assistant.md`](/Users/alexanderlynn/Desktop/tasks/docs/home-assistant.md): current Home Assistant install and runtime notes
- [`docs/api.md`](/Users/alexanderlynn/Desktop/tasks/docs/api.md): REST API overview
- [`docs/mcp-server.md`](/Users/alexanderlynn/Desktop/tasks/docs/mcp-server.md): MCP server overview and tool list
- [`docs/data-models.md`](/Users/alexanderlynn/Desktop/tasks/docs/data-models.md): shared entities and schedule shape
- [`docs/phases.md`](/Users/alexanderlynn/Desktop/tasks/docs/phases.md): original phased build plan
