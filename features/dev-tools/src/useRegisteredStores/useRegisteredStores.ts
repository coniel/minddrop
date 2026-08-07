import { useSyncExternalStore } from 'react';
import {
  RegisteredStore,
  storeRegistry,
  subscribeToStoreRegistry,
} from '@minddrop/stores';

// The registry is a plain record, so its stores are snapshotted
// into an array which only changes when a store is added
let snapshotKey = '';
let snapshot: RegisteredStore[] = [];

/**
 * Retrieves the registered stores, including those registered
 * after the first render.
 *
 * @returns An array of all registered stores.
 */
export function useRegisteredStores(): RegisteredStore[] {
  return useSyncExternalStore(subscribeToStoreRegistry, getStoresSnapshot);
}

/**
 * Returns the registered stores, reusing the previous array while
 * the registry's contents are unchanged.
 */
function getStoresSnapshot(): RegisteredStore[] {
  const key = Object.keys(storeRegistry).sort().join(',');

  if (key !== snapshotKey) {
    snapshotKey = key;
    snapshot = Object.values(storeRegistry);
  }

  return snapshot;
}
