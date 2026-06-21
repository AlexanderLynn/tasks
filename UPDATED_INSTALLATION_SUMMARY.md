# Updated Installation Guide - Three Methods Available

## 📋 TL;DR - Installation Options

### **Quick Reference Table**

| Method | Best For | Time | Complexity |
|--------|----------|------|------------|
| **File Editor** | Web UI lovers | 10 min | Easy |
| **HACS** | Long-term maintenance | 15 min | Medium |
| **SSH Manual** | Command line users | 5 min | Hard |

---

## 🎯 Recommended Path: HACS

**Why?** Automatic updates, professional distribution, easy sharing.

### HACS Installation in 5 Steps

1. **Make repo public on GitHub**
   ```bash
   # Create new repo at github.com/new
   # Clone and set up:
   git remote add origin https://github.com/YOUR_USERNAME/tasks.git
   git push -u origin main
   ```

2. **Add custom addon repository in Home Assistant**
   - Settings → Add-ons & Services → Add-ons → ⋯ Menu
   - Repositories → Add: `https://github.com/YOUR_USERNAME/tasks`

3. **Install addon**
   - Settings → Add-ons & Services → Create Add-on
   - Find "Tasks Todo App" → Install

4. **Install integration (HACS)**
   - HACS → Integrations → ⋯ → Custom repositories
   - Add: `https://github.com/YOUR_USERNAME/tasks`
   - Search "Tasks Todo App" → Download

5. **Configure**
   - Restart Home Assistant
   - Add integration via UI
   - Configure addon settings

---

## 📦 Folder Structure (For HACS/GitHub)

Your repository should look like this:

```
tasks/                              (GitHub repo root)
├── README.md
├── LICENSE                         (Optional)
├── hacs.json                       ← HACS config (included)
├── setup-github.sh                 ← Setup helper script (included)
├── addon-home-assistant/           ← Addon for HACS detection
│   ├── addon.yaml
│   ├── Dockerfile
│   ├── run.sh
│   └── README.md
└── tasks_todo_app/                 ← Integration (domain-matched name)
    ├── __init__.py
    ├── manifest.json
    ├── api.py
    ├── config_flow.py
    ├── const.py
    ├── entity.py
    ├── sensor.py
    ├── services.py
    └── strings.json
```

✅ **This structure is already set up in this repo!**

---

## 🚀 Installation Methods Available

### **Method 1: File Editor (Easiest Web UI)**
No command line needed. Uses Home Assistant's File Editor addon.

📖 [→ Full Guide: INSTALL_FILE_EDITOR_METHOD.md](INSTALL_FILE_EDITOR_METHOD.md)

**Steps:**
1. Install File Editor addon in Home Assistant
2. Create folders in web UI: `/usr/share/hassio/addons/tasks_todo_app/`
3. Upload files via web UI file manager
4. Restart supervisor
5. Install addon from Home Assistant UI
6. Copy integration to `/config/custom_components/tasks_todo_app/`
7. Restart Home Assistant
8. Add integration via UI

**Best for:** Non-technical users, web UI preference, quick local setup

---

### **Method 2: HACS (Recommended Professional)**
Automatic updates, easy sharing, professional distribution.

📖 [→ Full Guide: INSTALL_HACS_METHOD.md](INSTALL_HACS_METHOD.md)

**Steps:**
1. Push repo to public GitHub repository
2. Add as custom addon repository in Home Assistant
3. Install addon from Home Assistant UI
4. Install integration from HACS
5. Restart and configure

**Best for:** Long-term maintenance, sharing with others, professional deployment

---

### **Method 3: SSH Manual (Advanced)**
Command-line approach with full control.

📖 [→ Full Guide: INSTALL_ADDON_AND_INTEGRATION.md](INSTALL_ADDON_AND_INTEGRATION.md)

**Steps:**
1. SSH into Home Assistant
2. Copy addon files to `/usr/share/hassio/addons/tasks_todo_app/`
3. Restart supervisor
4. Copy integration to `/config/custom_components/tasks_todo_app/`
5. Restart Home Assistant
6. Add integration via UI

**Best for:** CLI enthusiasts, automation, developers

---

## 📖 Complete Documentation

| Document | Purpose | Time |
|----------|---------|------|
| [START_HERE_INSTALLATION.md](START_HERE_INSTALLATION.md) | **Main entry point - start here!** | 2 min |
| [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md) | Compare all methods | 5 min |
| [INSTALL_FILE_EDITOR_METHOD.md](INSTALL_FILE_EDITOR_METHOD.md) | Detailed File Editor steps | 15 min |
| [INSTALL_HACS_METHOD.md](INSTALL_HACS_METHOD.md) | Detailed HACS steps | 15 min |
| [INSTALL_ADDON_AND_INTEGRATION.md](INSTALL_ADDON_AND_INTEGRATION.md) | Detailed SSH steps | 15 min |
| [QUICK_INSTALL.md](QUICK_INSTALL.md) | Quick reference (copy-paste) | 2 min |
| [setup-github.sh](setup-github.sh) | GitHub setup helper script | 5 min |
| [PHASE_6_IMPLEMENTATION.md](PHASE_6_IMPLEMENTATION.md) | Technical reference | 10 min |
| [PHASE_6_DEFICIENCIES_AUDIT.md](PHASE_6_DEFICIENCIES_AUDIT.md) | What was fixed | 5 min |

