# Install Tasks Todo App - Addon & Integration

## Prerequisites

- Home Assistant 2026.6.0 or later
- SSH or terminal access to Home Assistant host
- ~500MB disk space available
- Network connectivity between Home Assistant and addon

---

## Part 1: Install the Addon (Backend Service)

### Step 1: SSH into Home Assistant

```bash
ssh user@homeassistant.local
# Or if using Home Assistant OS:
ssh root@homeassistant.local
```

### Step 2: Copy addon files

Navigate to where you have the tasks repository downloaded:

```bash
# From your development machine, SCP the addon folder:
scp -r ./addon-home-assistant/ user@homeassistant.local:/usr/share/hassio/addons/tasks_todo_app
```

Or if accessing via SMB share (Windows/Mac):
```
Source: ./addon-home-assistant/
Target: \\homeassistant.local\config\addons\tasks_todo_app
        (or /mnt/data/addons/tasks_todo_app on Linux)
```

### Step 3: Restart Home Assistant supervisor to detect addon

```bash
# SSH into Home Assistant
ssh root@homeassistant.local

# Restart the supervisor
systemctl restart hassio-supervisor
```

Wait 10-15 seconds for supervisor to scan for new addons.

### Step 4: Open Home Assistant and install addon

1. Open Home Assistant Web UI: http://homeassistant.local:8123
2. Go to **Settings → Add-ons & Services**
3. Click **Add-ons** tab (top)
4. Click **Create Add-on** button (three dots menu on top right)
5. Scroll down and look for **Tasks Todo App**
6. Click on it
7. Click **Install** button
8. Wait 2-3 minutes for installation to complete

### Step 5: Configure the addon

1. Click on **Tasks Todo App** in the Add-ons list
2. Click **Configuration** tab
3. Update the following values:

```yaml
api_key: "your-super-secret-key-change-this"  # Generate something unique!
timezone: "America/New_York"                    # Your IANA timezone
enable_mcp_server: false                        # Change to true if using Claude Desktop
log_level: "info"                               # Use "debug" for troubleshooting
```

⚠️ **IMPORTANT**: Change the API key from default! Use a strong, unique value.

4. Click **Save** (blue button)
5. Wait a few seconds for configuration to be applied

### Step 6: Start the addon

1. Ensure you're on the **Tasks Todo App** addon page
2. Click **Start** button (green, on the right side)
3. Wait 20-30 seconds for container to start
4. Monitor the **Logs** tab at the bottom:

```
[INFO] Starting Tasks Todo App API Server...
API Key: your-super-...
Timezone: America/New_York
MCP Server Enabled: false
Log Level: info
[INFO] Database initialized successfully
[INFO] API server listening on 0.0.0.0:8080
[INFO] Health check enabled
```

Once you see "Health check enabled" - the addon is ready!

### Step 7: Verify addon is running

Test the API from Home Assistant shell:

```bash
# SSH into Home Assistant
ssh root@homeassistant.local

# Test the health endpoint
curl -s http://localhost:8080/api/health | jq .
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-06-21T10:00:00Z"
}
```

If you get a connection error, addon is not running. Check logs for errors.

---

## Part 2: Install the Integration (Home Assistant Component)

### Step 1: Copy integration files

From your development machine:

```bash
# Copy the integration folder
scp -r ./home-assistant-integration/ user@homeassistant.local:/config/custom_components/tasks_todo_app
```

Or via SMB share (Windows/Mac):
```
Source: ./home-assistant-integration/
Target: \\homeassistant.local\config\custom_components\tasks_todo_app
        (or /mnt/data/custom_components/tasks_todo_app on Linux)
```

### Step 2: Verify file permissions

```bash
# SSH into Home Assistant
ssh user@homeassistant.local

# Check files were copied
ls -la /config/custom_components/tasks_todo_app/

# Should show:
# __init__.py
# api.py
# config_flow.py
# const.py
# entity.py
# manifest.json
# sensor.py
# services.py
# strings.json
```

