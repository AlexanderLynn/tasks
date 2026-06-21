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
