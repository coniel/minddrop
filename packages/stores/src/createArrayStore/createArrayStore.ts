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

export interface ArrayStoreInternalApi<TItem extends object> {
  /**
   * The items.
   */
  items: TItem[];

  /**
   * Load items into the store.
   */
  load(items: TItem[]): void;

  /**
   * Add an item to the store.
   */
  add(item: TItem): void;

  /**
   * Updates an item in the store.
   */
  update(id: string, data: Partial<TItem>): void;

  /**
   * Remove an item from the store.
   */
  remove(id: string): void;

  /**
   * Reorders items in the store by placing them in the given ID order.
   * Items not in the provided IDs remain in their original positions.
   */
  reorder(ids: string[]): void;

  /**
   * Clear all items.
   */
  clear(): void;
}

export interface ArrayItemStore<TItem extends object> {
  /**
   * The internal Zustand store.
   */
  useStore: UseBoundStore<StoreApi<ArrayStoreInternalApi<TItem>>>;

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
   * a `stores:hydrate-request` event, then waits for the platform layer
   * to respond with a `stores:hydrate` event containing the data.
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

/**
 * Creates an array store, providing a CRUD interface for an array of items.
 *
 * When `persist` is provided, mutations (add, update, remove, reorder, clear)
 * dispatch a `stores:persist` event so the platform layer can
 * handle writing the data to storage.
 *
 * @param name - The namespaced name for the store registry (e.g. "Databases:Entries").
 * @param identifierKey - The key to use as the identifier for the items.
 * @param persist - Optional persistence configuration.
 * @returns The array store.
 */
export function createArrayStore<TItem extends object>(
  name: string,
  identifierKey: keyof TItem,
  persist?: PersistOptions,
): ArrayItemStore<TItem> {
  const store = create<ArrayStoreInternalApi<TItem>>()((set) => ({
    items: [],

    load: (items) => set((state) => ({ items: [...state.items, ...items] })),

    add: (item) =>
      set((state) => ({
        items: [...state.items, item],
      })),

    update: (id, data) =>
      set((state) => {
        const index = state.items.findIndex(
          (item) => item[identifierKey] === id,
        );
        const items = [...state.items];

        if (index === -1) {
          return {};
        }

        items[index] = { ...items[index], ...data };

        return { items };
      }),

    remove: (id) =>
      set((state) => ({
        items: state.items.filter((item) => id !== item[identifierKey]),
      })),

    reorder: (ids) =>
      set((state) => {
        // Build an index map from ID to desired position
        const orderMap = new Map(ids.map((id, index) => [id, index]));

        // Separate items into those being reordered and those staying put
        const reordered: TItem[] = new Array(ids.length);
        const rest: TItem[] = [];

        for (const item of state.items) {
          const position = orderMap.get(item[identifierKey] as string);

          if (position !== undefined) {
            reordered[position] = item;
          } else {
            rest.push(item);
          }
        }

        // Find the index of the first reordered item in the original array
        // to know where to splice the reordered block back in
        const firstReorderedIndex = state.items.findIndex((item) =>
          orderMap.has(item[identifierKey] as string),
        );

        // Rebuild the array: items before the block, reordered block, items after
        const result = [
          ...rest.slice(0, firstReorderedIndex),
          ...reordered,
          ...rest.slice(firstReorderedIndex),
        ];

        return { items: result };
      }),

    clear: () => set({ items: [] }),
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

        // Load the persisted data as an array of items
        store.getState().load(event.data.data as TItem[]);

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
      data: store.getState().items,
    });
  }

  // Create the `get` function which returns one or multiple items
  // based on whether the `id` argument is a string or an array.
  function get(itemId: string): TItem | null;
  function get(itemIds: string[]): TItem[];
  function get(itemId: string | string[]): TItem | TItem[] | null {
    const { items } = store.getState();

    if (Array.isArray(itemId)) {
      return items.filter((item) =>
        itemId.includes(item[identifierKey] as string),
      );
    }

    return items.find((item) => item[identifierKey] === itemId) || null;
  }

  // Register the store in the global registry
  registerStore(name, 'array', store as UseBoundStore<StoreApi<unknown>>);

  return {
    get,
    getAll: () => store.getState().items,
    add: (item) => {
      store.getState().add(item);
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
    reorder: (ids) => {
      store.getState().reorder(ids);
      dispatchPersist();
    },
    load: (items) => store.getState().load(items),
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
    clear: () => {
      store.getState().clear();
      dispatchPersist();
    },
    useItem: (id) =>
      store().items.find((item) => item[identifierKey] === id) || null,
    useAllItems: () => store().items,
    useStore: store,
  };
}
