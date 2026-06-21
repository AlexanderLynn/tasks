const LEGACY_API_KEY = 'apiKey';

const KEYS = {
  API_KEY: 'tasks:apiKey',
  CACHE_LISTS: 'tasks:cache:lists',
  CACHE_ITEMS: 'tasks:cache:items',
  CACHE_MEMBERS: 'tasks:cache:members',
  OFFLINE_QUEUE: 'tasks:offlineQueue',
} as const;

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  getApiKey(): string | null {
    return localStorage.getItem(KEYS.API_KEY) ?? localStorage.getItem(LEGACY_API_KEY);
  },

  setApiKey(apiKey: string): void {
    localStorage.setItem(KEYS.API_KEY, apiKey);
    localStorage.setItem(LEGACY_API_KEY, apiKey);
  },

  removeApiKey(): void {
    localStorage.removeItem(KEYS.API_KEY);
    localStorage.removeItem(LEGACY_API_KEY);
  },

  getCache<T>(key: keyof typeof KEYS): T | null {
    return readJson<T>(KEYS[key]);
  },

  setCache(key: keyof typeof KEYS, value: unknown): void {
    writeJson(KEYS[key], value);
  },

  clearCache(): void {
    localStorage.removeItem(KEYS.CACHE_LISTS);
    localStorage.removeItem(KEYS.CACHE_ITEMS);
    localStorage.removeItem(KEYS.CACHE_MEMBERS);
  },
};

export { KEYS };
