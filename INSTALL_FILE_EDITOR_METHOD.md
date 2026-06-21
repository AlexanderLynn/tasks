# Install Using File Editor - Simple Web UI Method

> **Easiest method if you already have the File Editor addon installed!**

---

## Prerequisites

- File Editor addon installed in Home Assistant
- Access to Home Assistant Web UI
- The addon and integration files (from this repo)

---

## Step 1: Install File Editor Addon (If needed)

1. Open Home Assistant Web UI
2. **Settings → Add-ons & Services → Add-ons**
3. Search **"File Editor"** (by Home Assistant Community)
4. Click **Install**
5. Once installed, click **Open Web UI** or go to **Settings → Add-ons & Services → File Editor → Open Web UI**

---

## Step 2: Install Addon Using File Editor

### Navigate and Create Addon Folder

In File Editor Web UI:

1. Click the **file icon** (folder button) on left panel
2. Navigate to `/usr/share/hassio/addons/`
3. Right-click in empty space → **New Folder**
4. Name it: `tasks_todo_app`

### Upload Addon Files

1. Inside `/usr/share/hassio/addons/tasks_todo_app/`, right-click → **Upload File**
2. Upload from this repo's `addon-home-assistant/` folder:
   - `addon.yaml` ✓
   - `Dockerfile` ✓
   - `run.sh` ✓

### Or Create Files Directly

1. Right-click in folder → **New File**
2. Create each file with content from the repo

### Make run.sh Executable

```bash
# In Home Assistant terminal, SSH:
ssh root@homeassistant.local
chmod +x /usr/share/hassio/addons/tasks_todo_app/run.sh
```

### Restart Supervisor to Detect Addon

```bash
ssh root@homeassistant.local
systemctl restart hassio-supervisor
sleep 15
```

### Install via Home Assistant UI

1. Go to **Settings → Add-ons & Services → Add-ons**
2. Click **Create Add-on** (⋯ menu)
3. Look for **"Tasks Todo App"** in the list
4. Click → **Install** → Wait 2-3 minutes

---

## Step 3: Install Integration Using File Editor

### Create Integration Folder Structure

In File Editor Web UI:

1. Click **file icon** → Navigate to `/config/custom_components/`
2. Create new folder: `tasks_todo_app`
3. Inside that folder, create all files:
   - `__init__.py`
   - `api.py`
   - `config_flow.py`
   - `const.py`
   - `entity.py`
   - `manifest.json`
   - `sensor.py`
   - `services.py`
   - `strings.json`

### Upload or Create Each File

**Option A: Upload Files** (faster)
- Copy each `.py` and `.json` file from `home-assistant-integration/`
- Right-click in folder → **Upload File**

**Option B: Create in Editor** (more control)
- Right-click → **New File**
- Paste content from this repo's files
- Save (Ctrl+S)

---

## Step 4: Restart Home Assistant

1. Go to **Settings → System**
2. Click **Restart Home Assistant** (bottom right)
3. Wait 2-3 minutes for restart

---

## Step 5: Configure Addon

1. **Settings → Add-ons & Services → Add-ons**
2. Click **Tasks Todo App**
3. Click **Configuration** tab
4. Edit the YAML:

```yaml
api_key: "your-super-secret-key-here"  # CHANGE THIS!
timezone: "America/New_York"
enable_mcp_server: false
log_level: "info"
```

5. Click **Save** → **Start**
6. Wait for "Health check enabled" in **Logs** tab

---

## Step 6: Add Integration

1. **Settings → Devices & Services**
2. Click **Create Integration**
3. Search **"Tasks Todo App"**
4. Enter:
   - Host: `localhost`
   - Port: `8080`
   - API Key: `your-super-secret-key-here` (same as addon)
5. Click **Create** ✅

---

## Step 7: Verify

Go to **Developer Tools → States**, search `sensor.tasks_`:
- ✅ `sensor.tasks_*_active_items`
- ✅ `sensor.tasks_*_completion_percent`
- ✅ `sensor.tasks_overdue_items_total`
- ✅ `sensor.tasks_sync_status`

---

## Advantages of File Editor Method

✅ No SSH needed (except addon detection)
✅ Visual file manager in Home Assistant UI
✅ Can edit files directly in browser
✅ No manual SCP commands
✅ Easy troubleshooting with file visibility

---

## Troubleshooting

### Addon not appearing after supervisor restart

```bash
# Check addon was detected
docker ps | grep addon

# Or check supervisor logs
journalctl -u hassio-supervisor -n 50 -f
```

### Integration not showing after restart

- Did you do full restart? (Not reload)
- Verify files in `/config/custom_components/tasks_todo_app/`
- Check Home Assistant logs: **Settings → System → Logs**

### Can't access File Editor UI

- Addon must be installed and running
- Try going to: http://homeassistant.local:8124
- Check File Editor addon is started

---

See also:
- [QUICK_INSTALL.md](/QUICK_INSTALL.md) - Quick reference
- [INSTALL_ADDON_AND_INTEGRATION.md](/INSTALL_ADDON_AND_INTEGRATION.md) - Detailed guide
