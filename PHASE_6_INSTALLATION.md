# Phase 6: Home Assistant Integration - Installation Guide

## Overview

Phase 6 consists of two components that work together:

1. **Tasks Todo App Addon** - Container service that runs alongside Home Assistant
2. **Tasks Todo App Integration** - Python-based integration for Home Assistant

Both are required for full functionality. The addon provides the backend API, and the integration provides sensors, automations, and service calls.

---

## Prerequisites

- Home Assistant instance (2025.1.0 or later)
- SSH or terminal access to Home Assistant
- Network connectivity between Home Assistant and the addon
- Basic understanding of Home Assistant configuration

---

## Part 1: Install the Addon

### Step 1: Copy addon files to Home Assistant

If you're running Home Assistant Supervised or OS:

```bash
# SSH into your Home Assistant instance
ssh user@homeassistant.local

# Create the addons directory if it doesn't exist
mkdir -p /usr/share/hassio/addons

# Copy the addon folder
# (If copying from your development machine)
scp -r /path/to/addon-home-assistant user@homeassistant.local:/usr/share/hassio/addons/tasks_todo_app
```

Or copy manually via SMB/NFS share:
```
\\homeassistant\config\addons
(Windows) or /mnt/data/addons (Linux)
```

### Step 2: Add custom addon repository (if not local)

1. Open **Home Assistant Web UI**
2. Go to **Settings → Add-ons**
3. Click the **three dots** menu (⋮)
4. Select **Repositories**
5. Add repository URL: `https://github.com/tasks/tasks/addons`
6. Click **Create**

### Step 3: Install the addon via UI

1. Go to **Settings → Add-ons & Services**
2. Click **Add-ons** tab
3. Search for **"Tasks Todo App"**
4. Click on the addon
5. Click **Install**
6. Wait for installation to complete (2-3 minutes)

### Step 4: Configure the addon

1. Click **Tasks Todo App** in the Add-ons list
2. Click **Configuration** tab
3. Configure the following:

```yaml
api_key: "your-secret-api-key-here"  # CHANGE THIS!
timezone: "America/New_York"           # Use your IANA timezone
enable_mcp_server: false               # Set to true if using Claude Desktop
log_level: "info"
```

4. Click **Save**

### Step 5: Start the addon

1. Click **Tasks Todo App** addon
2. Click **Start** button
3. Monitor **Logs** tab to ensure it starts successfully

Expected log output:
```
[INFO] Starting Tasks Todo App API Server...
API Key: your-sec...
Timezone: America/New_York
MCP Server Enabled: false
Log Level: info
[INFO] Database initialized successfully
[INFO] API server listening on 0.0.0.0:8080
```

### Step 6: Verify addon is running

Test the API health endpoint:

```bash
# From Home Assistant host
curl http://localhost:8080/api/health

# Expected response:
{"status":"ok","timestamp":"2026-06-21T10:00:00Z"}
```

---

## Part 2: Install the Integration

### Step 1: Copy integration files to Home Assistant

```bash
# SSH into Home Assistant
ssh user@homeassistant.local

# Create custom_components directory if needed
mkdir -p /config/custom_components/tasks_todo_app

# Copy integration files
# From development machine:
scp -r /path/to/home-assistant-integration/* \
  user@homeassistant.local:/config/custom_components/tasks_todo_app/

# Or via SMB share:
# Copy files to: \\homeassistant\config\custom_components\tasks_todo_app
```

### Step 2: Restart Home Assistant

1. Go to **Settings → System**
2. Click **Restart Home Assistant** (bottom right)
3. Wait for restart to complete (~2 minutes)

### Step 3: Add the integration

1. Go to **Settings → Devices & Services**
2. Click **Create Integration**
3. Search for **"Tasks Todo App"**
4. Click on the integration

You should see a configuration form:

```
Host: localhost
Port: 8080
API Key: your-secret-api-key-here
```

Fill in:
- **Host**: `localhost` (or addon container hostname if running different machine)
- **Port**: `8080`
- **API Key**: The same key you set in addon configuration (Step 4 above)

4. Click **Create**

### Step 4: Verify integration loaded

You should see:
```
Tasks Todo App
Successfully configured
```

If you get **"Failed to connect"** error:
- Verify addon is running (see Part 1, Step 5)
- Check API key matches addon configuration
- Verify port 8080 is accessible

### Step 5: Configure integration options

1. Go to **Settings → Devices & Services → Integrations**
2. Click **Tasks Todo App**
3. Click **Options** (gear icon)
4. Configure:
   - **Poll Interval**: 30 (seconds) - how often to check for updates
   - **Enable Sync**: Toggle on - enable background sync

5. Click **Save**

---

## Part 3: Verify Installation

### Check sensors appear

Go to **Developer Tools → States** and search for `sensor.tasks`:

Expected entities:
- `sensor.tasks_shopping_active_items` - Count of active items
- `sensor.tasks_shopping_completion_percent` - Completion %
- `sensor.tasks_overdue_items_total` - Overdue count
- `sensor.tasks_sync_status` - Sync status (synced/offline)

### Test a service call

Go to **Developer Tools → Services**:

1. Select service domain: **tasks_todo_app**
2. Select service: **create_item**
3. Fill in service data:

```json
{
  "list_id": "your-list-id",
  "title": "Test item from Home Assistant",
  "description": "This was created via a service call",
  "tags": ["test"]
}
```

