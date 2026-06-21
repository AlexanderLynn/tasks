# Habit & Chore Tracker

A lightweight, AI-ready habit and chore tracker with PWA support, MCP server integration, and Home Assistant compatibility.

## Overview

This application is designed from the ground up to be:
- **PWA-first**: Works on iOS, Android, and tablets as a Progressive Web App
- **AI-ready**: Full MCP server integration for AI agents to drive the application
- **Home Assistant compatible**: Can run as a headless addon with full HA integration
- **Family-focused**: Personal and shared lists with flexible sharing options
- **Grouping support**: Tag-based grouping for organization (by room, category, etc.)
- **Offline-capable**: Basic offline support for adding and completing tasks
- **Kibana-inspired UI**: Dark theme with TickTick-inspired swipe interactions

## Key Features

- **Flexible Sharing**: Share entire lists or individual items with other users for accountability
- **Tag-Based Grouping**: Organize habits, chores, and tasks by room, category, or any custom tag
- **Simple Scheduling**: Daily, weekly, monthly recurrence with next due date calculation
- **History Tracking**: Complete audit log for undo/redo support
- **AI Integration**: Full MCP server for AI agents to manage items
- **Home Assistant Ready**: Run as addon with sensors and service calls

## Tech Stack

### Backend
- **Node.js + Express** - API server
- **SQLite** - Local database (easy for Home Assistant addon)
- **TypeScript** - Shared types across backend, MCP, and frontend
- **Zod** - Validation schemas (shared across all components)

### Frontend (PWA)
- **React + Vite** - Modern PWA framework
- **Custom Kibana-styled components** - Dark theme with Elastic's color palette
- **TickTick-inspired interactions** - Swipe gestures and quick actions
- **Workbox** - PWA offline support
- **TailwindCSS** - Utility styling

### Integration
- **MCP Server** - Built-in Model Context Protocol server for AI integration
- **Home Assistant** - Addon support with sensors and service calls
- **WebSocket** - Real-time updates

## Architecture

### Server-First Design
All business logic and validation runs on the server. This ensures:
- Headless operation for Home Assistant
- Consistent validation across all clients
- AI agents work with same logic as UI
- No client-side business logic to maintain

### Data Flow
```
User/AI Action → API/MCP → Server Validation → Database Update
                                    ↓
                            WebSocket Push → All Clients
                                    ↓
                            Audit Log → History/Undo Support
```

## Key Features

### Personal & Shared Lists
- **Personal Lists**: Owned by single user, private
- **Shared Lists**: Household lists with role-based permissions (view/edit/admin)
- **Permissions**: Fine-grained control over who can view/edit items

### Item Types
- **Habits**: Personal recurring patterns (daily scriptures, exercise)
- **Chores**: Household responsibilities (trash, cleaning) with assignment
- **Tasks**: One-time or irregular items

### Scheduling
- Simple: Daily, weekly, monthly
- Advanced: Custom intervals, multiple days, time-based
- Gmail/Apple Reminders-style recurrence rules
- Next due date pre-calculated server-side

### History & Undo
- Complete audit log of all actions
- Undo support for completions
- Version tracking for optimistic concurrency
- Activity feed for accountability

### AI Integration
- Full MCP server with tools for all operations
- AI can create, update, complete, and query items
- Respects permission model
- Real-time event streaming

### Home Assistant Integration
- REST API for all operations
- MCP server for AI agents
- WebSocket for real-time updates
- Sensor entities for dashboard
- Service calls for automations
- Headless mode support

## Documentation

- [Data Models](./docs/data-models.md) - Complete database schema
- [MCP Server](./docs/mcp-server.md) - MCP tools and AI integration
- [Home Assistant](./docs/home-assistant.md) - HA addon and integration
- [API Reference](./docs/api.md) - REST API documentation
- [MVP Scope](./docs/mvp.md) - MVP features and implementation plan

## Running the Backend

### Prerequisites
- Node.js v24 LTS or later
- npm (comes with Node.js)

### Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The backend server will start on port 8080 by default. You can configure this using the `PORT` environment variable:

```bash
PORT=3000 npm run dev
```

### Environment Variables

- `PORT` - Server port (default: 8080)
- `DATABASE_PATH` - Path to SQLite database file (default: `./data/habits.db`)
- `MCP_ENABLED` - Enable MCP server (default: true)
- `MCP_PORT` - MCP server port (default: 8081)

### Testing the API

Once the server is running, you can test the API endpoints:

```bash
# Health check
curl http://localhost:8080/health

# Create a user
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Sign in (returns apiKey for API/MCP use)
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get lists (requires API key from signup or login)
curl http://localhost:8080/api/lists \
  -H "Authorization: Bearer YOUR_API_KEY"
```

See [API Reference](./docs/api.md) for complete API documentation.

### Running the MCP Server

The MCP server uses stdio transport for communication with AI agents. To run it standalone:

```bash
cd backend
npm run mcp
```

The MCP server will start and listen for JSON-RPC messages via stdin/stdout. It includes tools for:
- `list_items` - List items with filtering
- `get_item` - Get a single item
- `create_item` - Create a new item
- `update_item` - Update an existing item
- `complete_item` - Mark an item as complete
- `undo_completion` - Undo a completion
- `list_lists` - List all lists
- `create_list` - Create a new list

See [MCP Server Documentation](./docs/mcp-server.md) for detailed tool specifications.

## Home Assistant Setup

### Quick Start

1. **Add the addon repository** to Home Assistant (when published)
2. **Install the addon** from the Home Assistant Add-on Store
3. **Configure the addon** with your preferences:
   ```yaml
   database_path: /data/habits.db
   api_port: 8080
   mcp_enabled: true
   mcp_port: 8081
   ha_integration_enabled: true
   timezone: America/Denver
   log_level: info
   ```
4. **Start the addon**
5. **Access the API** at `http://homeassistant.local:8080/api`
6. **Add sensors** to your Lovelace dashboard:
   ```yaml
   sensor:
     - platform: habit_tracker
       type: next_due
       name: "Next Due Item"
   ```

### Manual Installation

For development or custom installation:

```bash
# Clone the repository
git clone https://github.com/yourusername/habit-tracker.git
cd habit-tracker

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Start backend
cd ../backend
npm run dev

# Start frontend (in another terminal)
cd frontend
npm run dev
```

### Home Assistant Integration Points

- **REST API**: All CRUD operations at `http://homeassistant.local:8080/api`
- **MCP Server**: AI agent integration at `mcp://homeassistant.local:8081`
- **WebSocket**: Real-time updates at `ws://homeassistant.local:8080/ws`
- **Sensors**: Next due item, streak tracking, completion rate
- **Services**: Complete items, create items, undo completions

See [Home Assistant Documentation](./docs/home-assistant.md) for detailed setup instructions.

## Project Structure

```
/
├── backend/           # Node.js + Express server
│   ├── src/
│   │   ├── api/       # REST endpoints
│   │   ├── mcp/       # MCP server
│   │   ├── db/        # Database layer
│   │   ├── services/  # Business logic
│   │   └── types/     # Shared TypeScript types
│   └── package.json
├── frontend/          # React PWA
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/  # API client
│   │   └── types/     # Shared TypeScript types
│   └── package.json
├── shared/            # Shared code
│   ├── types/         # TypeScript types
│   └── schemas/       # Zod validation schemas
├── addon/             # Home Assistant addon
│   ├── config/
│   ├── docker/
│   └── rootfs/
└── docs/              # Documentation
```

## Getting Started

See individual documentation files for detailed setup instructions.

## License

MIT
