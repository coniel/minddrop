import { StoreApi, UseBoundStore, create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { Events } from '@minddrop/events';
import {
  StoreLoadEvent,
  StoreLoadEventData,
  StoreLoadRequestEvent,
  StorePersistEvent,
} from '../events';
import { PersistOptions } from '../types';

export interface ObjectStoreInternalApi<TItem extends object> {
  /**
   * The items keyed by identifier.
   */
  items: Record<string, TItem>;

  /**
   * Load items into the store, merging with existing items.
   */
  load(items: TItem[]): void;

  /**
   * Add or replace an item in the store.
   */
  set(item: TItem): void;

  /**
   * Updates an item in the store by merging partial data.
   */
  update(id: string, data: Partial<TItem>): void;

  /**
   * Remove an item from the store.
   */
  remove(id: string): void;

  /**
   * Clear all items.
   */
  clear(): void;
}

export interface ObjectItemStore<TItem extends object> {
  /**
   * The internal Zustand store.
   */
  useStore: UseBoundStore<StoreApi<ObjectStoreInternalApi<TItem>>>;

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
   * a `stores:load-request` event. The platform layer responds with
   * a `stores:load` event containing the data.
   *
   * Only available when the store is created with `persist` options.
   */
  loadPersisted(): void;

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

/**
 * Creates an object store, providing a CRUD interface for items
 * stored in a record keyed by an identifier.
 *
 * When `persist` is provided, mutations (set, update, remove, clear)
 * dispatch a `stores:persist` event so the platform layer can
 * handle writing the data to storage.
 *
 * @param identifierKey - The key to use as the identifier for the items.
 * @param persist - Optional persistence configuration.
 * @returns The object store.
 */
export function createObjectStore<TItem extends object>(
  identifierKey: keyof TItem,
  persist?: PersistOptions,
): ObjectItemStore<TItem> {
  const store = create<ObjectStoreInternalApi<TItem>>()((set) => ({
    items: {},

    load: (items) =>
      set((state) => ({
        // Merge loaded items into the store
        items: {
          ...state.items,
          ...items.reduce(
            (map, item) => ({
              ...map,
              [item[identifierKey] as string]: item,
            }),
            {},
          ),
        },
      })),

    set: (item) =>
      set((state) => ({
        // Add or replace the item
        items: { ...state.items, [item[identifierKey] as string]: item },
      })),

    update: (id, data) =>
      set((state) => {
        // Do nothing if the item doesn't exist
        if (!state.items[id]) {
          return {};
        }

        return {
          items: { ...state.items, [id]: { ...state.items[id], ...data } },
        };
      }),

    remove: (id) =>
      set((state) => {
        // Clone items and delete the target
        const items = { ...state.items };
        delete items[id];

        return { items };
      }),

    clear: () => set({ items: {} }),
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

        // Load the persisted data as an array of items
        const items = Object.values(event.data.data) as TItem[];
        store.getState().load(items);
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
      data: store.getState().items,
    });
  }

  // Create the `get` function which returns one or multiple items
  // based on whether the `id` argument is a string or an array.
  function get(id: string): TItem | null;
  function get(ids: string[]): Record<string, TItem>;
  function get(id: string | string[]): TItem | Record<string, TItem> | null {
    const { items } = store.getState();

    if (Array.isArray(id)) {
      return id.reduce(
        (map, key) => (items[key] ? { ...map, [key]: items[key] } : map),
        {},
      );
    }

    return items[id] || null;
  }

  // Create the `getArray` function which returns items
  // matching the given IDs as an array.
  function getArray(ids: string[]): TItem[] {
    const { items } = store.getState();

    return ids.reduce<TItem[]>(
      (list, key) => (items[key] ? [...list, items[key]] : list),
      [],
    );
  }

  return {
    get,
    getAll: () => store.getState().items,
    getArray,
    getAllArray: () => Object.values(store.getState().items),
    set: (item) => {
      store.getState().set(item);
      dispatchPersist();
    },
    update: (id, data) => {
      store.getState().update(id, data);
      dispatchPersist();
    },
    remove: (id) => {
      store.getState().remove(id);
      dispatchPersist();
    },
    load: (items) => store.getState().load(items),
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
    clear: () => {
      store.getState().clear();
      dispatchPersist();
    },
    useItem: (id) => store(({ items }) => items[id] || null),
    useAllItems: () => store().items,
    useItemsArray: (ids) =>
      store(
        ({ items }) =>
          ids.reduce<TItem[]>(
            (list, key) => (items[key] ? [...list, items[key]] : list),
            [],
          ),
        shallow,
      ),
    useAllItemsArray: () => Object.values(store().items),
    useStore: store,
  };
}
