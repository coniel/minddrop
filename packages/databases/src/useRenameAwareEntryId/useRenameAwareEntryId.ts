import { useEffect, useState } from 'react';
import { Events } from '@minddrop/events';
import {
  DatabaseEntryRenamedEvent,
  DatabaseEntryRenamedEventData,
} from '../events';

// Global registry: maps current entry ID to the set of state
// updaters that need to be notified when that entry is renamed.
const registry = new Map<string, Set<(newId: string) => void>>();

const LISTENER_ID = 'databases:rename-aware-entry-id';

/**
 * Registers the global rename event listener. Called lazily on
 * the first hook mount so we never register when the hook is
 * not in use.
 */
function ensureListener(): void {
  if (Events.hasListener(DatabaseEntryRenamedEvent, LISTENER_ID)) {
    return;
  }

  Events.addListener<DatabaseEntryRenamedEventData>(
    DatabaseEntryRenamedEvent,
    LISTENER_ID,
    ({ data }) => {
      const callbacks = registry.get(data.original.id);

      if (!callbacks || callbacks.size === 0) {
        return;
      }

      // Move all callbacks from the old key to the new key
      registry.delete(data.original.id);

      const newSet = registry.get(data.updated.id) ?? new Set();

      for (const callback of callbacks) {
        newSet.add(callback);
      }

      registry.set(data.updated.id, newSet);

      // Notify all subscribers of the new ID
      for (const callback of newSet) {
        callback(data.updated.id);
      }
    },
  );
}

/**
 * Returns a stable entry ID that automatically updates when
 * the entry is renamed.
 *
 * @param entryId - The initial entry ID.
 * @returns The current entry ID (updated after renames).
 */
export function useRenameAwareEntryId(entryId: string): string {
  const [currentId, setCurrentId] = useState(entryId);

  // Sync internal state when the prop changes (e.g. navigation)
  useEffect(() => {
    setCurrentId(entryId);
  }, [entryId]);

  // Register/unregister the callback in the global registry
  useEffect(() => {
    ensureListener();

    const callbacks = registry.get(currentId) ?? new Set();
    callbacks.add(setCurrentId);
    registry.set(currentId, callbacks);

    return () => {
      callbacks.delete(setCurrentId);

      // Clean up the key if no more subscribers
      if (callbacks.size === 0) {
        registry.delete(currentId);
      }
    };
  }, [currentId]);

  return currentId;
}
