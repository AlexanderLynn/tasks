import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, Edit3, Plus } from 'lucide-react';
import Button from '../components/Button';
import ItemFormModal from '../components/ItemFormModal';
import ListFormModal from '../components/ListFormModal';
import SharingPanel from '../components/SharingPanel';
import SwipeableItem from '../components/SwipeableItem';
import {
  addListMemberOffline,
  completeItemOffline,
  createItemOffline,
  fetchListData,
  getOfflinePendingCount,
  removeListMemberOffline,
  updateListMemberOffline,
  updateListOffline,
} from '../services/offlineData';
import { MemberPermission } from '../services/listsApi';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addItem, mergeItems, updateItemNextDue } from '../store/slices/itemsSlice';
import {
  addMember,
  setCurrentList,
  setMembers,
  updateList,
  updateMember,
  removeMember,
} from '../store/slices/listsSlice';
import { setFromCache, setPendingCount } from '../store/slices/offlineSlice';

const ListView = () => {
  const { listId } = useParams<{ listId: string }>();
  const dispatch = useAppDispatch();
  const lists = useAppSelector((state) => state.lists.lists);
  const selectedList = useAppSelector((state) => state.lists.currentList);
  const members = useAppSelector((state) => (listId ? state.lists.members[listId] ?? [] : []));
  const items = useAppSelector((state) => state.items.items);
  const [showItemForm, setShowItemForm] = useState(false);
  const [showListForm, setShowListForm] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [error, setError] = useState('');

  const currentList = lists.find((list) => list.id === listId) ?? (selectedList?.id === listId ? selectedList : undefined);
  const listItems = useMemo(() => {
    return items
      .filter((item) => item.listId === listId && item.status === 'active')
      .filter((item) => !activeTag || (item.tags ?? []).includes(activeTag))
      .sort((a, b) => new Date(a.nextDueAt).getTime() - new Date(b.nextDueAt).getTime());
  }, [activeTag, items, listId]);
  const tags = useMemo(() => {
    return Array.from(new Set(items.filter((item) => item.listId === listId).flatMap((item) => item.tags ?? []))).sort();
  }, [items, listId]);

  useEffect(() => {
    if (!listId) return;
    const load = async () => {
      setError('');
      try {
        const data = await fetchListData(listId);
        dispatch(setCurrentList(data.list));
        dispatch(updateList(data.list));
        dispatch(setMembers({ listId, members: data.members }));
        dispatch(mergeItems(data.items));
        dispatch(setFromCache(data.fromCache));
        dispatch(setPendingCount(getOfflinePendingCount()));
      } catch (err: any) {
        setError(err?.response?.data?.error?.message ?? 'Unable to load list');
      }
    };
    load();
  }, [dispatch, listId]);

  if (!listId) {
    return null;
  }

  if (!currentList && !error) {
    return <div className="min-h-screen bg-kibana-bg p-4 text-kibana-text">Loading list...</div>;
  }

  const completeItem = async (itemId: string) => {
    const item = items.find((entry) => entry.id === itemId);
    if (!item) return;
    const result = await completeItemOffline(item);
    dispatch(updateItemNextDue({ id: itemId, nextDueAt: result.nextDueAt }));
    dispatch(setPendingCount(getOfflinePendingCount()));
  };

  return (
    <div className="min-h-screen bg-kibana-bg p-4 text-kibana-text">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link to="/" className="rounded-md p-2 text-kibana-textSecondary hover:bg-kibana-card hover:text-kibana-text" aria-label="Back">
              <ChevronLeft className="h-6 w-6" />
            </Link>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold">{currentList?.name ?? 'List'}</h1>
              <p className="text-sm text-kibana-textSecondary">{listItems.length} active items</p>
            </div>
          </div>
          <div className="flex gap-2">
            {currentList && (
              <Button type="button" variant="secondary" onClick={() => setShowListForm(true)} className="inline-flex items-center gap-2">
                <Edit3 className="h-4 w-4" /> List
              </Button>
            )}
            <Button type="button" onClick={() => setShowItemForm(true)} className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" /> Item
            </Button>
          </div>
        </header>

        {error && <p className="mb-4 rounded-md border border-kibana-danger p-3 text-sm text-kibana-danger">{error}</p>}

        {tags.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              className={`rounded-md border px-3 py-2 text-sm ${activeTag === null ? 'border-kibana-accent text-kibana-accent' : 'border-kibana-border text-kibana-textSecondary'}`}
            >
              All
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag)}
                className={`rounded-md border px-3 py-2 text-sm ${activeTag === tag ? 'border-kibana-accent text-kibana-accent' : 'border-kibana-border text-kibana-textSecondary'}`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        <div className="grid gap-2">
          {listItems.map((item) => (
            <SwipeableItem key={item.id} onSwipeRight={() => completeItem(item.id)} className="touch-pan-y">
              <Link
                to={`/items/${item.id}`}
                className="grid gap-3 rounded-lg border border-kibana-border bg-kibana-card p-4 transition-colors hover:border-kibana-accent sm:grid-cols-[1fr_auto]"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-lg font-semibold">{item.title}</h2>
                    <span className="rounded bg-kibana-bg px-2 py-1 text-xs capitalize text-kibana-textSecondary">{item.type}</span>
                  </div>
                  {item.description && <p className="mt-1 line-clamp-2 text-sm text-kibana-textSecondary">{item.description}</p>}
                  {(item.tags ?? []).length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(item.tags ?? []).map((tag) => (
                        <span key={tag} className="rounded bg-kibana-bg px-2 py-1 text-xs text-kibana-textSecondary">#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-sm text-kibana-textSecondary sm:text-right">
                  <p>Due {new Date(item.nextDueAt).toLocaleString()}</p>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      completeItem(item.id);
                    }}
                    className="mt-2 rounded-md border border-kibana-success px-3 py-1 text-kibana-success hover:bg-kibana-success hover:text-black"
                  >
                    Complete
                  </button>
                </div>
              </Link>
            </SwipeableItem>
          ))}
          {listItems.length === 0 && (
            <button
              type="button"
              onClick={() => setShowItemForm(true)}
              className="rounded-lg border-2 border-dashed border-kibana-border p-6 text-kibana-textSecondary hover:border-kibana-accent hover:text-kibana-accent"
            >
              Add an item
            </button>
          )}
        </div>

        <div className="mt-8 rounded-lg border border-kibana-border bg-kibana-card p-4">
          <SharingPanel
            members={members}
            onAdd={async (userId: string, permission: MemberPermission) => {
              const member = await addListMemberOffline(listId, userId, permission);
              dispatch(addMember(member));
              dispatch(setPendingCount(getOfflinePendingCount()));
            }}
            onUpdate={async (userId: string, permission: MemberPermission) => {
              const member = await updateListMemberOffline(listId, userId, permission);
              dispatch(updateMember(member));
              dispatch(setPendingCount(getOfflinePendingCount()));
            }}
            onRemove={async (userId: string) => {
              await removeListMemberOffline(listId, userId);
              dispatch(removeMember({ listId, userId }));
              dispatch(setPendingCount(getOfflinePendingCount()));
            }}
          />
        </div>
      </div>

      {showItemForm && (
        <ItemFormModal
          listId={listId}
          onClose={() => setShowItemForm(false)}
          onSubmit={async (data) => {
            const item = await createItemOffline({ ...data, listId });
            dispatch(addItem(item));
            dispatch(setPendingCount(getOfflinePendingCount()));
          }}
        />
      )}

      {showListForm && currentList && (
        <ListFormModal
          list={currentList}
          onClose={() => setShowListForm(false)}
          onSubmit={async (data) => {
            const list = await updateListOffline(currentList.id, { name: data.name, version: data.version ?? currentList.version });
            dispatch(updateList(list));
            dispatch(setPendingCount(getOfflinePendingCount()));
          }}
        />
      )}
    </div>
  );
};

export default ListView;
