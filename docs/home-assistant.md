# Home Assistant Integration

Complete guide for running the Habit & Chore Tracker as a Home Assistant addon with full integration.

## Overview

The Habit & Chore Tracker is designed from the ground up to run as a Home Assistant addon with:
- Headless operation (no UI required)
- Full REST API access
- MCP server for AI agents
- WebSocket for real-time updates
- Sensor entities for dashboard
- Service calls for automations
- SQLite database (easy addon deployment)

## Addon Structure

```
/addon
├── config/
│   └── options.json          # Addon configuration schema
├── docker/
│   └── Dockerfile            # Container definition
├── rootfs/
│   └── etc/
│       └── hass.conf         # Home Assistant integration config
├── scripts/
│   └── run.sh                # Entry point script
├── build.json                # Build configuration
└── config.json               # Addon metadata
```

## Configuration

### Addon Options (options.json)

```json
{
  "name": "Habit & Chore Tracker",
  "version": "1.0.0",
  "slug": "habit-tracker",
  "description": "Track habits and chores with AI integration",
  "arch": ["armv7", "aarch64", "amd64", "i386"],
  "ports": {
    "8080/tcp": 8080
  },
  "map": [
    "share:rw",
    "config:rw"
  ],
  "options": {
    "database_path": "/data/habits.db",
    "api_port": 8080,
    "mcp_enabled": true,
    "mcp_port": 8081,
    "ha_integration_enabled": true,
    "timezone": "America/Denver",
    "log_level": "info"
  },
  "schema": {
    "database_path": "str",
    "api_port": "int",
    "mcp_enabled": "bool",
    "mcp_port": "int",
    "ha_integration_enabled": "bool",
    "timezone": "str",
    "log_level": "list(info|debug|error)"
  }
}
```

### Addon Metadata (config.json)

```json
{
  "name": "Habit & Chore Tracker",
  "description": "Track habits and chores with AI integration",
  "version": "1.0.0",
  "slug": "habit-tracker",
  "init": false,
  "arch": ["armv7", "aarch64", "amd64", "i386"],
  "ports": {
    "8080/tcp": 8080,
    "8081/tcp": 8081
  },
  "map": [
    "share:rw",
    "config:rw"
  ],
  "options": {
    "database_path": "/data/habits.db",
    "api_port": 8080,
    "mcp_enabled": true,
    "mcp_port": 8081,
    "ha_integration_enabled": true,
    "timezone": "America/Denver",
    "log_level": "info"
  },
  "schema": {
    "database_path": "str",
    "api_port": "int",
    "mcp_enabled": "bool",
    "mcp_port": "int",
    "ha_integration_enabled": "bool",
    "timezone": "str",
    "log_level": "list(info|debug|error)"
  }
}
```

## Dockerfile

```dockerfile
FROM node:20-alpine

# Install dependencies
RUN apk add --no-cache sqlite

# Create app directory
WORKDIR /app

# Copy backend files
COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/dist ./dist

# Create data directory
RUN mkdir -p /data

# Expose ports
EXPOSE 8080 8081

# Set environment variables
ENV NODE_ENV=production
ENV DATABASE_PATH=/data/habits.db

# Start the server
CMD ["node", "dist/index.js"]
```

## Run Script (run.sh)

```bash
#!/usr/bin/with-contenv bashio

# Get configuration options
DATABASE_PATH=$(bashio::config 'database_path')
API_PORT=$(bashio::config 'api_port')
MCP_ENABLED=$(bashio::config 'mcp_enabled')
MCP_PORT=$(bashio::config 'mcp_port')
HA_INTEGRATION_ENABLED=$(bashio::config 'ha_integration_enabled')
TIMEZONE=$(bashio::config 'timezone')
LOG_LEVEL=$(bashio::config 'log_level')

# Set environment variables
export DATABASE_PATH
export API_PORT
export MCP_ENABLED
export MCP_PORT
export HA_INTEGRATION_ENABLED
export TIMEZONE
export LOG_LEVEL

# Start the server
cd /app
exec node dist/index.js
```

## Home Assistant Integration

### Sensor Entities

The addon exposes sensor entities for dashboard display:

#### `sensor.habit_tracker_next_due`

Shows the next item due across all active items.

```yaml
sensor:
  - platform: habit_tracker
    type: next_due
    name: "Next Due Item"
```

**Attributes:**
- `item_id`: ID of the item
- `title`: Item title
- `due_at`: Due timestamp
- `type`: Item type (habit/chore/task)
- `list_name`: Name of the list

#### `sensor.habit_tracker_streak`

Shows current streak for a specific item.

```yaml
sensor:
  - platform: habit_tracker
    type: streak
    item_id: "item-123"
    name: "Daily Scripture Streak"
```

**Attributes:**
- `current_streak`: Current streak count
- `longest_streak`: Longest streak achieved
- `last_completed`: Last completion timestamp

#### `sensor.habit_tracker_completion_rate`

Shows daily completion rate for a list or all items.