---

## ✨ What's New in This Version

### **Deficiencies Fixed** (4 critical):
- ✅ Removed deprecated `CONNECTION_CLASS` pattern
- ✅ Updated to Home Assistant 2026.6.0 standards
- ✅ Fixed critical data access bug (HIGH severity)
- ✅ Added robust input validation

### **Installation Improvements**:
- ✅ File Editor method (no SSH needed!)
- ✅ HACS integration support
- ✅ GitHub setup script
- ✅ Multiple comprehensive guides
- ✅ Comparison table for methods
- ✅ Quick decision tree

### **Folder Structure**:
- ✅ Organized for HACS compatibility
- ✅ `hacs.json` configured
- ✅ Integration in domain-named folder (`tasks_todo_app/`)
- ✅ Addon in `addon-home-assistant/`

---

## 🔧 Folder Structure Already Set Up

```
This repo now includes:
✅ /addon-home-assistant/        - Addon files
✅ /tasks_todo_app/              - Integration files (HACS-compatible)
✅ hacs.json                     - HACS configuration
✅ setup-github.sh               - GitHub setup helper
✅ START_HERE_INSTALLATION.md    - Main guide
✅ INSTALLATION_GUIDE.md         - Method comparison
✅ INSTALL_FILE_EDITOR_METHOD.md - File Editor guide
✅ INSTALL_HACS_METHOD.md        - HACS guide
✅ INSTALL_ADDON_AND_INTEGRATION.md - SSH guide
```

No file reorganization needed - everything is ready!

---

## 🎯 Quick Start by Preference

### "Just want it running quickly"
→ [File Editor Method](INSTALL_FILE_EDITOR_METHOD.md) (10 min, web UI only)

### "Want automatic updates and long-term maintenance"
→ [HACS Method](INSTALL_HACS_METHOD.md) (15 min, requires GitHub)

### "Prefer command line"
→ [SSH Method](INSTALL_ADDON_AND_INTEGRATION.md) (5 min, requires SSH)

### "Not sure which to pick"
→ [Comparison Guide](INSTALLATION_GUIDE.md) (5 min decision tree)

---

## 📊 Summary of Changes

### File Organization
- ✅ Created `/tasks_todo_app/` for HACS integration discovery
- ✅ Kept `/addon-home-assistant/` for addon distribution
- ✅ Added `hacs.json` for HACS configuration
- ✅ Integration files copied to domain-named folder

### Code Fixes
- ✅ Removed deprecated patterns (Home Assistant 2026.6.0 compliant)
- ✅ Fixed data access bugs in sensor calculations
- ✅ Added safe defaults and validation

### Documentation
- ✅ 8 new installation/setup guides
- ✅ GitHub setup helper script
- ✅ Multiple method comparisons
- ✅ Quick reference guides

### Ready to Deploy
- ✅ Can be pushed to public GitHub
- ✅ Can be added to HACS
- ✅ Can be used via File Editor
- ✅ Can be installed via SSH
- ✅ All methods production-ready

---

## 🚀 Next Steps

1. **Choose your installation method:**
   - [File Editor](INSTALL_FILE_EDITOR_METHOD.md) - Easiest
   - [HACS](INSTALL_HACS_METHOD.md) - Recommended
   - [SSH](INSTALL_ADDON_AND_INTEGRATION.md) - Advanced

2. **Follow that guide step-by-step**

3. **Verify installation:**
   ```
   Developer Tools → States → Search "sensor.tasks_"
   Should see 4 sensors ✅
   ```

4. **Test service call:**
   ```
   Developer Tools → Services → tasks_todo_app.create_item
   Fill in and call ✅
   ```

---

## 📞 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Addon won't start | Check logs in Home Assistant UI |
| Integration missing | Did you restart? (Not reload - full restart!) |
| Cannot connect | Verify API key matches exactly |
| Sensors unavailable | Check integration is loaded |

Full troubleshooting in each guide (File Editor / HACS / SSH).

---

## 🎓 Key Information

### **Home Assistant Version**: 2026.6.0+
### **Node Version**: 24 LTS (Alpine-based)
### **Database**: SQLite (persisted in `/data/`)
### **API Port**: 8080
### **Polling Interval**: 30 seconds

---

## 📚 Documentation Structure

```
User starts here:
    ↓
START_HERE_INSTALLATION.md (choose method)
    ├─→ INSTALLATION_GUIDE.md (compare methods)
    │
    ├─→ INSTALL_FILE_EDITOR_METHOD.md (detailed File Editor)
    ├─→ INSTALL_HACS_METHOD.md (detailed HACS + GitHub setup)
    └─→ INSTALL_ADDON_AND_INTEGRATION.md (detailed SSH)
    
For quick reference:
    ↓
QUICK_INSTALL.md (copy-paste)

For technical details:
    ↓
PHASE_6_IMPLEMENTATION.md
PHASE_6_DEFICIENCIES_AUDIT.md
```

---

**Ready to install? [→ START_HERE_INSTALLATION.md](START_HERE_INSTALLATION.md)**

Or pick your method directly:
- [File Editor (10 min)](INSTALL_FILE_EDITOR_METHOD.md)
- [HACS (15 min, recommended)](INSTALL_HACS_METHOD.md)
- [SSH Manual (5 min)](INSTALL_ADDON_AND_INTEGRATION.md)
