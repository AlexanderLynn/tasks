# MVP Scope

Minimum Viable Product scope for the Habit & Chore Tracker.

## MVP Goals

Create a functional, AI-ready habit and chore tracker that:
- Works as a PWA on iOS, Android, and tablets
- Includes a fully functional MCP server
- Supports Home Assistant integration from day one
- Uses Kibana-inspired styling with TickTick UX patterns
- Implements core data models with history tracking
- Supports habit sharing (whole list or individual items)
- Supports grouping (tags for room/category organization)
- Provides basic offline support
- Keeps implementation simple and stable

## MVP Features

### Backend (Included)

**Core API:**
- User authentication (API key based)
- CRUD operations for items (habits/chores/tasks)
- CRUD operations for lists (personal and shared)
- Item sharing (share individual items with other users)
- Item grouping (tags for room/category organization)
- Basic scheduling (daily, weekly, monthly)
- Completion tracking with undo support
- Audit logging for all actions

**MCP Server:**
- All query tools (list_items, get_item, list_completions, get_next_due, search_items)
- All action tools (create_item, update_item, delete_item, complete_item, undo_completion)
- List management tools (list_lists, create_list)
- API key authentication
- Permission enforcement

**Database:**
- SQLite with complete schema
- All tables: users, lists, items, completions, audit_log
- Indexes for performance
- Migration system

**Home Assistant Integration:**
- REST API accessible
- MCP server on separate port
- WebSocket for real-time updates
- Basic sensor entities (next_due, completion_rate)
- Basic service calls (complete_item, create_item, undo_completion)

### Frontend (PWA with EUI)

**Core Screens:**
1. **Login Screen**
   - Simple API key input
   - Remember me option

2. **Dashboard**
   - List of all personal lists
   - "Create new list" button
   - Quick stats (items due today, completion rate)

3. **List View**
   - Items in the list
   - Filter by type (habit/chore/task)
   - Sort by due date, title, or type
   - "Add new item" button

4. **Item Detail**
   - Item title and description
   - Schedule information
   - Next due date
   - Completion history
   - "Complete" button
   - "Undo" button (if last completion)
   - Edit button

5. **Create/Edit Item**
   - Title input
   - Description textarea
   - Type selector (habit/chore/task)
   - Tags input (for grouping: kitchen, bedroom, daily, etc.)
   - Share with users (individual item sharing)
   - Schedule builder:
     - Type selector (once/daily/weekly/monthly)
     - Day selector (for weekly)
     - Date selector (for monthly)
     - Time picker
     - Timezone selector
   - Save/Cancel buttons

6. **Create/Edit List**
   - Name input
   - Type selector (personal or shared)
   - Share with users (for shared lists)
   - Save/Cancel buttons

**Offline Support (Basic):**
- Local storage for API key
- Optimistic UI updates for completions
- Queue for offline operations (add, complete)
- Background sync when connection restored

**PWA Features:**
- Service worker for offline caching
- Manifest file for installability
- Responsive design for mobile/tablet
- Touch-friendly UI

### UI/UX with Kibana Styling + TickTick UX

**Design Philosophy:**
- Kibana-inspired dark theme with Elastic's color palette
- TickTick-inspired swipe gestures and quick actions
- Clean, data-focused interface
- High contrast for readability
- Touch-friendly tap targets (min 44px)
- Swipe-to-complete on items (TickTick style)
- Swipe-left for more options (edit, delete, share)

**Color Scheme (Kibana-inspired):**
- Background: #1B1B1B (dark gray)
- Surface: #2C2C2C (lighter gray)
- Primary: #006BB4 (Elastic blue)
- Accent: #F5A623 (Elastic orange)
- Success: #017D73 (Elastic green)
- Danger: #BD271E (Elastic red)
- Warning: #F5A623 (Elastic yellow)
- Text: #DADADA (light gray)
- Text-muted: #989898 (muted gray)
- Border: #444444 (border gray)

**Typography:**
- Font: Inter or system-ui
- Headings: Bold, 24px-32px
- Body: Regular, 14px-16px
- Small: Regular, 12px
- Monospace: For dates/times

**TickTick-Inspired Interactions:**
- Swipe right on item to complete
- Swipe left on item for actions (edit, delete, share)
- Pull to refresh
- Quick add button (floating action button)
- Slide-out panels for item details
- Bottom sheet for quick actions

**Core Components (Custom, Kibana-styled):**
- Dark-themed cards with subtle borders
- High-contrast badges for item types
- Swipeable list items
- Floating action button for quick add
- Bottom navigation
- Slide-out panels
- Modal dialogs for forms
- Tag chips for grouping
- User avatars with initials
- Progress indicators
- Empty states with illustrations

