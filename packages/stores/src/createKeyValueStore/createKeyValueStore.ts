import { StoreApi, UseBoundStore, create } from 'zustand';
import { createStorePersistence } from '../createStorePersistence';
import { createStoreRecords } from '../createStoreRecords';
import { RegisteredStoreType, registerStore } from '../storeRegistry';
import { StoreOptions, WorkspaceScopedStoreOptions } from '../types';

/**
 * The values a key-value store holds.
 *
 * Constrained with `any` rather than `unknown` because a plain interface is
 * not assignable to an index signature of `unknown` unless it declares one
 * itself, which would force every store's values interface to add one.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StoreValues = Record<string, any>;

export interface KeyValueStoreInternalApi<TValues extends StoreValues> {
  /**
   * The key-value data. On a store scoped by workspace, the active
   * workspace's values.
   */
  values: TValues;
}

/**
 * The functions reading and writing one record of a key-value store:
 * the active workspace's on the store itself, another workspace's
 * through `in(workspaceId)`.
 */
export interface KeyValueStoreScope<TValues extends StoreValues> {
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
   * a `stores:store:hydrate-request` event, then waits for the platform
   * layer to respond with a `stores:store:hydrate` event containing the
   * data.
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
}

export interface KeyValueStore<TValues extends StoreValues>
  extends KeyValueStoreScope<TValues> {
  /**
   * The namespaced name of the store (e.g. "Databases:Defaults").
   */
  name: string;

  /**
   * The type of store.
   */
  type: RegisteredStoreType;

  /**
   * The internal Zustand store.
   */
  useStore: UseBoundStore<StoreApi<KeyValueStoreInternalApi<TValues>>>;

  /**
   * Resolves once every mutation made so far has been written by the
   * platform layer, or immediately when no platform layer is listening.
   *
   * Await it before an action that would interrupt the write, such as
   * reloading the window.
   */
  persisted(): Promise<void>;

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

export interface WorkspaceScopedKeyValueStore<TValues extends StoreValues>
  extends KeyValueStore<TValues> {
  /**
   * Addresses the record of a given workspace rather than the active
   * one's.
   *
   * @param workspaceId - The workspace whose record to address.
   */
  in(workspaceId: string): KeyValueStoreScope<TValues>;
}

/**
 * Creates a key-value store, providing a simple get/set interface
 * for a typed record of key-value pairs.
 *
 * When `persist` is provided, mutations (set, reset)
 * dispatch a `stores:persist` event so the platform layer can
 * handle writing the data to storage.
 *
 * When scoped by workspace, the store keeps a record per workspace,
 * each starting from the defaults, and reads and writes the active
 * workspace's unless addressed through `in(workspaceId)`.
 *
 * @param name - The namespaced name for the store registry (e.g. "App:UiState").
 * @param defaults - The default values for the store.
 * @param options - The store's persistence and scope.
 * @returns The key-value store.
 */
export function createKeyValueStore<TValues extends StoreValues>(
  name: string,
  defaults: TValues,
  options: WorkspaceScopedStoreOptions,
): WorkspaceScopedKeyValueStore<TValues>;
export function createKeyValueStore<TValues extends StoreValues>(
  name: string,
  defaults: TValues,
  options?: StoreOptions,
): KeyValueStore<TValues>;
export function createKeyValueStore<TValues extends StoreValues>(
  name: string,
  defaults: TValues,
  options: StoreOptions = {},
): WorkspaceScopedKeyValueStore<TValues> {
  const store = create<KeyValueStoreInternalApi<TValues>>()(() => ({
    values: { ...defaults },
  }));

  // The records backing the store, mirrored into its state
  const records = createStoreRecords<TValues>(
    options.scope,
    () => ({ ...defaults }),
    (values) => store.setState({ values }),
  );

  // Wire the store up to the platform layer that persists it
  const persistence = createStorePersistence(
    options.persist,
    (data, workspaceId) =>
      createScope(workspaceId).load(data as Partial<TValues>),
  );

  // Creates the functions reading and writing a workspace's record,
  // the active workspace's when none is given
  function createScope(workspaceId?: string): KeyValueStoreScope<TValues> {
    const read = () => records.get(workspaceId);

    // Replaces the record and persists it
    function write(values: TValues): void {
      records.set(values, workspaceId);
      persistence.dispatchPersist(
        values,
        records.resolveWorkspaceId(workspaceId),
      );
    }

    return {
      get: (key) => read()[key],
      getAll: read,
      load: (values) => records.set({ ...read(), ...values }, workspaceId),
      hydrate: () =>
        persistence.hydrate(records.resolveWorkspaceId(workspaceId)),
      set: (key, value) => write({ ...read(), [key]: value }),
      reset: (key) => {
        // Reset all values to defaults when no key is provided
        if (!key) {
          write({ ...defaults });

          return;
        }

        // Reset the key to its default value
        const values = { ...read() };

        if (key in defaults) {
          values[key] = defaults[key];
        } else {
          delete values[key];
        }

        write(values);
      },
    };
  }

  // Register the store in the global registry
  registerStore(
    name,
    'key-value',
    store as UseBoundStore<StoreApi<unknown>>,
    options.scope === 'workspace' ? records.drop : undefined,
  );

  return {
    ...createScope(),
    name,
    type: 'key-value',
    persisted: persistence.persisted,
    in: createScope,
    useValue: (key) => store(({ values }) => values[key]),
    useAllValues: () => store().values,
    useStore: store,
  };
}
