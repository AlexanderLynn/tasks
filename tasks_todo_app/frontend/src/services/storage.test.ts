import { describe, expect, it } from 'vitest';
import { storage } from './storage';

describe('storage', () => {
  it('stores and reads the API key', () => {
    storage.setApiKey('secret-key');
    expect(storage.getApiKey()).toBe('secret-key');
  });

  it('falls back to the legacy API key location', () => {
    localStorage.setItem('apiKey', 'legacy-key');
    expect(storage.getApiKey()).toBe('legacy-key');
  });

  it('clears cached data on logout cleanup', () => {
    storage.setCache('CACHE_LISTS', [{ id: 'list-1' }]);
    storage.clearCache();
    expect(storage.getCache('CACHE_LISTS')).toBeNull();
  });
});
