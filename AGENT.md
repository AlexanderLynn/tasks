# Development Rules

## Backend API and MCP Server Synchronization

**CRITICAL**: When adding new endpoints or functionality to the backend API, you MUST also add corresponding tools to the MCP server.

### Requirements:

1. **API Endpoints → MCP Tools**: Every new REST API endpoint must have a corresponding MCP tool
   - The MCP tool should provide the same functionality as the API endpoint
   - Tool names should follow the pattern: `{action}_{resource}` (e.g., `create_item`, `list_items`)
   - Tool descriptions must be clear and accurate

2. **Tool Definitions**: Keep MCP tool definitions up to date
   - Input schemas must match the API endpoint parameters
   - Descriptions must match the API documentation
   - Required fields must be consistent between API and MCP

3. **Documentation Updates**: When adding functionality, update:
   - API documentation (`docs/api.md`)
   - MCP server documentation (`docs/mcp-server.md`)
   - Data models if applicable (`docs/data-models.md`)

4. **Testing**: Test both the API endpoint and the corresponding MCP tool
   - API endpoint should work via REST
   - MCP tool should work via HTTP POST to `/mcp` endpoint
   - Both should return consistent data structures

### Examples:

- **API**: `POST /api/items` → **MCP Tool**: `create_item`
- **API**: `GET /api/items` → **MCP Tool**: `list_items`
- **API**: `GET /api/items/:id` → **MCP Tool**: `get_item`

### Verification:

Before considering a feature complete, verify:
- [ ] API endpoint exists and works
- [ ] MCP tool exists and works
- [ ] Tool schema matches API parameters
- [ ] Documentation is updated for both
- [ ] Both are tested successfully

## Versioning and Release Process

When making bug fixes or changes that need to be deployed to Home Assistant, you MUST update version numbers and create releases for both repositories.

### Home Assistant Add-on (tasks/tasks_todo_app)

**Files to update:**
- `config.yaml` - Update `version` field

**Release process:**
```bash
cd tasks/tasks_todo_app
git add config.yaml
git commit -m "Bump version to X.Y.Z"
git push
git tag vX.Y.Z
git push origin vX.Y.Z
```

Home Assistant Add-on Store detects new versions via git tags on the repository.

### HACS Integration (tasks-integration)

**Files to update:**
- `custom_components/tasks_todo_app/manifest.json` - Update `version` field
- `hacs.json` - Update `version` field

**Release process:**
```bash
cd tasks-integration
git add custom_components/tasks_todo_app/manifest.json hacs.json
git commit -m "Bump version to X.Y.Z"
git push
git tag vX.Y.Z
git push origin vX.Y.Z
```

HACS detects new versions via git tags on the repository.

### After Publishing

**For Home Assistant Add-on:**
1. Go to Settings → Add-ons → Store
2. Find "Tasks Todo App" and click "Update" (if available)
3. Or restart Home Assistant to refresh the add-on store

**For HACS Integration:**
1. Go to Settings → Devices & Services → HACS
2. Three dots → "Check for updates"
3. Find "Tasks Todo App" and click "Update"
4. Or restart Home Assistant

### Version Bumping Guidelines

- **Patch version (X.Y.Z+1)**: Bug fixes, minor changes
- **Minor version (X.Y+1.0)**: New features, backward compatible changes
- **Major version (X+1.0.0)**: Breaking changes

Always keep version numbers in sync between the add-on and integration when they depend on each other.
