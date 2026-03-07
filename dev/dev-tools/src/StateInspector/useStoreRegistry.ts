import { useMemo, useSyncExternalStore } from 'react';
import { RegisteredStore, storeRegistry } from '@minddrop/stores';

/**
 * A group of stores sharing the same namespace prefix.
 */
export interface StoreGroup {
  /**
   * The namespace label (part before ':').
   */
  label: string;

  /**
   * The stores in this group.
   */
  stores: RegisteredStore[];
}

/**
 * Returns all registered stores grouped by namespace,
 * re-rendering when the registry contents change.
 */
export function useStoreGroups(): StoreGroup[] {
  // Snapshot the registry keys so React can detect changes
  const registrySnapshot = useSyncExternalStore(
    subscribeToRegistry,
    getRegistrySnapshot,
  );

  return useMemo(() => {
    const stores = Object.values(storeRegistry);
    const groupMap = new Map<string, RegisteredStore[]>();

    for (const store of stores) {
      const colonIndex = store.name.indexOf(':');
      const namespace =
        colonIndex >= 0 ? store.name.slice(0, colonIndex) : store.name;

      if (!groupMap.has(namespace)) {
        groupMap.set(namespace, []);
      }

      groupMap.get(namespace)!.push(store);
    }

    return Array.from(groupMap.entries()).map(([label, groupStores]) => ({
      label,
      stores: groupStores,
    }));
  }, [registrySnapshot]);
}

/**
 * Returns the item count for a given registered store.
 */
export function useStoreItemCount(store: RegisteredStore): number {
  const state = store.useStore() as Record<string, unknown>;

  if (store.type === 'key-value') {
    const values = state.values as Record<string, unknown>;

    return Object.keys(values).length;
  }

  if (store.type === 'array') {
    return (state.items as unknown[])?.length ?? 0;
  }

  if (store.type === 'object') {
    return Object.keys(state.items as Record<string, unknown>).length;
  }

  return 0;
}

// Simple snapshot-based subscription for the registry.
// Since stores are typically registered at module load time,
// this primarily handles the initial render.
let lastSnapshot = '';

function getRegistrySnapshot(): string {
  const current = Object.keys(storeRegistry).sort().join(',');

  if (current !== lastSnapshot) {
    lastSnapshot = current;
  }

  return lastSnapshot;
}

function subscribeToRegistry(callback: () => void): () => void {
  // Poll for registry changes (stores register at module init)
  const interval = setInterval(() => {
    const current = Object.keys(storeRegistry).sort().join(',');

    if (current !== lastSnapshot) {
      callback();
    }
  }, 500);

  return () => clearInterval(interval);
}
