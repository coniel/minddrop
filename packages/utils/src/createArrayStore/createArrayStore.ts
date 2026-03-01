import { StoreApi, UseBoundStore, create } from 'zustand';

export interface ArrayStoreInteralApi<TItem extends object> {
  /**
   * The items.
   */
  items: TItem[];

  /**
   * Load items into the store.
   */
  load(item: TItem[]): void;

  /**
   * Add an item to the store.
   */
  add(item: TItem): void;

  /**
   * Updates an item in the store.
   */
  update(path: string, data: Partial<TItem>): void;

  /**
   * Remove an item from the store.
   */
  remove(path: string): void;

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

/**
 * Creates an array store, providing a CRUD interface for an array of items.
 *
 * @param identifierKey - The key to use as the identifier for the items.
 * @returns The array store.
 */
export function createArrayStore<TItem extends object>(
  identifierKey: keyof TItem,
): ArrayItemStore<TItem> {
  const store = create<ArrayStoreInteralApi<TItem>>()((set) => ({
    items: [],

    load: (items) => set((state) => ({ items: [...state.items, ...items] })),

    add: (item) =>
      set((state) => {
        return {
          items: [...state.items, item],
        };
      }),

    update: (path, data) =>
      set((state) => {
        const index = state.items.findIndex(
          (item) => item[identifierKey] === path,
        );
        const items = [...state.items];

        if (index === -1) {
          return {};
        }

        items[index] = { ...items[index], ...data };

        return { items: items };
      }),

    remove: (path) =>
      set((state) => {
        return {
          items: state.items.filter((item) => path !== item[identifierKey]),
        };
      }),

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

  // Create the `get` function which returns one or multiple items
  // based on the whether `itemId` argument is a string or an array.
  function get(itemId: string): TItem | null;
  function get(itemIds: string[]): TItem[];
  function get(itemId: string | string[]): TItem | TItem[] | null {
    const { items } = store.getState();

    if (Array.isArray(itemId)) {
      return items.filter((id) =>
        items.find((item) => item[identifierKey] === id),
      );
    }

    return items.find((item) => item[identifierKey] === itemId) || null;
  }

  return {
    get,
    getAll: () => store.getState().items,
    add: (item) => store.getState().add(item),
    remove: (id) => store.getState().remove(id),
    load: (items) => store.getState().load(items),
    update: (id, data) => store.getState().update(id, data),
    reorder: (ids) => store.getState().reorder(ids),
    clear: () => store.getState().clear(),
    useItem: (id) => {
      return store().items.find((item) => item[identifierKey] === id) || null;
    },
    useAllItems: () => store().items,
    useStore: store,
  };
}

export interface ArrayItemStore<TItem extends object> {
  useStore: UseBoundStore<StoreApi<ArrayStoreInteralApi<TItem>>>;

  /**
   * Retrieves an item item by ID.
   *
   * @param id - The identifier of the item item to get.
   */
  get(id: string): TItem | null;

  /**
   * Retrieves an item item by ID.
   *
   * @param id - The identifier of the item item to get.
   */
  get(id: string[]): TItem[];

  /**
   * Returns all item items.
   */
  getAll(): TItem[];

  /**
   * Loads items into the store.
   *
   * @param items - The items to load.
   */
  load(items: TItem[]): void;

  /**
   * Ads an item to the store.
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
   * Removes an item item from the store.
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
