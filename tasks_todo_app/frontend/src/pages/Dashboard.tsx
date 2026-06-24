import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, KeyRound, Plus } from 'lucide-react';
import Button from '../components/Button';
import ApiKeyModal from '../components/ApiKeyModal';
import ListFormModal from '../components/ListFormModal';
import { fetchDashboardData, createListOffline, getOfflinePendingCount } from '../services/offlineData';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { mergeItems } from '../store/slices/itemsSlice';
import { addList, setError, setLists, setLoading } from '../store/slices/listsSlice';
import { logout } from '../store/slices/authSlice';
import { setFromCache, setPendingCount } from '../store/slices/offlineSlice';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const lists = useAppSelector((state) => state.lists.lists);
  const members = useAppSelector((state) => state.lists.members);
  const items = useAppSelector((state) => state.items.items);
  const loading = useAppSelector((state) => state.lists.loading);
  const error = useAppSelector((state) => state.lists.error);
  const [showCreate, setShowCreate] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    const load = async () => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        const data = await fetchDashboardData();
        dispatch(setLists({ lists: data.lists, members: data.members }));
        dispatch(mergeItems(data.items));
        dispatch(setFromCache(data.fromCache));
        dispatch(setPendingCount(getOfflinePendingCount()));
      } catch (err: any) {
        dispatch(setError(err?.response?.data?.error?.message ?? 'Unable to load dashboard'));
      } finally {
        dispatch(setLoading(false));
      }
    };
    load();
  }, [dispatch]);

  const stats = useMemo(() => {
    const active = items.filter((item) => item.status === 'active');
    const due = active.filter((item) => new Date(item.nextDueAt).getTime() <= Date.now());
    return { lists: lists.length, active: active.length, due: due.length };
  }, [items, lists.length]);

  return (
    <div className="min-h-screen bg-kibana-bg p-4 text-kibana-text">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="mt-1 text-sm text-kibana-textSecondary">{stats.due} due now across {stats.active} active items</p>
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" /> List
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowApiKey(true)} className="inline-flex items-center gap-2">
              <KeyRound className="h-4 w-4" /> API key
            </Button>
            <Button type="button" variant="secondary" onClick={() => dispatch(logout())} className="inline-flex items-center gap-2">
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </header>

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {[
            ['Lists', stats.lists],
            ['Active', stats.active],
            ['Due', stats.due],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-kibana-border bg-kibana-card p-4">
              <p className="text-sm text-kibana-textSecondary">{label}</p>
              <p className="mt-1 text-2xl font-semibold">{value}</p>
            </div>
          ))}
        </div>

        {error && <p className="mb-4 rounded-md border border-kibana-danger p-3 text-sm text-kibana-danger">{error}</p>}
        {loading && <p className="text-sm text-kibana-textSecondary">Loading lists...</p>}

        <div className="grid gap-3">
          {lists.map((list) => {
            const listItems = items.filter((item) => item.listId === list.id && item.status === 'active');
            const dueCount = listItems.filter((item) => new Date(item.nextDueAt).getTime() <= Date.now()).length;
            return (
              <Link
                key={list.id}
                to={`/lists/${list.id}`}
                className="grid gap-3 rounded-lg border border-kibana-border bg-kibana-card p-4 transition-colors hover:border-kibana-accent sm:grid-cols-[1fr_auto]"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-xl font-semibold">{list.name}</h2>
                    <span className="rounded bg-kibana-bg px-2 py-1 text-xs capitalize text-kibana-textSecondary">{list.type}</span>
                  </div>
                  <p className="mt-2 text-sm text-kibana-textSecondary">{members[list.id]?.length ?? 0} members</p>
                </div>
                <div className="flex gap-3 text-sm text-kibana-textSecondary sm:text-right">
                  <span>{listItems.length} active</span>
                  <span className={dueCount ? 'text-kibana-warning' : ''}>{dueCount} due</span>
                </div>
              </Link>
            );
          })}
          {!loading && lists.length === 0 && (
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="rounded-lg border-2 border-dashed border-kibana-border p-6 text-kibana-textSecondary hover:border-kibana-accent hover:text-kibana-accent"
            >
              Create your first list
            </button>
          )}
        </div>
      </div>

      {showApiKey && <ApiKeyModal onClose={() => setShowApiKey(false)} />}

      {showCreate && (
        <ListFormModal
          onClose={() => setShowCreate(false)}
          onSubmit={async (data) => {
            const list = await createListOffline({ name: data.name, type: data.type });
            dispatch(addList(list));
            dispatch(setPendingCount(getOfflinePendingCount()));
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
