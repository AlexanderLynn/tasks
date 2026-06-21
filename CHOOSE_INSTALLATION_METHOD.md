# 📋 Installation Instructions - Choose Your Method

> **3 methods available. Pick one and follow the guide.**

---

## 🎯 Quick Decision

### **File Editor (Easiest - Web UI Only)**
```
No SSH needed
No Git needed  
10 minutes
For: Quick local testing
→ INSTALL_FILE_EDITOR_METHOD.md
```

### **HACS (Recommended - Professional)**
```
Requires GitHub
Automatic updates
15 minutes
For: Long-term maintenance
→ INSTALL_HACS_METHOD.md
```

### **SSH Manual (Fastest CLI)**
```
Command line only
Full control
5 minutes
For: Developers
→ INSTALL_ADDON_AND_INTEGRATION.md
```

---

## 📚 Complete Installation Guides

### 1️⃣ **File Editor Method (Web UI Only)**

**No SSH or command line needed!**

Steps:
1. Install "File Editor" addon in Home Assistant UI
2. Navigate to `/usr/share/hassio/addons/tasks_todo_app/`
3. Upload: addon.yaml, Dockerfile, run.sh
4. Restart supervisor
5. Install addon from Home Assistant UI
6. Upload integration files to `/config/custom_components/tasks_todo_app/`
7. Restart Home Assistant
8. Add integration via UI

**Time**: 10 minutes | **Difficulty**: Easy | **Requirements**: File Editor addon

**[→ Full File Editor Guide](INSTALL_FILE_EDITOR_METHOD.md)**

---

### 2️⃣ **HACS Method (Recommended - Best Long-Term)**

**One-time GitHub setup, then automatic updates forever.**

Steps:
1. Push repo to GitHub (make it public)
2. Add as custom addon repository in Home Assistant
3. Add as custom integration repository in HACS
4. Install addon via HA UI
5. Install integration via HACS
6. Restart and configure

**Time**: 15 minutes | **Difficulty**: Medium | **Requirements**: GitHub + HACS

**[→ Full HACS Guide](INSTALL_HACS_METHOD.md)**

**GitHub Setup Helper:**
```bash
chmod +x setup-github.sh
./setup-github.sh
```

---

### 3️⃣ **SSH Manual Method (Command Line)**

**For developers who prefer CLI.**

Steps:
```bash
# Copy addon
scp -r ./addon-home-assistant user@homeassistant.local:/usr/share/hassio/addons/tasks_todo_app

# Restart supervisor
ssh root@homeassistant.local
systemctl restart hassio-supervisor

# Copy integration
scp -r ./tasks_todo_app user@homeassistant.local:/config/custom_components/

# Restart Home Assistant via UI
```

**Time**: 5 minutes | **Difficulty**: Hard | **Requirements**: SSH access

**[→ Full SSH Guide](INSTALL_ADDON_AND_INTEGRATION.md)**

---

## 📊 Comparison Table

| Aspect | File Editor | HACS | SSH |
|--------|:-----------:|:----:|:---:|
| **Web UI** | ✅ | ✅ | ❌ |
| **Command Line** | ❌ | ⚠️ Minimal | ✅ |
| **SSH Required** | ❌ | ❌ | ✅ |
| **GitHub Required** | ❌ | ✅ | ❌ |
| **Automatic Updates** | ❌ | ✅ | ❌ |
| **Setup Time** | 10 min | 15 min | 5 min |
| **Skill Level** | Beginner | Intermediate | Advanced |
| **Best For** | Quick test | Professional | Dev/CLI |

---

## ✅ Configuration (Same for All Methods)

### Addon Configuration
After installation, go to **Settings → Add-ons & Services → Tasks Todo App → Configuration**:

```yaml
api_key: "your-super-secret-key-here"  # CHANGE THIS!
timezone: "America/New_York"            # Your timezone
enable_mcp_server: false                # Set true for Claude Desktop
log_level: "info"                       # debug|info|warn|error
```

### Integration Configuration  
**Settings → Devices & Services → Create Integration → Tasks Todo App**:

```
Host: localhost
Port: 8080
API Key: your-super-secret-key-here  (MUST match addon!)
```

---

## 🔍 Verify Installation

### Check Addon is Running
```bash
curl http://localhost:8080/api/health
# Returns: {"status":"ok",...}
```

