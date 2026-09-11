import { StoreApi, UseBoundStore, create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { createStorePersistence } from '../createStorePersistence';
import { createStoreRecords } from '../createStoreRecords';
import { RegisteredStoreType, registerStore } from '../storeRegistry';
import { StoreOptions, WorkspaceScopedStoreOptions } from '../types';

export interface ObjectStoreInternalApi<TItem extends object> {
  /**
   * The items keyed by identifier. On a store scoped by workspace,
   * the active workspace's items.
   */
  items: Record<string, TItem>;
}

/**
 * The functions reading and writing one record of an object store:
 * the active workspace's on the store itself, another workspace's
 * through `in(workspaceId)`.
 */
export interface ObjectItemStoreScope<TItem extends object> {
  /**
   * Retrieves an item by its identifier.
   *
   * @param id - The identifier of the item to get.
   */
  get(id: string): TItem | null;

  /**
   * Retrieves multiple items by their identifiers.
   *
   * @param ids - The identifiers of the items to get.
   */
  get(ids: string[]): Record<string, TItem>;

  /**
   * Returns all items as a record keyed by identifier.
   */
  getAll(): Record<string, TItem>;

  /**
   * Retrieves items by their identifiers as an array.
   *
   * @param ids - The identifiers of the items to get.
   */
  getArray(ids: string[]): TItem[];

  /**
   * Returns all items as an array.
   */
  getAllArray(): TItem[];

  /**
   * Loads items into the store, merging with existing items.
   * Does not trigger persistence.
   *
   * @param items - The items to load.
   */
  load(items: TItem[]): void;

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
   * Adds or replaces an item in the store.
   *
   * @param item - The item to set.
   */
  set(item: TItem): void;

  /**
   * Updates an item in the store by merging partial data.
   *
   * @param id - The identifier of the item to update.
   * @param data - The data to merge into the item.
   */
  update(id: string, data: Partial<TItem>): void;

  /**
   * Removes an item from the store.
   *
   * @param id - The identifier of the item to remove.
   */
  remove(id: string): void;

  /**
   * Clears all items from the store.
   */
  clear(): void;
}

export interface ObjectItemStore<TItem extends object>
  extends ObjectItemStoreScope<TItem> {
  /**
   * The namespaced name of the store (e.g. "Databases:Entries").
   */
  name: string;

  /**
   * The type of store.
   */
  type: RegisteredStoreType;

  /**
   * The key used as the identifier for the items.
   */
  identifierKey: keyof TItem;

  /**
   * The internal Zustand store.
   */
  useStore: UseBoundStore<StoreApi<ObjectStoreInternalApi<TItem>>>;

  /**
   * Resolves once every mutation made so far has been written by the
   * platform layer, or immediately when no platform layer is listening.
   *
   * Await it before an action that would interrupt the write, such as
   * reloading the window.
   */
  persisted(): Promise<void>;

  /**
   * A hook which returns an item by its identifier.
   *
   * @param id - The identifier of the item to retrieve.
   */
  useItem(id: string): TItem | null;

  /**
   * A hook which returns all items as a record keyed by identifier.
   */
  useAllItems(): Record<string, TItem>;

  /**
   * A hook which returns items matching the given identifiers as an array.
   *
   * @param ids - The identifiers of the items to retrieve.
   */
  useItemsArray(ids: string[]): TItem[];

  /**
   * A hook which returns all items as an array.
   */
  useAllItemsArray(): TItem[];
}

export interface WorkspaceScopedObjectItemStore<TItem extends object>
  extends ObjectItemStore<TItem> {
  /**
   * Addresses the record of a given workspace rather than the active
   * one's.
   *
   * @param workspaceId - The workspace whose record to address.
   */
  in(workspaceId: string): ObjectItemStoreScope<TItem>;
}

/**
 * Creates an object store, providing a CRUD interface for items
 * stored in a record keyed by an identifier.
 *
 * When `persist` is provided, mutations (set, update, remove, clear)
 * dispatch a `stores:persist` event so the platform layer can
 * handle writing the data to storage.
 *
 * When scoped by workspace, the store keeps a record per workspace
 * and reads and writes the active workspace's unless addressed
 * through `in(workspaceId)`.
 *
 * @param name - The namespaced name for the store registry (e.g. "Databases:Databases").
 * @param identifierKey - The key to use as the identifier for the items.
 * @param options - The store's persistence and scope.
 * @returns The object store.
 */
export function createObjectStore<TItem extends object>(
  name: string,
  identifierKey: keyof TItem,
  options: WorkspaceScopedStoreOptions,
): WorkspaceScopedObjectItemStore<TItem>;
export function createObjectStore<TItem extends object>(
  name: string,
  identifierKey: keyof TItem,
  options?: StoreOptions,
): ObjectItemStore<TItem>;
export function createObjectStore<TItem extends object>(
  name: string,
  identifierKey: keyof TItem,
  options: StoreOptions = {},
): WorkspaceScopedObjectItemStore<TItem> {
  const store = create<ObjectStoreInternalApi<TItem>>()(() => ({
    items: {},
  }));

  // The records backing the store, mirrored into its state
  const records = createStoreRecords<Record<string, TItem>>(
    options.scope,
    () => ({}),
    (items) => store.setState({ items }),
  );

  // Wire the store up to the platform layer that persists it
  const persistence = createStorePersistence(
    options.persist,
    (data, workspaceId) =>
      createScope(workspaceId).load(Object.values(data) as TItem[]),
  );

  // Creates the functions reading and writing a workspace's record,
  // the active workspace's when none is given
  function createScope(workspaceId?: string): ObjectItemStoreScope<TItem> {
    const read = () => records.get(workspaceId);

    // Replaces the record and persists it
    function write(items: Record<string, TItem>): void {
      records.set(items, workspaceId);
      persistence.dispatchPersist(
        items,
        records.resolveWorkspaceId(workspaceId),
      );
    }

    // Create the `get` function which returns one or multiple items
    // based on whether the `id` argument is a string or an array.
    function get(id: string): TItem | null;
    function get(ids: string[]): Record<string, TItem>;
    function get(id: string | string[]): TItem | Record<string, TItem> | null {
      const items = read();

      if (Array.isArray(id)) {
        return pickItems(items, id);
      }

      return items[id] || null;
    }

    return {
      get,
      getAll: read,
      getArray: (ids) => pickItemsArray(read(), ids),
      getAllArray: () => Object.values(read()),
      load: (items) =>
        records.set(mergeItems(read(), items, identifierKey), workspaceId),
      hydrate: () =>
        persistence.hydrate(records.resolveWorkspaceId(workspaceId)),
      set: (item) =>
        write({ ...read(), [item[identifierKey] as string]: item }),
      update: (id, data) => {
        const items = read();

        // Do nothing if the item doesn't exist
        if (!items[id]) {
          return;
        }

        write({ ...items, [id]: { ...items[id], ...data } });
      },
      remove: (id) => {
        // Clone items and delete the target
        const items = { ...read() };
        delete items[id];

        write(items);
      },
      clear: () => write({}),
    };
  }

  // Register the store in the global registry
  registerStore(
    name,
    'object',
    store as UseBoundStore<StoreApi<unknown>>,
    options.scope === 'workspace' ? records.drop : undefined,
  );

  return {
    ...createScope(),
    name,
    type: 'object',
    identifierKey,
    persisted: persistence.persisted,
    in: createScope,
    useItem: (id) => store(({ items }) => items[id] || null),
    useAllItems: () => store().items,
    useItemsArray: (ids) =>
      store(({ items }) => pickItemsArray(items, ids), shallow),
    useAllItemsArray: () => Object.values(store().items),
    useStore: store,
  };
}

/**
 * Returns the items matching the given identifiers as a record,
 * omitting identifiers with no item.
 */
function pickItems<TItem extends object>(
  items: Record<string, TItem>,
  ids: string[],
): Record<string, TItem> {
  return ids.reduce(
    (map, key) => (items[key] ? { ...map, [key]: items[key] } : map),
    {},
  );
}

/**
 * Returns the items matching the given identifiers as an array in
 * the order given, omitting identifiers with no item.
 */
function pickItemsArray<TItem extends object>(
  items: Record<string, TItem>,
  ids: string[],
): TItem[] {
  return ids.reduce<TItem[]>(
    (list, key) => (items[key] ? [...list, items[key]] : list),
    [],
  );
}

/**
 * Returns the items with the loaded items merged in, loaded items
 * replacing existing ones with the same identifier.
 */
function mergeItems<TItem extends object>(
  items: Record<string, TItem>,
  loaded: TItem[],
  identifierKey: keyof TItem,
): Record<string, TItem> {
  return loaded.reduce(
    (map, item) => ({ ...map, [item[identifierKey] as string]: item }),
    items,
  );
}
