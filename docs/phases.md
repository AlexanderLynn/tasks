# Implementation Phases

## Docker Containerization Strategy

Each component should be deployed in its own Docker container where it makes sense:

- **API Server** (Phase 1): Separate container - HTTP REST API service
  - Uses Alpine Node 24 LTS for minimal footprint
  - Exposes port 8080
  - Health check endpoint at /health
  - Database volume mounted at /app/data

- **MCP Server** (Phase 1): Separate container - stdio-based MCP protocol service
  - Uses Alpine Node 24 LTS for minimal footprint
  - Communicates via stdio (typically used by Claude Desktop)
  - Shares database volume with API server
  - Can be run independently or via docker-compose

- **Frontend** (Phase 3-5): Separate container - PWA web application
  - Uses Alpine Node 24 LTS for build
  - Serves static files via nginx or similar
  - Communicates with API container

- **Home Assistant Addon** (Phase 6): Separate container
  - Custom addon structure for Home Assistant
  - Includes both API and MCP server components
  - Managed by Home Assistant supervisor

## Phase 1: Backend Foundation

**Goal**: Set up the core backend infrastructure with database, API, and MCP server.

### Tasks
- [x] Create shared TypeScript types
- [x] Create shared Zod validation schemas
- [x] Set up backend project structure (package.json, tsconfig.json)
- [x] Create database schema (all tables)
- [x] Implement database connection
- [x] Implement migration system
- [x] Create REST API endpoints:
  - [x] Users (create, get current)
  - [x] Lists (CRUD)
  - [x] Items (CRUD, complete, undo)
- [x] Create MCP server with tools
- [x] Implement authentication middleware
- [x] Implement scheduling logic (calculate next due dates)
- [x] Implement audit logging service
- [x] Add proper error handling
- [x] Add input validation middleware
- [x] Test API endpoints
- [x] Test MCP server tools
- [x] Create Dockerfile for API server (Alpine Node 24 LTS)
- [x] Create Dockerfile for MCP server (Alpine Node 24 LTS)
- [x] Create docker-compose.yml for orchestration
- [x] Test Docker build and run

### Success Criteria
- Backend server starts successfully
- Database migrations run without errors
- API endpoints respond correctly
- MCP server tools work via stdio
- Authentication works (API key validation)
- Scheduling calculates correct next due dates
- All operations are logged to audit trail
- Docker containers build successfully
- API container runs and responds to health checks
- MCP container can be invoked via stdio

---

## Phase 2: Scheduling & Business Logic

**Goal**: Implement the core scheduling engine and business logic.

### Tasks
- [x] Implement schedule calculation service
- [x] Handle all schedule types (once, daily, weekly, monthly, custom)
- [x] Implement timezone support
- [x] Add recurrence end date support
- [x] Implement next due date calculation
- [x] Add schedule validation
- [x] Test scheduling edge cases
- [x] Document scheduling behavior

### Success Criteria
- All schedule types calculate correct next due dates
- Timezone handling works correctly
- Recurrence end dates are respected
- Schedule validation prevents invalid configurations

---

## Phase 3: Frontend Foundation

**Goal**: Set up the PWA frontend with Kibana styling.

### Tasks
- [x] Create frontend project structure (package.json, vite.config.ts)
- [x] Set up React + Vite
- [x] Install TailwindCSS
- [x] Create Kibana color theme
- [x] Create base UI components (dark theme)
- [x] Implement swipe gestures library
- [x] Set up PWA manifest
- [x] Set up service worker
- [x] Create routing structure
- [x] Set up state management (Redux or similar)

### Success Criteria
- Frontend builds successfully
- PWA installs on mobile
- Dark theme renders correctly
- Swipe gestures work
- Service worker caches assets

---

## Phase 4: Core Screens

**Goal**: Implement the main UI screens.

### Tasks
- [x] Login screen (API key input)
- [x] Dashboard (list overview, stats)
- [x] List view (items with swipe gestures)
- [x] Item detail view
- [x] Create/edit item form
- [x] Create/edit list form
- [x] Schedule builder UI
- [x] Tag input component
- [x] User sharing UI

### Success Criteria
- All screens navigate correctly
- Forms validate input
- Swipe gestures complete items
- Schedule builder works
- Tags display and filter correctly

---

## Phase 5: Offline Support

**Goal**: Add basic offline functionality.

### Tasks
- [x] Implement local storage for API key
- [x] Implement optimistic UI updates
- [x] Create offline operation queue
- [x] Implement background sync
- [x] Handle sync conflicts
- [x] Add offline indicator
- [x] Test offline scenarios

### Success Criteria
- App works without network
- Operations queue when offline
- Sync completes when online
- Conflicts are handled gracefully

---

## Phase 6: Home Assistant Integration

