import { usePersistentStore } from '../usePersistentStore';
import { PersistentStoreScope } from '../types';

/**
 * Clears all data (including data added by other extensions)
 * from a store.
 *
 * @param scope The scope for which to clear the cache.
 */
export function clearCache(scope: PersistentStoreScope): void {
  usePersistentStore.getState().clearScope(scope);
}