### Step 3: Restart Home Assistant

1. Go to **Settings → System**
2. Scroll to bottom right
3. Click **Restart Home Assistant**
4. Wait 2-3 minutes for restart to complete

⚠️ **Note**: Just reloading integrations won't work - you must do a full restart!

### Step 4: Add the integration in Home Assistant

1. Open Home Assistant Web UI: http://homeassistant.local:8123
2. Go to **Settings → Devices & Services**
3. Click **Create Integration** button (bottom right corner)
4. Search for **"Tasks Todo App"** in the search box
5. Click on **Tasks Todo App** when it appears

You'll see a configuration form. Fill in:

```
Host: localhost
Port: 8080  
API Key: your-super-secret-key-change-this
```

Make sure the **API Key** matches exactly what you set in the addon configuration!

6. Click **Create**

If it says "Successfully configured" ✅ - you're done! The integration loaded.

If you get **"Failed to connect"** ❌:
- Verify addon is running (check Part 1, Step 7)
- Verify API key matches addon configuration exactly
- Wait 30 seconds and try again
- Check Home Assistant logs: **Settings → System → Logs**

### Step 5: Configure integration options (Optional)

1. Go to **Settings → Devices & Services → Integrations**
2. Click on **Tasks Todo App**
3. Click **Options** button (gear icon)
4. Configure:
   - **Poll Interval**: 30 (seconds) - how often sensors update
   - **Enable Sync**: ✓ (checked) - enable background sync

5. Click **Save**

---

## Verification

### Check sensors appear

1. Go to **Developer Tools → States**
2. Search for `sensor.tasks_` 
3. You should see entities like:
   - `sensor.tasks_shopping_active_items`
   - `sensor.tasks_shopping_completion_percent`
   - `sensor.tasks_overdue_items_total`
   - `sensor.tasks_sync_status`

If no sensors appear:
- Integration might not be loaded - check **Settings → Devices & Services → Integrations**
- Addon API might be down - check addon logs
- Try refreshing the browser (F5)

### Test a service call

1. Go to **Developer Tools → Services**
2. Select service domain: **tasks_todo_app**
3. Select service: **Create Item**
4. Fill in service data:

```json
{
  "list_id": "your-list-uuid-here",
  "title": "Test item from Home Assistant",
  "description": "Testing the integration",
  "tags": ["test"]
}
```

5. Click **Call Service**
6. Check the Tasks app frontend - item should appear

---

## Troubleshooting

### Addon won't start

**Error**: "Addon failed to start" or container error

**Solution**:
```bash
# SSH to Home Assistant
ssh root@homeassistant.local

# Check addon logs
docker logs addon_tasks_todo_app

# Common issues:
# - "Port 8080 already in use": Kill process or use different port
# - "Database error": Check /data/tasks.db permissions
# - "npm not found": Container didn't start properly, restart

# Try starting manually
docker start addon_tasks_todo_app
docker logs -f addon_tasks_todo_app
```

### Integration not found after restart

**Error**: "Tasks Todo App" not in integration list

**Solution**:
```bash
# Verify files are in right place
ls -la /config/custom_components/tasks_todo_app/

# Files must include: __init__.py, manifest.json

# If missing, copy again and restart (full restart, not reload)

# Check Home Assistant logs
# Settings → System → Logs → Search for "tasks_todo_app"
```

### Cannot connect error

**Error**: "Failed to connect to Tasks Todo App"

**Solution**:
```bash
# 1. Verify addon is running
curl http://localhost:8080/api/health

# 2. If connection refused, addon isn't running
# Go back to Part 1, Step 6 - check addon logs

# 3. If you get a response, check API key:
# Addon config API key should match integration config

# 4. Try with curl using the API key:
curl -H "Authorization: Bearer your-api-key" \
  http://localhost:8080/api/lists

# Should return a JSON array of lists
```