```yaml
sensor:
  - platform: habit_tracker
    type: completion_rate
    list_id: "list-456"
    name: "Household Chores Completion Rate"
```

**Attributes:**
- `rate`: Completion rate (0-100)
- `completed`: Number completed
- `total`: Total due
- `date`: Date for the rate

### Service Calls

The addon exposes service calls for automations:

#### `habit_tracker.complete_item`

Complete an item.

```yaml
service: habit_tracker.complete_item
data:
  item_id: "item-123"
  completed_at: "2026-06-20T15:30:00-06:00"  # Optional
```

#### `habit_tracker.create_item`

Create a new item.

```yaml
service: habit_tracker.create_item
data:
  list_id: "list-456"
  title: "Take out trash"
  type: "chore"
  schedule:
    type: "weekly"
    days_of_week: [2]  # Tuesday
    time: "18:00"
    timezone: "America/Denver"
```

#### `habit_tracker.undo_completion`

Undo a completion.

```yaml
service: habit_tracker.undo_completion
data:
  item_id: "item-123"
```

### Lovelace UI Card

Custom Lovelace card for displaying habits and chores:

```yaml
type: custom:habit-tracker-card
entity: sensor.habit_tracker_next_due
list_id: "list-456"
show_completed: true
show_streaks: true
```

## REST API

All REST API endpoints are available within Home Assistant network:

```
http://homeassistant.local:8080/api
```

### Authentication

Use Home Assistant's Long-Lived Access Tokens:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://homeassistant.local:8080/api/items
```

## MCP Server

The MCP server runs on a separate port for AI agent integration:

```
mcp://homeassistant.local:8081
```

### Configuration

Enable MCP server in addon options:

```yaml
mcp_enabled: true
mcp_port: 8081
```

### AI Agent Configuration

Configure AI agents to connect to the MCP server:

```typescript
const mcpClient = new MCPClient({
  url: "mcp://homeassistant.local:8081",
  apiKey: "user-api-key"
});
```

## WebSocket

Real-time updates via WebSocket:

```javascript
const ws = new WebSocket('ws://homeassistant.local:8080/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Update:', data);
};
```

### Event Types

- `item_created`: New item created
- `item_updated`: Item updated
- `item_deleted`: Item deleted
- `item_completed`: Item completed
- `completion_undone`: Completion undone

## Automation Examples

### Notify When Chores Are Due

```yaml
automation:
  - alias: "Notify when trash is due"
    trigger:
      - platform: template
        value_template: >
          {{ state_attr('sensor.habit_tracker_next_due', 'title') == 'Take out trash' }}
    action:
      - service: notify.mobile_app_my_phone
        data:
          message: "Don't forget to take out the trash!"
```

### Complete Item When Motion Detected

```yaml
automation:
  - alias: "Mark chore complete when motion detected"
    trigger:
      - platform: state
        entity_id: binary_sensor.kitchen_motion
        to: "on"
    condition:
      - condition: template
        value_template: >
          {{ state_attr('sensor.habit_tracker_next_due', 'title') == 'Clean kitchen' }}
    action:
      - service: habit_tracker.complete_item
        data:
          item_id: "{{ state_attr('sensor.habit_tracker_next_due', 'item_id') }}"
```

### Daily Summary Notification

```yaml
automation:
  - alias: "Daily habit summary"
    trigger:
      - platform: time
        at: "20:00:00"
    action:
      - service: notify.mobile_app_my_phone
        data:
          message: >
            Today's progress:
            Completion rate: {{ states('sensor.habit_tracker_completion_rate') }}%
            Current streak: {{ state_attr('sensor.habit_tracker_streak', 'current_streak') }} days
```

## Headless Mode

The addon can run in headless mode without the PWA UI:

```yaml
ha_integration_enabled: true
```

In headless mode:
- Only API, MCP, and WebSocket are available
- No web UI is served
- Perfect for wall panels running Home Assistant dashboard
- All operations via Home Assistant services or API

## Database Backup

Database is stored at `/data/habits.db` and can be backed up via Home Assistant:

```yaml
automation:
  - alias: "Backup habit tracker database"
    trigger:
      - platform: time
        at: "02:00:00"
    action:
      - service: backup_manager.backup
        data:
          name: "habit-tracker"
          path: "/config/habits.db"
```

## Troubleshooting

### Logs

View addon logs in Home Assistant:

```
Settings -> Add-ons -> Habit & Chore Tracker -> Logs
```

### Database Location

Database is stored at `/data/habits.db` in the addon container.

### API Not Accessible

Check:
1. Addon is running
2. Port 8080 is not blocked
3. API port is correct in configuration
4. Authentication token is valid

### MCP Server Not Connecting

Check:
1. MCP is enabled in addon options
2. MCP port is correct (default 8081)
3. API key is valid
4. Network allows connection to MCP port

## Installation

1. Add the addon repository to Home Assistant
2. Install the "Habit & Chore Tracker" addon
3. Configure addon options
4. Start the addon
5. Access API at `http://homeassistant.local:8080/api`
6. Add sensors to Lovelace dashboard
7. Create automations as needed
