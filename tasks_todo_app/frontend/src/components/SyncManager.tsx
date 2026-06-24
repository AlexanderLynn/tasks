import { useEffect, useRef } from 'react';
import { getOfflinePendingCount, runBackgroundSync } from '../services/offlineData';
import { loadCachedData } from '../services/offline/cache';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useAppDispatch } from '../store/hooks';
import { mergeItems } from '../store/slices/itemsSlice';
import { setLists } from '../store/slices/listsSlice';
import {
  addConflicts,
  setLastSyncedAt,
  setPendingCount,
  setSyncing,
} from '../store/slices/offlineSlice';

const SyncManager = () => {
  const dispatch = useAppDispatch();
  const isOnline = useOnlineStatus();
  const syncingRef = useRef(false);

  useEffect(() => {
    dispatch(setPendingCount(getOfflinePendingCount()));
  }, [dispatch, isOnline]);

  useEffect(() => {
    if (!isOnline) {
      return;
    }

    const sync = async () => {
      if (syncingRef.current) {
        return;
      }

      syncingRef.current = true;
      dispatch(setSyncing(true));
      try {
        const result = await runBackgroundSync();
        dispatch(setPendingCount(getOfflinePendingCount()));
        if (result.conflicts.length > 0) {
          dispatch(addConflicts(result.conflicts));
        }
        if (result.synced > 0) {
          dispatch(setLastSyncedAt(new Date().toISOString()));
          const cached = loadCachedData();
          if (cached) {
            dispatch(setLists({ lists: cached.lists, members: cached.members }));
            dispatch(mergeItems(cached.items));
          }
        }
      } finally {
        syncingRef.current = false;
        dispatch(setSyncing(false));
      }
    };

    void sync();
    const interval = window.setInterval(() => {
      if (navigator.onLine) {
        void sync();
      }
    }, 30000);

    return () => {
      window.clearInterval(interval);
    };
  }, [dispatch, isOnline]);

  return null;
};

export default SyncManager;
