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
   */
  dispatchPersist(data: PersistedStoreData): void;

  /**
   * Requests the store's persisted data from the platform layer,
   * resolving once it has been loaded.
   */
  hydrate(): Promise<void>;

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
 * @param load - Loads hydrated data into the store.
 * @returns The store's persistence functions.
 */
export function createStorePersistence(
  persist: PersistOptions | undefined,
  load: (data: PersistedStoreData) => void,
): StorePersistence {
  // Resolve callback set by hydrate(), called after data is loaded
  let hydrateResolve: (() => void) | null = null;

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
        load(hydration.data);

        // Notify that the store has been hydrated
        Events.dispatch(StoreHydratedEvent, {
          namespace: persist.namespace,
        });

        // Resolve the hydrate() promise if one is pending
        if (hydrateResolve) {
          hydrateResolve();
          hydrateResolve = null;
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
    dispatchPersist: (data) => {
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
        persistTo: persist.persistTo,
        namespace: persist.namespace,
        data,
      });
    },

    hydrate: () => {
      if (!persist) {
        throw new Error('hydrate() called on a store without persist options');
      }

      return new Promise<void>((resolve) => {
        // Store the resolve callback so the persistent hydrate
        // listener can resolve the promise after loading data.
        hydrateResolve = resolve;

        // Dispatch a hydrate request for the platform layer
        Events.dispatch(StoreHydrateRequestEvent, {
          persistTo: persist.persistTo,
          namespace: persist.namespace,
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