**Layout Patterns:**
- Dashboard with grouped items by tags
- List view with swipeable items
- Detail view with slide-out panel
- Form modals with dark theme
- Tag-based filtering (pill selectors)
- Grouped sections (by room, category, etc.)

### What's NOT in MVP

**Deferred to Future Phases:**
- Role-based permissions (admin/member/viewer beyond basic sharing)
- Advanced scheduling (custom intervals, multiple days)
- Time-based scheduling
- Push notifications
- Email reminders
- Streak tracking
- Activity feed
- Export data
- Undo for create/update/delete (only undo for completion)
- Advanced offline handling (conflict resolution)
- Backup/restore
- Home Assistant Lovelace custom card
- Headless mode optimization
- Performance optimization
- Advanced search
- Subtasks
- Attachments
- Comments
- Recurrence end dates
- Skip occurrences
- Statistics and analytics
- Gamification features

## MVP Technical Implementation

### Project Structure

```
/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Entry point
│   │   ├── api/
│   │   │   ├── items.ts          # Item endpoints
│   │   │   ├── lists.ts          # List endpoints
│   │   │   ├── completions.ts    # Completion endpoints
│   │   │   ├── users.ts          # User endpoints
│   │   │   └── search.ts         # Search endpoint
│   │   ├── mcp/
│   │   │   ├── index.ts          # MCP server entry
│   │   │   ├── tools.ts          # MCP tool definitions
│   │   │   └── handlers.ts       # MCP tool handlers
│   │   ├── db/
│   │   │   ├── connection.ts     # SQLite connection
│   │   │   ├── migrations.ts     # Migration runner
│   │   │   └── queries.ts        # SQL queries
│   │   ├── services/
│   │   │   ├── item.service.ts   # Item business logic
│   │   │   ├── list.service.ts   # List business logic
│   │   │   ├── schedule.service.ts  # Scheduling logic
│   │   │   └── audit.service.ts  # Audit logging
│   │   ├── middleware/
│   │   │   ├── auth.ts           # Authentication middleware
│   │   │   ├── validation.ts     # Validation middleware
│   │   │   └── errors.ts         # Error handling
│   │   └── types/
│   │       └── index.ts          # TypeScript types
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── main.tsx              # Entry point
│   │   ├── App.tsx               # Root component
│   │   ├── components/
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ListView.tsx
│   │   │   ├── ItemCard.tsx
│   │   │   ├── ItemDetail.tsx
│   │   │   ├── ItemForm.tsx
│   │   │   ├── ListForm.tsx
│   │   │   └── ScheduleBuilder.tsx
│   │   ├── services/
│   │   │   ├── api.ts            # API client
│   │   │   ├── auth.ts           # Auth service
│   │   │   └── sync.ts           # Offline sync
│   │   ├── store/
│   │   │   ├── index.ts          # Redux store
│   │   │   ├── items.slice.ts    # Items state
│   │   │   ├── lists.slice.ts    # Lists state
│   │   │   └── sync.slice.ts     # Sync state
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript types
│   │   └── utils/
│   │       ├── offline.ts        # Offline utilities
│   │       └── date.ts           # Date utilities
│   ├── public/
│   │   ├── manifest.json         # PWA manifest
│   │   └── sw.js                 # Service worker
│   ├── package.json
│   └── vite.config.ts
├── shared/
│   ├── types/
│   │   └── index.ts              # Shared TypeScript types
│   └── schemas/
│       └── index.ts              # Shared Zod schemas
└── docs/                         # Documentation
```

### Development Workflow

1. **Setup shared types and schemas** (foundation)
2. **Implement backend with SQLite** (data layer)
3. **Implement REST API** (backend endpoints)
4. **Implement MCP server** (AI integration)
5. **Implement frontend with EUI** (PWA UI)
6. **Add offline support** (PWA features)
7. **Test end-to-end** (QA)
8. **Deploy as Home Assistant addon** (integration)

### Estimated Timeline

- **Week 1**: Shared types, backend setup, database schema
- **Week 2**: REST API, MCP server, scheduling logic
- **Week 3**: Frontend setup, EUI integration, core screens
- **Week 4**: Offline support, PWA features, testing
- **Week 5**: Home Assistant addon, documentation, polish

**Total: 5 weeks for MVP**

## Success Criteria

MVP is successful when:
- User can create personal lists
- User can add habits/chores/tasks with basic scheduling
- User can complete items and see next due date
- User can undo completions
- PWA works offline for basic operations
- MCP server exposes all tools for AI agents
- Home Assistant can query and control via API
- Data persists correctly with audit trail
- UI is responsive and touch-friendly

## Next Steps After MVP

1. Add shared lists and family sharing
2. Implement advanced scheduling
3. Add notifications (push/email)
4. Create Home Assistant Lovelace custom card
5. Add streak tracking and gamification
6. Implement advanced offline handling
7. Add statistics and analytics
8. Optimize performance
