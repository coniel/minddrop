import { StoreApi, UseBoundStore, create } from 'zustand';
import { Events } from '@minddrop/events';
import {
  StoreLoadEvent,
  StoreLoadEventData,
  StoreLoadRequestEvent,
  StorePersistEvent,
} from '../events';
import { PersistOptions } from '../types';

export interface KeyValueStoreInternalApi<
  TValues extends Record<string, unknown>,
> {
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

export interface KeyValueStore<TValues extends Record<string, unknown>> {
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
   * a `stores:load-request` event. The platform layer responds with
   * a `stores:load` event containing the data.
   *
   * Only available when the store is created with `persist` options.
   */
  loadPersisted(): void;

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
 * @param defaults - The default values for the store.
 * @param persist - Optional persistence configuration.
 * @returns The key-value store.
 */
export function createKeyValueStore<TValues extends Record<string, unknown>>(
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

  // Listen for load events matching this store's namespace
  if (persist) {
    Events.addListener<StoreLoadEventData>(
      StoreLoadEvent,
      `stores:${persist.namespace}`,
      (event) => {
        if (event.data.namespace !== persist!.namespace) {
          return;
        }

        // Load the persisted data as partial values
        store.getState().load(event.data.data as Partial<TValues>);
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
    loadPersisted: () => {
      if (!persist) {
        throw new Error(
          'loadPersisted() called on a store without persist options',
        );
      }

      // Dispatch a load request for the platform layer
      Events.dispatch(StoreLoadRequestEvent, {
        persistTo: persist.persistTo,
        namespace: persist.namespace,
      });
    },
    useValue: (key) => store(({ values }) => values[key]),
    useAllValues: () => store().values,
    useStore: store,
  };
}
