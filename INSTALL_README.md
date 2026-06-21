# Installation Instructions - Addon & Integration

## ADDON INSTALLATION

### Prerequisites
- SSH access to Home Assistant  
- `addon-home-assistant/` folder contents

### Install Steps

```bash
# 1. SSH into Home Assistant
ssh user@homeassistant.local

# 2. Copy addon files (from your machine)
scp -r ./addon-home-assistant/ user@homeassistant.local:/usr/share/hassio/addons/tasks_todo_app

# 3. Restart supervisor so it detects the new addon
ssh root@homeassistant.local
systemctl restart hassio-supervisor
sleep 15
```

### Configure via Home Assistant UI

1. Open http://homeassistant.local:8123
2. **Settings → Add-ons & Services → Add-ons**
3. Click **Create Add-on** (⋯ menu, top right)
4. Search for **"Tasks Todo App"**
5. Click on it → **Install** → Wait 2-3 minutes

Once installed:
1. Click **Tasks Todo App** in the list
2. Click **Configuration** tab
3. Update the YAML:
   ```yaml
   api_key: "your-super-secret-key-here"
   timezone: "America/New_York"
   enable_mcp_server: false
   log_level: "info"
   ```
4. Click **Save** (blue button)
5. Click **Start** (green button)
6. Wait for "Health check enabled" in the **Logs** tab

Verify it's running:
```bash
ssh root@homeassistant.local
curl http://localhost:8080/api/health
# Should return: {"status":"ok","timestamp":"..."}
```

---

## INTEGRATION INSTALLATION

### Prerequisites
- Addon is running (see above)
- `home-assistant-integration/` folder contents

### Install Steps

```bash
# 1. Copy integration files (from your machine)
scp -r ./home-assistant-integration/ user@homeassistant.local:/config/custom_components/tasks_todo_app

# 2. Verify files copied
ssh user@homeassistant.local
ls -la /config/custom_components/tasks_todo_app/
# Should show: __init__.py, api.py, config_flow.py, const.py, entity.py, manifest.json, sensor.py, services.py, strings.json
```

### Configure via Home Assistant UI

1. Open http://homeassistant.local:8123
2. Go to **Settings → System**
3. Scroll down → Click **Restart Home Assistant** (wait 2-3 min for restart)

Once restarted:
1. Go to **Settings → Devices & Services**
2. Click **Create Integration** (bottom right)
3. Search **"Tasks Todo App"**
4. Click on it
5. Fill in the form:
   - Host: `localhost`
   - Port: `8080`
   - API Key: `your-super-secret-key-here` (MUST match addon!)
6. Click **Create**

If successful: "Successfully configured ✅"

---

## VERIFY INSTALLATION

### Check Sensors Appear
1. Go to **Developer Tools → States**
2. Search for `sensor.tasks_`
3. Should see:
   - `sensor.tasks_active_items`
   - `sensor.tasks_completion_percent`
   - `sensor.tasks_overdue_items_total`
   - `sensor.tasks_sync_status`

### Test Service Call
1. Go to **Developer Tools → Services**
2. Domain: `tasks_todo_app`
3. Service: `create_item`
4. Service data:
   ```json
   {
     "list_id": "test-uuid",
     "title": "Test from Home Assistant"
   }
   ```
5. Click **Call Service**

---

## TROUBLESHOOTING

### Addon won't start
```bash
ssh root@homeassistant.local
docker logs addon_tasks_todo_app
# Check for errors in output
```

### Cannot connect error
```bash
# Check addon is running
curl http://localhost:8080/api/health

# If not responding:
# 1. Check addon logs (above)
# 2. Verify API key is correct
# 3. Ensure port 8080 is not blocked
```

### Integration not found
```bash
# Did you restart? (Not reload - FULL restart)
# Settings → System → Restart Home Assistant

# Verify files exist:
ls -la /config/custom_components/tasks_todo_app/

# Check Home Assistant logs:
# Settings → System → Logs
```

### Sensors say "unavailable"
- Ensure integration is "loaded" (Settings → Devices & Services)
- Click reload: Settings → Devices & Services → Tasks Todo App → ⋮ → Reload

---

## DOCUMENTATION

- **Quick Install** (10 min): [QUICK_INSTALL.md](/QUICK_INSTALL.md)
- **Full Install** (detailed steps): [INSTALL_ADDON_AND_INTEGRATION.md](/INSTALL_ADDON_AND_INTEGRATION.md)
- **Deficiencies Fixed**: [PHASE_6_DEFICIENCIES_AUDIT.md](/PHASE_6_DEFICIENCIES_AUDIT.md)
- **Technical Details**: [PHASE_6_IMPLEMENTATION.md](/PHASE_6_IMPLEMENTATION.md)