### Sensors not updating

**Error**: Sensors show "unavailable" or don't update

**Solution**:
```bash
# 1. Check integration is loaded
# Settings → Devices & Services → Integrations → Tasks Todo App

# Should say "loaded" (green checkmark)

# 2. Reload integration
# Click three dots menu → Reload

# 3. Check poll interval
# Settings → Devices & Services → Integrations → Tasks Todo App → Options
# Verify "Poll Interval" is set (default: 30 seconds)

# 4. Check Home Assistant logs
journalctl -u homeassistant@homeassistant -n 50 -f
```

### API Key errors

**Error**: "Unauthorized" or "Invalid API key"

**Solution**:
```bash
# 1. Verify keys match:
# Addon Config API key === Integration Config API key

# 2. Regenerate if needed:
# Addon Settings → Configuration → Change api_key → Save → Restart addon

# 3. Update integration:
# Settings → Devices & Services → Integrations → Tasks Todo App → Options
# Re-enter the new API key → Save

# 4. Force reload
# Settings → Devices & Services → Integrations → Tasks Todo App
# Click three dots → Reload
```

---

## File Locations

After installation, files will be at:

```
/config/
└── custom_components/
    └── tasks_todo_app/          ← Integration files
        ├── __init__.py
        ├── api.py
        ├── config_flow.py
        ├── const.py
        ├── entity.py
        ├── manifest.json
        ├── sensor.py
        ├── services.py
        └── strings.json

/usr/share/hassio/addons/
└── tasks_todo_app/              ← Addon files
    ├── addon.yaml
    ├── Dockerfile
    ├── run.sh
    └── README.md

/data/
└── tasks.db                     ← SQLite database (created by addon)
```

---

## Quick Reference: Using the Integration

### Create item via automation

```yaml
# automations.yaml
- alias: "Create item from button"
  trigger:
    platform: state
    entity_id: input_button.new_item
    to: "on"
  action:
    service: tasks_todo_app.create_item
    data:
      list_id: "shopping-list-uuid"
      title: "Buy groceries"
      tags: ["shopping"]
```

### Monitor sensors in dashboard

```yaml
# dashboard card
type: entities
title: Tasks Overview
entities:
  - sensor.tasks_shopping_active_items
  - sensor.tasks_shopping_completion_percent
  - sensor.tasks_overdue_items_total
  - sensor.tasks_sync_status
```

### Automation: Notify on overdue items

```yaml
- alias: "Alert on overdue tasks"
  trigger:
    platform: state
    entity_id: sensor.tasks_overdue_items_total
  condition:
    condition: template
    value_template: "{{ states('sensor.tasks_overdue_items_total') | int > 0 }}"
  action:
    service: notify.mobile_app_phone
    data:
      title: "Tasks Alert"
      message: "You have {{ states('sensor.tasks_overdue_items_total') }} overdue items"
```

---

## Success Checklist

After installation, verify:

- ✅ Addon appears in Settings → Add-ons & Services
- ✅ Addon status is "Running" (green)
- ✅ `curl http://localhost:8080/api/health` returns 200 OK
- ✅ Integration appears in Settings → Devices & Services
- ✅ Integration status is "Loaded" (green)
- ✅ Sensors appear in Developer Tools → States
- ✅ Service call `tasks_todo_app.create_item` succeeds

Once all items checked ✅ - installation is complete!

---

## Support

For detailed documentation, see:
- [PHASE_6_IMPLEMENTATION.md](/PHASE_6_IMPLEMENTATION.md) - Technical overview
- [addon-home-assistant/README.md](/addon-home-assistant/README.md) - Addon docs
- [home-assistant-integration/README.md](/home-assistant-integration/README.md) - Integration docs
- Home Assistant Logs: Settings → System → Logs
- Addon Logs: Settings → Add-ons → Tasks Todo App → Logs

Installation Date: 2026-06-21
Updated for: Home Assistant 2026.6.0