4. Click **Call Service**
5. Check the frontend app - the item should appear

---

## Usage Examples

### Automation: Create item on button press

```yaml
# automations.yaml
- alias: "Create shopping item"
  trigger:
    platform: state
    entity_id: input_button.new_shopping_item
    to: "on"
  action:
    service: tasks_todo_app.create_item
    data:
      list_id: "shopping-list-id"
      title: "New item"
      tags: ["urgent"]
```

### Automation: Complete item at specific time

```yaml
- alias: "Daily morning checklist reminder"
  trigger:
    platform: time
    at: "08:00:00"
  action:
    service: tasks_todo_app.create_item
    data:
      list_id: "daily-checklist-id"
      title: "Morning routine"
      tags: ["daily"]
```

### Automation: Notify when overdue items exist

```yaml
- alias: "Overdue items notification"
  trigger:
    platform: state
    entity_id: sensor.tasks_overdue_items_total
  condition:
    condition: template
    value_template: "{{ states('sensor.tasks_overdue_items_total') | int > 0 }}"
  action:
    service: notify.mobile_app_phone
    data:
      title: "Tasks"
      message: "You have {{ states('sensor.tasks_overdue_items_total') }} overdue items"
```

### Script: Create item with schedule

```yaml
# scripts.yaml
create_scheduled_item:
  description: "Create an item with schedule"
  fields:
    list_id:
      description: "List ID"
    title:
      description: "Item title"
    schedule:
      description: "Schedule type (once, daily, weekly, monthly)"
  sequence:
    - service: tasks_todo_app.create_item
      data:
        list_id: "{{ list_id }}"
        title: "{{ title }}"
        schedule:
          type: "{{ schedule }}"
```

---

## Troubleshooting

### Addon won't start

1. Check logs:
   ```bash
   # SSH into Home Assistant
   journalctl -u hassio-tasks_todo_app.service -n 50
   ```

2. Common issues:
   - **"Database error"**: Check `/data/tasks.db` permissions
   - **"Port already in use"**: Another service using port 8080
   - **"Module not found"**: npm dependencies not installed

3. Solution:
   ```bash
   # SSH into addon container
   docker exec -it addon_tasks_todo_app sh
   
   # Check dependencies
   npm install
   
   # Try starting manually
   npm start
   ```

### Integration not showing up after restart

1. Verify files are in correct location:
   ```bash
   ls -la /config/custom_components/tasks_todo_app/
   ```

2. Check Home Assistant logs:
   ```
   Settings → System → Logs (bottom right)
   ```

3. Restart Home Assistant again (sometimes takes 2 tries)

### "Cannot connect" error

1. Verify addon is running:
   ```bash
   curl http://localhost:8080/api/health
   ```

2. Check API key is correct:
   - Addon config: Settings → Add-ons → Tasks Todo App → Configuration
   - Integration config: Settings → Devices & Services → Tasks Todo App → Options

3. Check firewall:
   ```bash
   netstat -tlnp | grep 8080
   ```

### Sensors not updating

1. Check integration is enabled:
   - Settings → Devices & Services → Integrations → Tasks Todo App (should show "loaded")

2. Force refresh:
   - Settings → Devices & Services → Integrations → Tasks Todo App → click **Reload**

3. Check polling interval:
   - Settings → Devices & Services → Integrations → Tasks Todo App → Options
   - Ensure "Poll Interval" is set to 30 (seconds)

### API key errors

1. Regenerate key in addon:
   - Settings → Add-ons → Tasks Todo App → Configuration
   - Update `api_key` value
   - Click **Save**
   - Click **Restart** addon

2. Update integration:
   - Settings → Devices & Services → Integrations
   - Click **Tasks Todo App** → **Options**
   - Enter new API key in configuration

3. Reload integration:
   - Settings → Devices & Services → Integrations → Tasks Todo App → **Reload**

---

## File Locations

### On Home Assistant instance:

```
/config/
├── custom_components/
│   └── tasks_todo_app/              # Integration files
│       ├── __init__.py
│       ├── api.py
│       ├── config_flow.py
│       ├── const.py
│       ├── entity.py
│       ├── manifest.json
│       ├── sensor.py
│       ├── services.py
│       └── strings.json
│
/usr/share/hassio/addons/
└── tasks_todo_app/                  # Addon files
    ├── addon.yaml
    ├── Dockerfile
    ├── run.sh
    └── README.md

/data/
└── tasks.db                         # SQLite database (persisted)
```

---

## Uninstallation

### Remove addon:

1. Settings → Add-ons → Tasks Todo App
2. Click **Uninstall**
3. Confirm

### Remove integration:

1. Settings → Devices & Services → Integrations
2. Click **Tasks Todo App**
3. Click **Delete** (trash icon)
4. Confirm

### Clean up files:

```bash
# SSH into Home Assistant
rm -rf /config/custom_components/tasks_todo_app/
rm -rf /usr/share/hassio/addons/tasks_todo_app/
rm /data/tasks.db  # Optional - keeps database
```

---

## Next Steps

Once installed and verified:

1. **Create first list** - Use Home Assistant UI or service call
2. **Add items** - Create items with schedules
3. **Set up automations** - Use provided examples
4. **Configure sensors** - Add to dashboards and automations
5. **Enable MCP server** (optional) - For Claude Desktop integration

See [Phase 7: Testing & Polish](../docs/phases.md#phase-7-testing--polish) for testing procedures.