### Check Sensors Appear
1. **Developer Tools → States**
2. Search for `sensor.tasks_`
3. Should see 4+ sensors

### Test Service Call
1. **Developer Tools → Services**
2. Service: `tasks_todo_app.create_item`
3. Data:
```json
{
  "list_id": "test-id",
  "title": "Test from HA",
  "tags": ["test"]
}
```
4. Click **Call Service** ✅

---

## 📁 Folder Structure (HACS-Compatible)

```
tasks/                          ← Repository root
├── hacs.json                   ← HACS config
├── addon-home-assistant/       ← Addon
│   ├── addon.yaml
│   ├── Dockerfile
│   └── run.sh
└── tasks_todo_app/             ← Integration (domain-named)
    ├── __init__.py
    ├── manifest.json
    ├── api.py
    └── [other files]
```

✅ Ready for:
- Custom addon repositories
- HACS integration discovery
- Professional distribution

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| File Editor addon not found | Install from **Settings → Add-ons → Search "File Editor"** |
| Cannot connect to addon | Check addon logs: **Settings → Add-ons → Tasks Todo App → Logs** |
| Integration missing after restart | Did you do full restart? Not reload! |
| API key errors | Make sure key matches EXACTLY in both places |
| Sensors unavailable | Check integration is "loaded": **Settings → Devices & Services** |

**Full troubleshooting in each method's guide.**

---

## 📖 Documentation Files

| Document | Purpose | Time |
|----------|---------|------|
| [START_HERE_INSTALLATION.md](START_HERE_INSTALLATION.md) | Main entry point | 2 min |
| [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md) | Method comparison | 5 min |
| [INSTALL_FILE_EDITOR_METHOD.md](INSTALL_FILE_EDITOR_METHOD.md) | File Editor steps | 15 min |
| [INSTALL_HACS_METHOD.md](INSTALL_HACS_METHOD.md) | HACS + GitHub steps | 15 min |
| [INSTALL_ADDON_AND_INTEGRATION.md](INSTALL_ADDON_AND_INTEGRATION.md) | SSH manual steps | 15 min |
| [QUICK_INSTALL.md](QUICK_INSTALL.md) | Quick reference | 2 min |
| [README_INSTALLATION.md](README_INSTALLATION.md) | This document | 5 min |
| [setup-github.sh](setup-github.sh) | GitHub setup helper | 5 min |

---

## 🚀 Ready to Install?

### **Choose Your Method:**

1. **File Editor (Easiest)**
   - No technical knowledge needed
   - Web UI file manager
   - 10 minutes
   - **[→ Go to File Editor Guide](INSTALL_FILE_EDITOR_METHOD.md)**

2. **HACS (Recommended)**
   - Automatic updates
   - Professional distribution
   - 15 minutes (includes GitHub setup)
   - **[→ Go to HACS Guide](INSTALL_HACS_METHOD.md)**

3. **SSH Manual (Fastest for CLI)**
   - Command line only
   - Full control
   - 5 minutes
   - **[→ Go to SSH Guide](INSTALL_ADDON_AND_INTEGRATION.md)**

---

## 🎓 What You Get After Installation

✅ **Backend Addon**
- REST API on port 8080
- SQLite database
- Task scheduling
- Health check

✅ **Home Assistant Integration**
- Sensor entities (active items, completion %, overdue, sync)
- Service calls (create, complete, undo, delete)
- 30-second polling sync
- Configuration UI

✅ **Home Assistant Features**
- Add items via automations
- Monitor tasks with sensors
- Create dashboards
- Optional: MCP server for Claude Desktop

---

## 🎯 Next Steps

1. **Pick a method** (File Editor / HACS / SSH)
2. **Click the link** to that method's full guide
3. **Follow the steps** in that guide
4. **Verify** using the checklist above
5. **Done!** 🎉

---

**All three methods are ready and tested. Pick one and go!**

- 🟢 [File Editor](INSTALL_FILE_EDITOR_METHOD.md)
- 🟢 [HACS](INSTALL_HACS_METHOD.md)  
- 🟢 [SSH](INSTALL_ADDON_AND_INTEGRATION.md)

Or read [START_HERE_INSTALLATION.md](START_HERE_INSTALLATION.md) if you need help deciding.
