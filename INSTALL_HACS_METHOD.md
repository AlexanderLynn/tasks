# Install Using HACS - Best Practice Method

> **Recommended approach for long-term maintenance and easy updates!**

---

## Option A: Add Tasks Repo to Custom Addon Repositories + HACS Integration

This is the easiest method. You just add one repository URL to Home Assistant and get both the addon AND integration.

### Prerequisites

- Repository must be public on GitHub
- HACS installed (optional, but recommended for integration)

### Step 1: Make Repository Public on GitHub

1. Go to your GitHub repo settings
2. Change to **Public** visibility
3. Repository URL: `https://github.com/YOUR_USERNAME/tasks`

### Step 2: Add Custom Addon Repository

1. Open Home Assistant Web UI
2. **Settings → Add-ons & Services → Add-ons**
3. Click **⋯ menu** (top right) → **Repositories**
4. Add repository URL: `https://github.com/YOUR_USERNAME/tasks`
5. Click **Create**
6. Home Assistant will scan the repo and find `addon-home-assistant/` and `tasks_todo_app/`

### Step 3: Install Addon

1. **Settings → Add-ons & Services → Add-ons**
2. Look for **"Tasks Todo App"** (custom repository section)
3. Click → **Install**
4. Configure and start (see configuration section below)

### Step 4: Install Integration via HACS

1. Open **HACS** (if installed)
2. Click **Integrations** (left menu)
3. Click **⋯** menu → **Custom repositories**
4. Add: `https://github.com/YOUR_USERNAME/tasks`
5. Category: Select **Integration**
6. Click **Add**
7. Search **"Tasks Todo App"** in HACS
8. Click → **Download**
9. Restart Home Assistant
10. Add integration: **Settings → Devices & Services → Create Integration → Tasks Todo App**

### Advantages

✅ One-command installation
✅ Automatic updates via HACS
✅ No manual file management
✅ Easy to share with others
✅ Professional distribution method

---

## Option B: Use Official HACS Repositories (Advanced)

If you want to submit to official HACS repositories:

### For the Addon

1. Go to https://github.com/home-assistant/custom_components
2. Fork and submit pull request
3. Once approved, shows in HACS by default

### For the Integration

1. Go to https://github.com/home-assistant/core/
2. Submit integration directly
3. Becomes part of core Home Assistant

(This takes longer but is the ultimate distribution method)

---

## Configuration After Installation

### Configure the Addon

1. **Settings → Add-ons & Services → Add-ons**
2. Click **Tasks Todo App**
3. **Configuration** tab → Edit YAML:

```yaml
api_key: "your-super-secret-key-here"  # CHANGE THIS!
timezone: "America/New_York"
enable_mcp_server: false
log_level: "info"
```

4. **Save** → **Start**
5. Wait for "Health check enabled" in **Logs**

### Add the Integration

1. **Settings → Devices & Services**
2. **Create Integration** → Search "Tasks Todo App"
3. Enter:
   - Host: `localhost`
   - Port: `8080`
   - API Key: `your-super-secret-key-here`
4. **Create** ✅

---

## Folder Structure Required

For this to work with HACS and custom addon repos, your GitHub repo should be organized as:

```
tasks/                          (root)
├── README.md
├── hacs.json                   ← HACS configuration
├── LICENSE
├── addon-home-assistant/       ← Addon folder
│   ├── addon.yaml
│   ├── Dockerfile
│   ├── run.sh
│   └── README.md
└── tasks_todo_app/             ← Integration folder (matches domain)
    ├── __init__.py
    ├── api.py
    ├── config_flow.py
    ├── const.py
    ├── entity.py
    ├── manifest.json
    ├── sensor.py
    ├── services.py
    └── strings.json
```

### hacs.json Must Be in Repo Root

```json
{
  "name": "Tasks Todo App",
  "domains": ["tasks_todo_app"],
  "iot_class": "local_polling",
  "homeassistant": "2026.6.0"
}
```

---

## Step-by-Step: GitHub Public Repository Setup

### 1. Create/Update GitHub Repository

```bash
cd /path/to/tasks
git remote add origin https://github.com/YOUR_USERNAME/tasks.git
git branch -M main
git push -u origin main
```

### 2. Verify Folder Structure Matches Above

Check that you have:
- ✅ `hacs.json` at root
- ✅ `addon-home-assistant/` folder with `addon.yaml`
- ✅ `tasks_todo_app/` folder with `manifest.json`

### 3. Set Repository to Public

GitHub Settings → Visibility → Public

### 4. Create Release (Optional but Recommended)

```bash
git tag v1.0.0
git push origin v1.0.0
```

### 5. Add to Home Assistant

#### For Addon:
- Settings → Add-ons & Services → Add-ons
- ⋯ menu → Repositories
- Add: `https://github.com/YOUR_USERNAME/tasks`

#### For Integration (HACS):
- HACS → Integrations
- ⋯ menu → Custom repositories
- Add: `https://github.com/YOUR_USERNAME/tasks`
- Category: Integration

---

## Verify Installation

### Check Addon

```bash
curl http://localhost:8080/api/health
# Returns: {"status":"ok",...}
```

### Check Integration

**Developer Tools → States** → Search `sensor.tasks_`:
- `sensor.tasks_*_active_items` ✅
- `sensor.tasks_*_completion_percent` ✅
- `sensor.tasks_overdue_items_total` ✅
- `sensor.tasks_sync_status` ✅

---

## Making Updates

### To Release Updates

```bash
# Make code changes
git add .
git commit -m "Fix: data access bug"
git push origin main

# Tag new version
git tag v1.0.1
git push origin v1.0.1
```

### Users Get Updates Via

- **Addon**: Settings → Add-ons & Services → Update button
- **Integration**: HACS → Updates tab → Download

---

## Advantages of HACS Method

✅ **One-click installation** for users
✅ **Automatic updates** available
✅ **Professional distribution**
✅ **Easy to share** (just GitHub URL)
✅ **No manual file management**
✅ **Version tracking** with git tags
✅ **Community discovery** via HACS

---

## Troubleshooting

### Addon not showing in custom repos

1. Check `hacs.json` is at repo root
2. Check `addon.yaml` exists in `addon-home-assistant/`
3. Check repository is **public** (not private)
4. Try removing and re-adding repository

### Integration not showing in HACS

1. Check `manifest.json` exists in `tasks_todo_app/`
2. Check `tasks_todo_app/` folder name matches domain
3. Check `hacs.json` has `"domains": ["tasks_todo_app"]`
4. Repository must be **public**
5. Restart Home Assistant after adding repo

### HACS says "Custom component not found"

- Wait 10 seconds after adding repository
- Click refresh icon in HACS
- Check Home Assistant logs for errors

---

## GitHub Repository Example

See this structure in your repo:

```
https://github.com/YOUR_USERNAME/tasks/
├── README.md
├── LICENSE
├── hacs.json                    ← Required for HACS
├── addon-home-assistant/
│   ├── addon.yaml              ← Required for addon detection
│   ├── Dockerfile
│   ├── run.sh
│   └── README.md
└── tasks_todo_app/              ← Must match domain in manifest.json
    ├── manifest.json
    ├── __init__.py
    └── [other integration files]
```

---

## Quick Links

- [File Editor Method](INSTALL_FILE_EDITOR_METHOD.md) - For manual web UI editing
- [Quick Install](QUICK_INSTALL.md) - Quick reference
- [HACS Documentation](https://hacs.xyz/) - Learn more about HACS
- [GitHub Pages Setup](https://pages.github.com/) - For repository documentation

---

**Recommended**: Use HACS method for professional distribution and easy updates!
