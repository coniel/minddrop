import { StoreApi, UseBoundStore, create } from 'zustand';
import { createStorePersistence } from '../createStorePersistence';
import { createStoreRecords } from '../createStoreRecords';
import { RegisteredStoreType, registerStore } from '../storeRegistry';
import { StoreOptions, WorkspaceScopedStoreOptions } from '../types';

export interface ArrayStoreInternalApi<TItem extends object> {
  /**
   * The items. On a store scoped by workspace, the active
   * workspace's items.
   */
  items: TItem[];
}

/**
 * The functions reading and writing one record of an array store:
 * the active workspace's on the store itself, another workspace's
 * through `in(workspaceId)`.
 */
export interface ArrayItemStoreScope<TItem extends object> {
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
  get(ids: string[]): TItem[];

  /**
   * Returns all items.
   */
  getAll(): TItem[];

  /**
   * Loads items into the store.
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
   * Adds an item to the store.
   *
   * @param item - The item to add.
   */
  add(item: TItem): void;

  /**
   * Updates an item in the store.
   *
   * @param id - The identifier of the item to update.
   * @param data - The data to update.
   */
  update(id: string, data: Partial<TItem>): void;

  /**
   * Removes an item from the store.
   *
   * @param id - The identifier of the item to remove.
   */
  remove(id: string): void;

  /**
   * Reorders items in the store by placing them in the given ID order.
   * Items not in the provided IDs remain in their original positions.
   *
   * @param ids - The IDs in the desired order.
   */
  reorder(ids: string[]): void;

  /**
   * Clears all items from the store.
   */
  clear(): void;
}

export interface ArrayItemStore<TItem extends object>
  extends ArrayItemStoreScope<TItem> {
  /**
   * The namespaced name of the store (e.g. "DevTools:Events").
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
  useStore: UseBoundStore<StoreApi<ArrayStoreInternalApi<TItem>>>;

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
   * A hook which returns all items.
   */
  useAllItems(): TItem[];
}

export interface WorkspaceScopedArrayItemStore<TItem extends object>
  extends ArrayItemStore<TItem> {
  /**
   * Addresses the record of a given workspace, the active one's when
   * none is given, so that a call made for an optional workspace can
   * address its store either way.
   *
   * @param workspaceId - The workspace whose record to address. Omit for the active workspace.
   */
  in(workspaceId?: string): ArrayItemStoreScope<TItem>;
}

/**
 * Creates an array store, providing a CRUD interface for an array of items.
 *
 * When `persist` is provided, mutations (add, update, remove, reorder, clear)
 * dispatch a `stores:persist` event so the platform layer can
 * handle writing the data to storage.
 *
 * When scoped by workspace, the store keeps a record per workspace
 * and reads and writes the active workspace's unless addressed
 * through `in(workspaceId)`.
 *
 * @param name - The namespaced name for the store registry (e.g. "Databases:Entries").
 * @param identifierKey - The key to use as the identifier for the items.
 * @param options - The store's persistence and scope.
 * @returns The array store.
 */
export function createArrayStore<TItem extends object>(
  name: string,
  identifierKey: keyof TItem,
  options: WorkspaceScopedStoreOptions,
): WorkspaceScopedArrayItemStore<TItem>;
export function createArrayStore<TItem extends object>(
  name: string,
  identifierKey: keyof TItem,
  options?: StoreOptions,
): ArrayItemStore<TItem>;
export function createArrayStore<TItem extends object>(
  name: string,
  identifierKey: keyof TItem,
  options: StoreOptions = {},
): WorkspaceScopedArrayItemStore<TItem> {
  const store = create<ArrayStoreInternalApi<TItem>>()(() => ({
    items: [],
  }));

  // The records backing the store, mirrored into its state
  const records = createStoreRecords<TItem[]>(
    options.scope,
    () => [],
    (items) => store.setState({ items }),
  );

  // Wire the store up to the platform layer that persists it.
  // Hydrated data replaces the items rather than being appended to
  // them, so hydrating a second time does not duplicate them. Data
  // which is not an array means nothing has been persisted yet.
  const persistence = createStorePersistence(
    options.persist,
    (data, workspaceId) =>
      records.set(Array.isArray(data) ? (data as TItem[]) : [], workspaceId),
  );

  // Creates the functions reading and writing a workspace's record,
  // the active workspace's when none is given
  function createScope(workspaceId?: string): ArrayItemStoreScope<TItem> {
    const read = () => records.get(workspaceId);

    // Replaces the record and persists it
    function write(items: TItem[]): void {
      records.set(items, workspaceId);
      persistence.dispatchPersist(
        items,
        records.resolveWorkspaceId(workspaceId),
      );
    }

    // Create the `get` function which returns one or multiple items
    // based on whether the `id` argument is a string or an array.
    function get(itemId: string): TItem | null;
    function get(itemIds: string[]): TItem[];
    function get(itemId: string | string[]): TItem | TItem[] | null {
      const items = read();

      if (Array.isArray(itemId)) {
        return items.filter((item) =>
          itemId.includes(item[identifierKey] as string),
        );
      }

      return items.find((item) => item[identifierKey] === itemId) || null;
    }

    return {
      get,
      getAll: read,
      load: (items) => records.set([...read(), ...items], workspaceId),
      hydrate: () =>
        persistence.hydrate(records.resolveWorkspaceId(workspaceId)),
      add: (item) => write([...read(), item]),
      update: (id, data) => {
        const items = [...read()];
        const index = items.findIndex((item) => item[identifierKey] === id);

        // Do nothing if the item doesn't exist
        if (index === -1) {
          return;
        }

        items[index] = { ...items[index], ...data };

        write(items);
      },
      remove: (id) =>
        write(read().filter((item) => id !== item[identifierKey])),
      reorder: (ids) => write(reorderItems(read(), ids, identifierKey)),
      clear: () => write([]),
    };
  }

  // Register the store in the global registry
  registerStore(
    name,
    'array',
    store as UseBoundStore<StoreApi<unknown>>,
    options.scope === 'workspace' ? records.drop : undefined,
  );

  return {
    ...createScope(),
    name,
    type: 'array',
    identifierKey,
    persisted: persistence.persisted,
    in: createScope,
    useItem: (id) =>
      store().items.find((item) => item[identifierKey] === id) || null,
    useAllItems: () => store().items,
    useStore: store,
  };
}

/**
 * Returns the items with those matching the given IDs placed in the
 * given order, as a block starting where the first of them was. Items
 * not in the IDs keep their positions relative to one another.
 */
function reorderItems<TItem extends object>(
  items: TItem[],
  ids: string[],
  identifierKey: keyof TItem,
): TItem[] {
  // Build an index map from ID to desired position
  const orderMap = new Map(ids.map((id, index) => [id, index]));

  // Separate items into those being reordered and those staying put
  const reordered: TItem[] = new Array(ids.length);
  const rest: TItem[] = [];

  for (const item of items) {
    const position = orderMap.get(item[identifierKey] as string);

    if (position !== undefined) {
      reordered[position] = item;
    } else {
      rest.push(item);
    }
  }

  // Find the index of the first reordered item in the original array
  // to know where to splice the reordered block back in.
  const firstReorderedIndex = items.findIndex((item) =>
    orderMap.has(item[identifierKey] as string),
  );

  // Rebuild the array: items before the block, reordered block, items after
  return [
    ...rest.slice(0, firstReorderedIndex),
    ...reordered,
    ...rest.slice(firstReorderedIndex),
  ];
}
