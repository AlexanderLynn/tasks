# Tasks Repository - Addon & Integration Troubleshooting Guide

## Summary of Issues & Fixes

### 1. ✅ **FIXED: Addon Dockerfile Build Error**
**Problem**: The Dockerfile was trying to use files before copying them, causing build failures.

**Fix Applied**: Converted to multi-stage build:
- **Builder stage**: Copies source, installs all dependencies, and compiles TypeScript
- **Runtime stage**: Only copies compiled code and installs production dependencies (smaller image)

**Status**: Ready to build and install

---

### 2. ⚠️ **HACS Integration Repository Compliance Error**
**Error**: "Repository structure for main is not compliant"

**Fixes Applied**:
- ✅ Updated manifest.json with correct documentation URL (tasks-integration repo)
- ✅ Downgraded Home Assistant version requirement from 2026.6.0 → 2024.1.0 (HACS compatibility)
- ✅ Added `py.typed` marker file (required for proper typing support)

**What HACS expects** (your structure is correct):
```
tasks-integration/
├── hacs.json                    ✅
├── README.md                    ✅
├── LICENSE                      ✅
├── tasks_todo_app/
│   ├── __init__.py             ✅
│   ├── manifest.json           ✅ (fixed)
│   ├── config_flow.py          ✅
│   ├── api.py                  ✅
│   ├── entity.py               ✅
│   ├── sensor.py               ✅
│   ├── services.py             ✅
│   ├── strings.json            ✅
│   ├── const.py                ✅
│   └── py.typed                ✅ (added)
```

**Next Steps for HACS**:
1. **Commit and push** these changes to the tasks-integration repository:
   ```bash
   cd /Users/alexanderlynn/Desktop/tasks-integration
   git add -A
   git commit -m "Fix HACS compatibility: update manifest and add py.typed"
   git push origin main
   ```

2. **Wait 5-10 minutes** for GitHub to index the changes

3. **Re-add to HACS** (in Home Assistant):
   - Settings → Devices & Services → HACS
   - Click **⋮** → **Custom repositories**
   - Remove the old entry and re-add it
   - Category: **Integration**

---

### 3. ✅ **FIXED: Addon Repository URLs**
**Problem**: addon.yaml was pointing to wrong GitHub repositories

**Fixed**:
- ✅ Updated all URLs to point to tasks-addon repository
- ✅ Updated issue tracker URL

---

## Important: Docker Compose & Your App Architecture

### **Can the addon run docker-compose?**
**Short Answer**: No, but it doesn't need to.

**Why?**
- Home Assistant addons run in a **sandboxed container environment** that doesn't support nested docker-compose
- Your main app requires 3 services (API, MCP, Frontend) that would normally run together
- **The addon only needs the API service** (your backend)

### **Architecture Solution**

Your setup has **two deployment models**:

#### **Model 1: Standalone Docker Compose** (Development/Full Setup)
```
Main tasks/ directory
├── docker-compose.yml  ← Runs all 3 services
│   ├── api:8080
│   ├── mcp:3000
│   └── frontend:80
```
- Perfect for development or running on a separate machine
- Run with: `docker-compose up`

#### **Model 2: Home Assistant Addon** (Home Assistant Native)
```
Addon (tasks-addon) → runs ONLY the backend API
Integration (tasks-integration) → Python code that talks to the API
```
- The **addon container** runs your Node.js backend on port 8080
- The **integration** provides Home Assistant sensors and service calls
- The **frontend** would need to be accessed directly (or run separately)

---

## What You Need to Do

### **Step 1: Update Both Repositories**

```bash
# Update tasks-addon
cd /Users/alexanderlynn/Desktop/tasks-addon
git add -A
git commit -m "Fix Dockerfile multi-stage build and repository URLs"
git push origin main

# Update tasks-integration  
cd /Users/alexanderlynn/Desktop/tasks-integration
git add -A
git commit -m "Fix HACS compatibility: update manifest, downgrade HA version, add py.typed"
git push origin main
```

### **Step 2: Test the Addon Installation**

In Home Assistant:
1. Go to **Settings** → **Add-ons** → **⋮** menu (top right)
2. Click **Check for updates** (forces GitHub re-scan)
3. Go to **Create Addon** → **My Add-ons** → **Tasks Todo App**
4. Click **Install** and wait for the build to complete

### **Step 3: Configure the Addon**

After installation:
1. Open the addon configuration
2. Set your **API Key** (change from the default!)
3. Set your **Timezone**
4. Toggle **MCP Server** if needed (default: off)

### **Step 4: Add the Integration**

After addon is running:
1. Go to **Settings** → **Devices & Services** → **Create Integration** (blue button)
2. Search for "Tasks Todo App"
3. Enter:
   - **Host**: `localhost` (if addon) or your IP if external
   - **Port**: `8080`
   - **API Key**: (match what you set in addon config)

---

## If You Need Full Docker Compose in Home Assistant

**Option A**: Run the main app **separately** and point the addon to it
- Run `docker-compose up` on another machine/port
- Configure addon/integration to connect to that external API

**Option B**: Create a **Home Assistant docker-compose** setup
- Run Home Assistant itself in docker-compose
- The addon will still run the API, but you could add the frontend as another service

---

## Verification Checklist

- [ ] Fixed Dockerfile multi-stage build
- [ ] Fixed addon.yaml URLs
- [ ] Fixed integration manifest.json
- [ ] Added py.typed to integration
- [ ] Pushed changes to both repos
- [ ] Waited 5-10 minutes for GitHub indexing
- [ ] Reinstalled addon in Home Assistant
- [ ] Addon started successfully and API is listening on 8080
- [ ] Added integration with correct credentials
- [ ] Integration shows sensors in Home Assistant

---

## File Changes Summary

### tasks-addon/Dockerfile
- Changed from: Single-stage build (failed)
- Changed to: Multi-stage build with separate builder/runtime

### tasks-addon/addon.yaml
- Updated URLs from `tasks` repo → `tasks-addon` repo

### tasks-integration/tasks_todo_app/manifest.json
- Updated documentation URL
- Downgraded homeassistant from 2026.6.0 → 2024.1.0
- Updated issue_tracker URL

### tasks-integration/tasks_todo_app/py.typed
- Added (new empty file for typing support)
