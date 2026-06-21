# ⚡ Quick Install - Tasks Todo App Addon & Integration

**Estimated time: 10 minutes** | Home Assistant 2026.6.0+

---

## 🚀 Installation Steps

### 1️⃣ Addon Installation (3 minutes)

```bash
# SSH into Home Assistant
ssh user@homeassistant.local

# Copy addon
scp -r ./addon-home-assistant user@homeassistant.local:/usr/share/hassio/addons/tasks_todo_app

# Restart supervisor
systemctl restart hassio-supervisor
sleep 15
```

Then in **Home Assistant Web UI**:
1. **Settings → Add-ons & Services → Add-ons**
2. Click **Create Add-on** (⋯ menu)
3. Search **"Tasks Todo App"** → Click → **Install**
4. Wait completion, then click **Configuration**
5. Update:
   ```yaml
   api_key: "super-secret-key-123"    # CHANGE THIS!
   timezone: "America/New_York"        # Your timezone
   ```
6. Click **Save** → **Start**
7. Wait for "Health check enabled" in logs ✅

### 2️⃣ Integration Installation (3 minutes)

```bash
# Copy integration
scp -r ./home-assistant-integration user@homeassistant.local:/config/custom_components/tasks_todo_app
```

Then in **Home Assistant Web UI**:
1. **Settings → System → Restart Home Assistant** (wait 2-3 min)
2. **Settings → Devices & Services**
3. Click **Create Integration**
4. Search **"Tasks Todo App"** → Click
5. Enter:
   - Host: `localhost`
   - Port: `8080`
   - API Key: `super-secret-key-123` (same as addon!)
6. Click **Create** ✅

### 3️⃣ Verify Installation (1 minute)

Go to **Developer Tools → States**, search `sensor.tasks_`:
- `sensor.tasks_*_active_items` ✅
- `sensor.tasks_*_completion_percent` ✅
- `sensor.tasks_overdue_items_total` ✅
- `sensor.tasks_sync_status` ✅

---

## 🔧 Troubleshooting Quick Fixes

| Problem | Fix |
|---------|-----|
| Addon won't start | Check logs: **Add-ons → Tasks Todo App → Logs** |
| Integration missing | Did you restart? (Not reload - full restart!) |
| Cannot connect | Verify API key matches addon + integration |
| Sensors unavailable | Integration loaded? Check **Integrations** page |
| API key error | Regenerate: Addon Settings → Configuration → Save → Restart |

---

## 📝 Test It

**Create test item via Service Call:**

1. **Developer Tools → Services**
2. Domain: `tasks_todo_app`
3. Service: `create_item`
4. Data:
   ```json
   {
     "list_id": "any-uuid",
     "title": "Test from HA"
   }
   ```
5. **Call Service** → Check frontend ✅

---

## 📚 Full Docs

- Detailed install: [INSTALL_ADDON_AND_INTEGRATION.md](/INSTALL_ADDON_AND_INTEGRATION.md)
- Technical details: [PHASE_6_IMPLEMENTATION.md](/PHASE_6_IMPLEMENTATION.md)
- Addon docs: [addon-home-assistant/README.md](/addon-home-assistant/README.md)
- Integration docs: [home-assistant-integration/README.md](/home-assistant-integration/README.md)

---

**Status**: ✅ Complete | **Updated**: 2026-06-21 | **HA Version**: 2026.6.0+
