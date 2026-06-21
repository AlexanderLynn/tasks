# Tasks Todo App - Installation & Setup Guide

Welcome! This guide will help you install the Tasks Todo App addon and integration in Home Assistant.

---

## ⚡ Quick Start - Choose Your Installation Method

### **Option 1: File Editor (Easiest - Web UI Only)**
Web-based file manager for Home Assistant. No SSH, no dependencies.
- ✅ Web UI only
- ✅ No additional tools needed
- ❌ Manual updates

**[→ File Editor Installation Guide](INSTALL_FILE_EDITOR_METHOD.md)**

---

### **Option 2: HACS (Recommended - Best Long-Term)**
Professional method with automatic updates. Requires GitHub and HACS.
- ✅ Automatic updates
- ✅ Easy to share
- ✅ Professional distribution
- ⚠️ Requires GitHub + HACS

**[→ HACS Installation Guide](INSTALL_HACS_METHOD.md)**

---

### **Option 3: SSH Manual (Advanced)**
Command-line installation with full control. Fastest for developers.
- ✅ Full control
- ✅ Fastest setup (for CLI users)
- ❌ Requires SSH access
- ❌ Manual updates

**[→ SSH Manual Installation Guide](INSTALL_ADDON_AND_INTEGRATION.md)**

---

## 🤔 Not Sure Which Method?

| Your Situation | Recommended |
|---|---|
| "I have File Editor addon installed" | **File Editor** |
| "I use HACS and want updates" | **HACS** |
| "I prefer command line" | **SSH Manual** |
| "I want professional distribution" | **HACS** |
| "I just want it running quickly" | **File Editor** |
| "I'll share with others" | **HACS** |

**→ [Full Comparison Guide](INSTALLATION_GUIDE.md)**

---

## 📦 What Gets Installed

### **Addon (Backend Service)**
- REST API server (port 8080)
- SQLite database
- Task scheduling engine
- Health check endpoint

### **Integration (Home Assistant Component)**
- Sensor entities (active items, completion %, overdue, sync status)
- Service calls (create item, complete, undo, create list)
- Automatic data sync (30-second polling)
- Configuration UI with validation

---

## ⚙️ What You Need

### **Minimum Requirements**
- Home Assistant 2026.6.0 or later
- ~500MB disk space

### **For File Editor Method**
- File Editor addon (installable from Home Assistant)

### **For HACS Method**
- GitHub account
- Git command line (optional)
- HACS installed in Home Assistant

### **For SSH Method**
- SSH access to Home Assistant
- Terminal/command line access

---

## 🔧 API Key Setup

All methods require setting an API key for authentication:

1. Choose a strong, unique key (min 32 characters recommended)
2. Set it in the addon configuration
3. Use the same key in integration configuration

Example strong key:
```
tasks-app-prod-secure-2026-uuid-a1b2c3d4e5f6
```

---

## 🚀 After Installation

### Verify Installation

Go to **Developer Tools → States** and search for `sensor.tasks_`:

You should see:
- `sensor.tasks_<list>_active_items`
- `sensor.tasks_<list>_completion_percent`
- `sensor.tasks_overdue_items_total`
- `sensor.tasks_sync_status`

### Test Service Call

1. **Developer Tools → Services**
2. Service: `tasks_todo_app.create_item`
3. Data:
```json
{
  "list_id": "test",
  "title": "Test item"
}
```
4. Check frontend - item should appear ✅

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md) | **Choose your method** |
| [INSTALL_FILE_EDITOR_METHOD.md](INSTALL_FILE_EDITOR_METHOD.md) | File Editor step-by-step |
| [INSTALL_HACS_METHOD.md](INSTALL_HACS_METHOD.md) | HACS & GitHub setup |
| [INSTALL_ADDON_AND_INTEGRATION.md](INSTALL_ADDON_AND_INTEGRATION.md) | SSH manual method |
| [QUICK_INSTALL.md](QUICK_INSTALL.md) | Quick reference (2 min) |
| [PHASE_6_IMPLEMENTATION.md](PHASE_6_IMPLEMENTATION.md) | Technical details |
| [PHASE_6_DEFICIENCIES_AUDIT.md](PHASE_6_DEFICIENCIES_AUDIT.md) | What was fixed |

---

## ❓ Common Questions

### Which method is easiest?
**File Editor** - just a web UI, no command line needed.

### Which method is best for long-term?
**HACS** - automatic updates, easier to maintain and share.

### Can I switch methods later?
Yes! You can uninstall and reinstall using a different method.

### Is SSH required?
No - use File Editor or HACS to avoid SSH completely.

### How often should I update?
Updates will be available when fixes or features are released. HACS notifies you automatically.

### Can I contribute or report bugs?
Yes! Issues and pull requests welcome on GitHub (once repo is public).

---

## 🆘 Troubleshooting

### **Addon won't start**
Check logs: **Settings → Add-ons & Services → Tasks Todo App → Logs**

### **Integration not showing**
Did you restart Home Assistant? (Not reload - full restart!)

### **Cannot connect error**
Verify API key matches addon configuration exactly.

### **Sensors say "unavailable"**
Check integration is loaded: **Settings → Devices & Services → Integrations**

[Full troubleshooting guide →](INSTALL_ADDON_AND_INTEGRATION.md#troubleshooting)

---

## 🎯 Next Steps

1. **Choose your installation method** above (File Editor / HACS / SSH)
2. **Follow that guide** step-by-step
3. **Verify installation** (check sensors in Developer Tools)
4. **Test service call** to confirm everything works

---

## 📞 Support

- Check the troubleshooting section in your chosen installation guide
- Review [PHASE_6_DEFICIENCIES_AUDIT.md](PHASE_6_DEFICIENCIES_AUDIT.md) for what was fixed
- Check Home Assistant logs for error messages

---

**Ready? Pick your installation method above and follow the guide!**

- [File Editor Method](INSTALL_FILE_EDITOR_METHOD.md) (Easiest)
- [HACS Method](INSTALL_HACS_METHOD.md) (Recommended)
- [SSH Method](INSTALL_ADDON_AND_INTEGRATION.md) (Advanced)
