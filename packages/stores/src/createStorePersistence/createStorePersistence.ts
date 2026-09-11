import { Events } from '@minddrop/events';
import {
  StoreHydrateEvent,
  StoreHydrateRequestEvent,
  StoreHydratedEvent,
  StorePersistEvent,
  StorePersistedEvent,
} from '../events';
import { PersistOptions } from '../types';

/**
 * The data a store persists and hydrates from.
 */
export type PersistedStoreData = Record<string, unknown> | unknown[];

export interface StorePersistence {
  /**
   * Dispatches a persist event carrying the store's current data.
   *
   * @param data - The data to persist.
   * @param workspaceId - The workspace whose record the data is, for stores scoped by workspace.
   */
  dispatchPersist(data: PersistedStoreData, workspaceId?: string): void;

  /**
   * Requests the store's persisted data from the platform layer,
   * resolving once it has been loaded.
   *
   * @param workspaceId - The workspace whose record to hydrate, for stores scoped by workspace.
   */
  hydrate(workspaceId?: string): Promise<void>;

  /**
   * Resolves once every dispatched write has been acknowledged by the
   * platform layer, or immediately when there is none to wait for.
   */
  persisted(): Promise<void>;
}

/**
 * Wires a store up to the platform layer that persists it, providing
 * the persist dispatch, the hydrate round trip and the acknowledgement
 * of writes.
 *
 * @param persist - The store's persistence configuration, absent for a store that does not persist.
 * @param load - Loads hydrated data into the store, into the given workspace's record when the hydration carries one.
 * @returns The store's persistence functions.
 */
export function createStorePersistence(
  persist: PersistOptions | undefined,
  load: (data: PersistedStoreData, workspaceId?: string) => void,
): StorePersistence {
  // Resolve callbacks set by hydrate(), keyed by the workspace being
  // hydrated and called after its data is loaded.
  const hydrateResolves = new Map<string, () => void>();

  // Dispatched writes not yet acknowledged by the platform layer
  let pendingWrites = 0;

  // Resolve callbacks set by persisted(), called once no write is pending
  let persistedResolves: (() => void)[] = [];

  // Listen for hydrate and persisted events matching this store's
  // namespace. Hydrate handles both the initial hydrate() call and
  // subsequent hydration events (e.g. from file watchers).
  if (persist) {
    Events.addListener(
      StoreHydrateEvent,
      `stores:${persist.namespace}`,
      (hydration) => {
        if (hydration.namespace !== persist.namespace) {
          return;
        }

        // Load the persisted data
        load(hydration.data, hydration.workspaceId);

        // Notify that the store has been hydrated
        Events.dispatch(StoreHydratedEvent, {
          namespace: persist.namespace,
        });

        // Resolve the hydrate() promise if one is pending for the
        // hydrated workspace.
        const key = hydrationKey(hydration.workspaceId);
        const resolve = hydrateResolves.get(key);

        if (resolve) {
          hydrateResolves.delete(key);
          resolve();
        }
      },
    );

    Events.addListener(
      StorePersistedEvent,
      `stores:${persist.namespace}:persisted`,
      (acknowledgement) => {
        if (acknowledgement.namespace !== persist.namespace) {
          return;
        }

        pendingWrites = Math.max(0, pendingWrites - 1);

        // Resolve the persisted() promises once the last write lands
        if (pendingWrites === 0) {
          persistedResolves.forEach((resolve) => resolve());
          persistedResolves = [];
        }
      },
    );
  }

  return {
    dispatchPersist: (data, workspaceId) => {
      if (!persist) {
        return;
      }

      // A write is only awaited when a platform layer is listening for
      // it. Without one nothing will ever acknowledge it, and
      // persisted() would wait forever.
      if (Events.hasListener(StorePersistEvent)) {
        pendingWrites += 1;
      }

      Events.dispatch(StorePersistEvent, {
        target: persist.target,
        namespace: persist.namespace,
        workspaceId,
        data,
      });
    },

    hydrate: (workspaceId) => {
      if (!persist) {
        throw new Error('hydrate() called on a store without persist options');
      }

      return new Promise<void>((resolve) => {
        // Store the resolve callback so the persistent hydrate
        // listener can resolve the promise after loading data.
        hydrateResolves.set(hydrationKey(workspaceId), resolve);

        // Dispatch a hydrate request for the platform layer
        Events.dispatch(StoreHydrateRequestEvent, {
          target: persist.target,
          namespace: persist.namespace,
          workspaceId,
        });
      });
    },

    persisted: () => {
      if (pendingWrites === 0) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        persistedResolves.push(resolve);
      });
    },
  };
}

/**
 * Returns the key under which a workspace's pending hydration is
 * tracked, a hydration of an unscoped store having no workspace.
 */
function hydrationKey(workspaceId: string | undefined): string {
  return workspaceId ?? '';
}
