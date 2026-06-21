import type { Item } from '../itemsApi';
import type { List, ListMember } from '../listsApi';
import { storage } from '../storage';
import type { CachedData } from './types';

export function loadCachedData(): CachedData | null {
  const lists = storage.getCache<List[]>('CACHE_LISTS');
  const items = storage.getCache<Item[]>('CACHE_ITEMS');
  const members = storage.getCache<Record<string, ListMember[]>>('CACHE_MEMBERS');

  if (!lists || !items) {
    return null;
  }

  return {
    lists,
    items,
    members: members ?? {},
    cachedAt: new Date().toISOString(),
  };
}

export function saveCachedData(data: Omit<CachedData, 'cachedAt'>): void {
  storage.setCache('CACHE_LISTS', data.lists);
  storage.setCache('CACHE_ITEMS', data.items);
  storage.setCache('CACHE_MEMBERS', data.members);
}

export function upsertList(list: List, members?: ListMember[]): void {
  const cached = loadCachedData() ?? { lists: [], items: [], members: {}, cachedAt: new Date().toISOString() };
  const lists = [...cached.lists.filter((entry) => entry.id !== list.id), list];
  const nextMembers = { ...cached.members };
  if (members) {
    nextMembers[list.id] = members;
  }
  saveCachedData({ lists, items: cached.items, members: nextMembers });
}

export function removeList(listId: string): void {
  const cached = loadCachedData();
  if (!cached) return;
  const { [listId]: _, ...members } = cached.members;
  saveCachedData({
    lists: cached.lists.filter((list) => list.id !== listId),
    items: cached.items.filter((item) => item.listId !== listId),
    members,
  });
}

export function upsertItem(item: Item): void {
  const cached = loadCachedData() ?? { lists: [], items: [], members: {}, cachedAt: new Date().toISOString() };
  const items = [...cached.items.filter((entry) => entry.id !== item.id), item];
  saveCachedData({ lists: cached.lists, items, members: cached.members });
}

export function removeItem(itemId: string): void {
  const cached = loadCachedData();
  if (!cached) return;
  saveCachedData({
    lists: cached.lists,
    items: cached.items.filter((item) => item.id !== itemId),
    members: cached.members,
  });
}

export function replaceTempId(tempId: string, realId: string, type: 'list' | 'item'): void {
  const cached = loadCachedData();
  if (!cached) return;

  if (type === 'list') {
    saveCachedData({
      lists: cached.lists.map((list) => (list.id === tempId ? { ...list, id: realId } : list)),
      items: cached.items.map((item) => (item.listId === tempId ? { ...item, listId: realId } : item)),
      members: Object.fromEntries(
        Object.entries(cached.members).map(([listId, members]) => [
          listId === tempId ? realId : listId,
          members.map((member) => (member.listId === tempId ? { ...member, listId: realId } : member)),
        ])
      ),
    });
    return;
  }

  saveCachedData({
    lists: cached.lists,
    items: cached.items.map((item) => (item.id === tempId ? { ...item, id: realId } : item)),
    members: cached.members,
  });
}
