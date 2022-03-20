import { Core } from '@minddrop/core';
import { PersistentStoreScope } from '../types';
import { usePersistentStore } from '../usePersistentStore';

/**
 * Returns an object containing all of the data stored
 * by an extension in a store scope.
 *
 * @param scope The scope from which to retrieve the store.
 * @param core A MindDrop core instance.
 * @returns Extension's global store data.
 */
export function getStore<T>(scope: PersistentStoreScope, core: Core): T {
  const store = usePersistentStore.getState()[scope].data[core.extensionId];

  return (store || {}) as T;
}
