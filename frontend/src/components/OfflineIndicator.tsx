import { WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { dismissConflict } from '../store/slices/offlineSlice';

const OfflineIndicator = () => {
  const dispatch = useAppDispatch();
  const { isOnline, pendingCount, syncing, fromCache, conflicts } = useAppSelector((state) => state.offline);

  if (isOnline && pendingCount === 0 && !fromCache && conflicts.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-3xl space-y-2">
      {!isOnline && (
        <div className="flex items-center gap-2 rounded-lg border border-kibana-warning bg-kibana-card px-4 py-3 text-sm text-kibana-warning shadow-lg">
          <WifiOff className="h-4 w-4 shrink-0" />
          <span>You are offline. Changes will sync when connection returns.</span>
        </div>
      )}

      {isOnline && pendingCount > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-kibana-accent bg-kibana-card px-4 py-3 text-sm text-kibana-accent shadow-lg">
          <RefreshCw className={`h-4 w-4 shrink-0 ${syncing ? 'animate-spin' : ''}`} />
          <span>
            {syncing ? 'Syncing offline changes...' : `${pendingCount} change${pendingCount === 1 ? '' : 's'} waiting to sync`}
          </span>
        </div>
      )}

      {fromCache && (
        <div className="flex items-center gap-2 rounded-lg border border-kibana-border bg-kibana-card px-4 py-3 text-sm text-kibana-textSecondary shadow-lg">
          <WifiOff className="h-4 w-4 shrink-0" />
          <span>Showing cached data from your last online session.</span>
        </div>
      )}

      {conflicts.map((conflict) => (
        <div
          key={conflict.id}
          className="flex items-start justify-between gap-3 rounded-lg border border-kibana-danger bg-kibana-card px-4 py-3 text-sm text-kibana-danger shadow-lg"
        >
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{conflict.message}</span>
          </div>
          <button
            type="button"
            onClick={() => dispatch(dismissConflict(conflict.id))}
            className="shrink-0 text-xs uppercase tracking-wide text-kibana-textSecondary hover:text-kibana-text"
          >
            Dismiss
          </button>
        </div>
      ))}
    </div>
  );
};

export default OfflineIndicator;