**Goal**: Create Home Assistant addon and integration.

### Tasks
- [ ] Create addon structure
- [ ] Create Dockerfile
- [ ] Create addon configuration
- [ ] Implement sensor entities
- [ ] Implement service calls
- [ ] Create WebSocket integration
- [ ] Test addon in Home Assistant
- [ ] Document installation

### Success Criteria
- Addon installs in Home Assistant
- Sensors update correctly
- Service calls work
- WebSocket pushes updates

---

## Phase 7: Testing & Polish

**Goal**: Test thoroughly and polish the application.

### Tasks
- [ ] Write unit tests for services
- [ ] Write integration tests for API
- [ ] Test MCP server tools
- [ ] Test PWA on iOS
- [ ] Test PWA on Android
- [ ] Test on tablet
- [ ] Performance optimization
- [ ] Bug fixes
- [ ] Documentation updates

### Success Criteria
- All tests pass
- PWA works on all target platforms
- Performance is acceptable
- Documentation is complete

---

## Current Status

**Phase 1**: 100% complete
- ✅ Foundation structure done
- ✅ Database schema and migrations implemented
- ✅ Authentication middleware implemented
- ✅ Scheduling service implemented (next due date calculation)
- ✅ Audit logging service implemented
- ✅ Error handling middleware implemented
- ✅ Validation middleware implemented
- ✅ All API endpoints updated with middleware and services
- ✅ MCP server implemented and tested
- ✅ Install Node.js dependencies completed
- ✅ Test API endpoints completed (user creation, list creation working)
- ✅ Test MCP server tools completed (server starts successfully, tools defined)
- ✅ Docker containerization completed (API and MCP server in separate Alpine Node 24 LTS containers)

**Phase 2**: 100% complete
- ✅ Schedule calculation service enhanced with recurrence end date support
- ✅ All schedule types handled (once, daily, weekly, monthly, custom)
- ✅ Timezone support implemented using IANA timezone strings
- ✅ Recurrence end date support added to calculation logic
- ✅ Next due date calculation implemented for all schedule types
- ✅ Schedule validation function implemented with comprehensive checks
- ✅ Comprehensive test suite written (37 tests covering validation and calculation)
- ✅ Scheduling behavior documented in docs/scheduling.md

**Phase 3**: 100% complete
- ✅ Frontend project structure created (package.json, vite.config.ts, tsconfig.json)
- ✅ React + Vite set up
- ✅ TailwindCSS installed and configured
- ✅ Kibana color theme created (dark theme colors)
- ✅ Base UI components created (Button, Input, Card, SwipeableItem)
- ✅ Swipe gestures library implemented (react-swipeable)
- ✅ PWA manifest configured (via vite-plugin-pwa)
- ✅ Service worker set up (via vite-plugin-pwa with Workbox)
- ✅ Routing structure created (react-router-dom with protected routes)
- ✅ State management set up (Redux Toolkit with auth, lists, items slices)
- ✅ API service created for backend communication (axios with interceptors)
- ✅ npm dependencies installed
- ✅ Frontend builds successfully (production build tested)
- ✅ Dev server running successfully (tested on localhost:3000)
- ✅ Dark theme rendering verified
- ✅ Routing and navigation tested
- ✅ PWA service worker registration verified

**Phase 4**: 100% complete
- ✅ Login validates API keys against `/api/users/me`
- ✅ Dashboard loads lists and active item stats
- ✅ List view loads items, filters tags, and supports swipe-to-complete
- ✅ Item detail view shows schedule, tags, and completion history
- ✅ Create/edit item form implemented with schedule, tags, assignment, and item sharing fields
- ✅ Create/edit list form implemented
- ✅ Schedule builder UI implemented for once/daily/weekly/monthly/custom schedules
- ✅ Tag input component implemented
- ✅ User sharing UI implemented with REST endpoints for add/update/remove members
- ✅ MCP parity maintained with `share_list`, `set_permissions`, and `remove_list_member`
- ✅ Frontend TypeScript check and Vite production build completed
- ✅ Backend TypeScript build and test suite completed

**Phase 5**: 100% complete
- ✅ Centralized storage service for API key (with legacy key fallback)
- ✅ Local cache for lists, items, and members
- ✅ Offline operation queue persisted in localStorage
- ✅ Optimistic UI updates for create, update, complete, undo, and delete actions
- ✅ Background sync on reconnect and periodic interval via SyncManager
- ✅ Version conflict handling with server refresh and user-facing conflict notices
- ✅ Offline indicator banner for offline mode, pending sync, cached data, and conflicts
- ✅ Vitest suite added (11 tests covering storage, cache, queue, schedule estimates, and sync)
- ✅ Frontend TypeScript check and production build completed
