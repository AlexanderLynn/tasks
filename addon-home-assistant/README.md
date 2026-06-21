# Tasks Todo App - Home Assistant Addon

A comprehensive scheduling and task management application for Home Assistant with MCP server integration.

## Installation

### Option 1: Via Home Assistant UI (Recommended)

1. Open Home Assistant
2. Go to **Settings → Devices & Services → Home Assistant Community Store (HACS)**
3. Click **Explore & Download Repositories**
4. Search for "Tasks Todo App"
5. Click **Download**
6. Restart Home Assistant
7. Go to **Settings → Devices & Services → Addons**
8. Install "Tasks Todo App"

### Option 2: Manual Installation

1. Copy the addon folder to your Home Assistant instance:
   ```bash
   scp -r ./addon-home-assistant/ user@homeassistant.local:/usr/share/hassio/addons/
   ```

2. In Home Assistant UI:
   - Go to **Settings → Devices & Services → Addons**
   - Click **Create Addon** (three dots menu)
   - Select "Tasks Todo App"
   - Install

## Configuration

Once installed, configure the addon:

1. Go to **Settings → Devices & Services → Addons**
2. Click **Tasks Todo App**
3. Go to **Configuration** tab
4. Set:
   - **API Key**: A secure key for authentication (change from default!)
   - **Timezone**: Your IANA timezone (e.g., `America/New_York`)
   - **Enable MCP Server**: Toggle if using with Claude Desktop
   - **Log Level**: Debug/Info/Warn/Error

5. Click **Save**
6. Click **Start** to start the addon

## Features

- **Sensor Entities**: Auto-discovered lists, items counts, and sync status
- **Service Calls**: Create items, mark complete, create lists
- **Web Interface**: Access via Home Assistant Ingress (embedded UI)
- **API Access**: Direct HTTP REST API on port 8080
- **MCP Server**: Integration with Claude Desktop (optional)

## Access

- **Web Interface**: Home Assistant → Addons → Tasks Todo App → Open Web UI
- **Direct API**: `http://homeassistant.local:8080` (internal)
- **Websocket**: `ws://homeassistant.local:8080/ws` (for real-time updates)

## Troubleshooting

### Addon won't start
- Check logs: **Settings → Devices & Services → Addons → Tasks Todo App → Logs**
- Ensure API key is set in Configuration
- Check disk space in Home Assistant

### Sensors not showing up
- Integration must be installed in Home Assistant (see below)
- Check integration is enabled: **Settings → Devices & Services → Integrations**
- Restart Home Assistant if needed

### Database errors
- Check `/data/tasks.db` permissions
- Clear cache and restart addon

## Related Integration

This addon requires the **Tasks Todo App Integration** to be installed separately for sensors and services to work in Home Assistant. See [integration instructions](../home-assistant-integration/README.md).
