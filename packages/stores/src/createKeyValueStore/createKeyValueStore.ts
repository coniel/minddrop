import { StoreApi, UseBoundStore, create } from 'zustand';
import { Events } from '@minddrop/events';
import {
  StoreHydrateEvent,
  StoreHydrateEventData,
  StoreHydrateRequestEvent,
  StoreHydratedEvent,
  StorePersistEvent,
} from '../events';
import { registerStore } from '../storeRegistry';
import { PersistOptions } from '../types';

export interface KeyValueStoreInternalApi<TValues extends Record<string, any>> {
  /**
   * The key-value data.
   */
  values: TValues;

  /**
   * Load values into the store, merging with existing values.
   */
  load(values: Partial<TValues>): void;

  /**
   * Set a single key-value pair.
   */
  set<TKey extends keyof TValues>(key: TKey, value: TValues[TKey]): void;

  /**
   * Reset a single key to its default value, or reset
   * all values to defaults when no key is provided.
   */
  reset(key?: keyof TValues): void;
}

export interface KeyValueStore<TValues extends Record<string, any>> {
  /**
   * The internal Zustand store.
   */
  useStore: UseBoundStore<StoreApi<KeyValueStoreInternalApi<TValues>>>;

  /**
   * Retrieves the value for a given key.
   *
   * @param key - The key to get.
   */
  get<TKey extends keyof TValues>(key: TKey): TValues[TKey];

  /**
   * Returns all key-value pairs.
   */
  getAll(): TValues;

  /**
   * Loads values into the store, merging with existing values.
   * Does not trigger persistence.
   *
   * @param values - The values to load.
   */
  load(values: Partial<TValues>): void;

  /**
   * Requests persisted data from the platform layer by dispatching
   * a `stores:hydrate-request` event, then waits for the platform layer
   * to respond with a `stores:hydrate` event containing the data.
   *
   * Only available when the store is created with `persist` options.
   */
  hydrate(): Promise<void>;

  /**
   * Sets a single key-value pair.
   *
   * @param key - The key to set.
   * @param value - The value to set.
   */
  set<TKey extends keyof TValues>(key: TKey, value: TValues[TKey]): void;

  /**
   * Resets a single key to its default value, or resets
   * all values to defaults when no key is provided.
   *
   * @param key - The key to reset. Omit to reset all values.
   */
  reset(key?: keyof TValues): void;

  /**
   * A hook which returns the value for a given key.
   *
   * @param key - The key to retrieve.
   */
  useValue<TKey extends keyof TValues>(key: TKey): TValues[TKey];

  /**
   * A hook which returns all key-value pairs.
   */
  useAllValues(): TValues;
}

/**
 * Creates a key-value store, providing a simple get/set interface
 * for a typed record of key-value pairs.
 *
 * When `persist` is provided, mutations (set, reset)
 * dispatch a `stores:persist` event so the platform layer can
 * handle writing the data to storage.
 *
 * @param name - The namespaced name for the store registry (e.g. "App:UiState").
 * @param defaults - The default values for the store.
 * @param persist - Optional persistence configuration.
 * @returns The key-value store.
 */
export function createKeyValueStore<TValues extends Record<string, any>>(
  name: string,
  defaults: TValues,
  persist?: PersistOptions,
): KeyValueStore<TValues> {
  const store = create<KeyValueStoreInternalApi<TValues>>()((set) => ({
    values: { ...defaults },

    load: (values) =>
      set((state) => ({
        // Merge loaded values into the store
        values: { ...state.values, ...values },
      })),

    set: (key, value) =>
      set((state) => ({
        values: { ...state.values, [key]: value },
      })),

    reset: (key) =>
      set((state) => {
        // Reset all values to defaults when no key is provided
        if (!key) {
          return { values: { ...defaults } };
        }

        // Reset the key to its default value
        const values = { ...state.values };

        if (key in defaults) {
          values[key] = defaults[key];
        } else {
          delete values[key];
        }

        return { values };
      }),
  }));

  // Resolve callback set by hydrate(), called after data is loaded
  let hydrateResolve: (() => void) | null = null;

  // Listen for hydrate events matching this store's namespace.
  // Handles both the initial hydrate() call and subsequent
  // hydration events (e.g. from file watchers).
  if (persist) {
    Events.addListener<StoreHydrateEventData>(
      StoreHydrateEvent,
      `stores:${persist.namespace}`,
      (event) => {
        if (event.data.namespace !== persist!.namespace) {
          return;
        }

        // Load the persisted data as partial values
        store.getState().load(event.data.data as Partial<TValues>);

        // Notify that the store has been hydrated
        Events.dispatch(StoreHydratedEvent, {
          namespace: persist!.namespace,
        });

        // Resolve the hydrate() promise if one is pending
        if (hydrateResolve) {
          hydrateResolve();
          hydrateResolve = null;
        }
      },
    );
  }

  // Dispatches a persist event with the current store data
  function dispatchPersist(): void {
    if (!persist) {
      return;
    }

    Events.dispatch(StorePersistEvent, {
      persistTo: persist.persistTo,
      namespace: persist.namespace,
      data: store.getState().values,
    });
  }

  // Register the store in the global registry
  registerStore(name, 'key-value', store as UseBoundStore<StoreApi<unknown>>);

  return {
    get: (key) => store.getState().values[key],
    getAll: () => store.getState().values,
    set: (key, value) => {
      store.getState().set(key, value);
      dispatchPersist();
    },
    reset: (key) => {
      store.getState().reset(key);
      dispatchPersist();
    },
    load: (values) => store.getState().load(values),
    hydrate: () => {
      if (!persist) {
        throw new Error('hydrate() called on a store without persist options');
      }

      return new Promise<void>((resolve) => {
        // Store the resolve callback so the persistent hydrate
        // listener can resolve the promise after loading data
        hydrateResolve = resolve;

        // Dispatch a hydrate request for the platform layer
        Events.dispatch(StoreHydrateRequestEvent, {
          persistTo: persist.persistTo,
          namespace: persist.namespace,
        });
      });
    },
    useValue: (key) => store(({ values }) => values[key]),
    useAllValues: () => store().values,
    useStore: store,
  };
}
