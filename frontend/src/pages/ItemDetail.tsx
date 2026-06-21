import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Archive, Check, ChevronLeft, Edit3, RotateCcw, Trash2 } from 'lucide-react';
import Button from '../components/Button';
import ItemFormModal from '../components/ItemFormModal';
import {
  completeItemOffline,
  deleteItemOffline,
  fetchItemData,
  getOfflinePendingCount,
  undoItemOffline,
  updateItemOffline,
} from '../services/offlineData';
import { Completion } from '../services/itemsApi';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { deleteItem, updateItem, updateItemNextDue } from '../store/slices/itemsSlice';
import { setFromCache, setPendingCount } from '../store/slices/offlineSlice';

const completionTime = (completion: Completion) => completion.completedAt ?? completion.completed_at ?? '';

const ItemDetail = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cachedItem = useAppSelector((state) => state.items.items.find((item) => item.id === itemId));
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [showEdit, setShowEdit] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!itemId) return;
    const load = async () => {
      setError('');
      try {
        const data = await fetchItemData(itemId);
        dispatch(updateItem(data.item));
        if (data.completions) {
          setCompletions(data.completions);
        }
        dispatch(setFromCache(data.fromCache));
        dispatch(setPendingCount(getOfflinePendingCount()));
      } catch (err: any) {
        setError(err?.response?.data?.error?.message ?? 'Unable to load item');
      }
    };
    load();
  }, [dispatch, itemId]);

  const item = cachedItem;
  const activeCompletions = useMemo(() => completions.filter((completion) => !completion.undone), [completions]);

  if (!itemId) {
    return null;
  }

  if (!item && !error) {
    return <div className="min-h-screen bg-kibana-bg p-4 text-kibana-text">Loading item...</div>;
  }

  const complete = async () => {
    if (!item) return;
    const result = await completeItemOffline(item);
    dispatch(updateItemNextDue({ id: itemId, nextDueAt: result.nextDueAt }));
    dispatch(setPendingCount(getOfflinePendingCount()));
  };

  const undo = async () => {
    if (!item) return;
    const result = await undoItemOffline(item);
    dispatch(updateItemNextDue({ id: itemId, nextDueAt: result.nextDueAt }));
    dispatch(setPendingCount(getOfflinePendingCount()));
  };

  const remove = async () => {
    await deleteItemOffline(itemId);
    dispatch(deleteItem(itemId));
    dispatch(setPendingCount(getOfflinePendingCount()));
    navigate(item ? `/lists/${item.listId}` : '/');
  };

  return (
    <div className="min-h-screen bg-kibana-bg p-4 text-kibana-text">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link to={item ? `/lists/${item.listId}` : '/'} className="rounded-md p-2 text-kibana-textSecondary hover:bg-kibana-card hover:text-kibana-text" aria-label="Back">
              <ChevronLeft className="h-6 w-6" />
            </Link>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold">{item?.title ?? 'Item'}</h1>
              {item && <p className="text-sm text-kibana-textSecondary capitalize">{item.type} · {item.status}</p>}
            </div>
          </div>
          {item && (
            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={complete} className="inline-flex items-center gap-2"><Check className="h-4 w-4" /> Complete</Button>
              <Button type="button" variant="secondary" onClick={undo} className="inline-flex items-center gap-2" disabled={activeCompletions.length === 0}>
                <RotateCcw className="h-4 w-4" /> Undo
              </Button>
              <Button type="button" variant="secondary" onClick={() => setShowEdit(true)} className="inline-flex items-center gap-2"><Edit3 className="h-4 w-4" /> Edit</Button>
            </div>
          )}
        </header>

        {error && <p className="mb-4 rounded-md border border-kibana-danger p-3 text-sm text-kibana-danger">{error}</p>}

        {item && (
          <main className="grid gap-5">
            <section className="rounded-lg border border-kibana-border bg-kibana-card p-4">
              {item.description && <p className="mb-4 text-kibana-textSecondary">{item.description}</p>}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase text-kibana-textSecondary">Next due</p>
                  <p className="mt-1 text-sm">{new Date(item.nextDueAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-kibana-textSecondary">Schedule</p>
                  <p className="mt-1 text-sm capitalize">{item.schedule.type} {item.schedule.time ? `at ${item.schedule.time}` : ''}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-kibana-textSecondary">Timezone</p>
                  <p className="mt-1 text-sm">{item.schedule.timezone}</p>
                </div>
              </div>
              {(item.tags ?? []).length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {(item.tags ?? []).map((tag) => (
                    <span key={tag} className="rounded bg-kibana-bg px-2 py-1 text-xs text-kibana-textSecondary">#{tag}</span>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-lg border border-kibana-border bg-kibana-card p-4">
              <h2 className="mb-3 text-lg font-semibold">Completion history</h2>
              <div className="divide-y divide-kibana-border">
                {completions.map((completion) => (
                  <div key={completion.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                    <span>{completionTime(completion) ? new Date(completionTime(completion)).toLocaleString() : 'Unknown time'}</span>
                    <span className={completion.undone ? 'text-kibana-warning' : 'text-kibana-success'}>
                      {completion.undone ? 'Undone' : 'Complete'}
                    </span>
                  </div>
                ))}
                {completions.length === 0 && <p className="py-3 text-sm text-kibana-textSecondary">No completions yet.</p>}
              </div>
            </section>

            <section className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={async () => {
                  if (!item) return;
                  const updated = await updateItemOffline(item.id, { status: 'archived', version: item.version });
                  dispatch(updateItem(updated));
                  dispatch(setPendingCount(getOfflinePendingCount()));
                }}
                className="inline-flex items-center gap-2"
              >
                <Archive className="h-4 w-4" /> Archive
              </Button>
              <Button type="button" variant="danger" onClick={remove} className="inline-flex items-center gap-2">
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </section>
          </main>
        )}
      </div>

      {showEdit && item && (
        <ItemFormModal
          listId={item.listId}
          item={item}
          onClose={() => setShowEdit(false)}
          onSubmit={async (data) => {
            const updated = await updateItemOffline(item.id, {
              title: data.title,
              description: data.description,
              type: data.type,
              schedule: data.schedule,
              tags: data.tags,
              assignedTo: data.assignedTo,
              sharedWith: data.sharedWith,
              version: data.version ?? item.version,
            });
            dispatch(updateItem(updated));
            dispatch(setPendingCount(getOfflinePendingCount()));
          }}
        />
      )}
    </div>
  );
};

export default ItemDetail;
