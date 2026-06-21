import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SyncConflict } from '../../services/offline/types';

interface OfflineState {
  isOnline: boolean;
  pendingCount: number;
  syncing: boolean;
  fromCache: boolean;
  conflicts: SyncConflict[];
  lastSyncedAt: string | null;
}

const initialState: OfflineState = {
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  pendingCount: 0,
  syncing: false,
  fromCache: false,
  conflicts: [],
  lastSyncedAt: null,
};

const offlineSlice = createSlice({
  name: 'offline',
  initialState,
  reducers: {
    setOnline: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    setPendingCount: (state, action: PayloadAction<number>) => {
      state.pendingCount = action.payload;
    },
    setSyncing: (state, action: PayloadAction<boolean>) => {
      state.syncing = action.payload;
    },
    setFromCache: (state, action: PayloadAction<boolean>) => {
      state.fromCache = action.payload;
    },
    addConflicts: (state, action: PayloadAction<SyncConflict[]>) => {
      state.conflicts = [...state.conflicts, ...action.payload];
    },
    dismissConflict: (state, action: PayloadAction<string>) => {
      state.conflicts = state.conflicts.filter((conflict) => conflict.id !== action.payload);
    },
    clearConflicts: (state) => {
      state.conflicts = [];
    },
    setLastSyncedAt: (state, action: PayloadAction<string | null>) => {
      state.lastSyncedAt = action.payload;
    },
  },
});

export const {
  setOnline,
  setPendingCount,
  setSyncing,
  setFromCache,
  addConflicts,
  dismissConflict,
  clearConflicts,
  setLastSyncedAt,
} = offlineSlice.actions;
export default offlineSlice.reducer;
