import { StoreApi, UseBoundStore } from 'zustand';

export interface ItemStoreInternalApi<TItem extends { id: string }> {
  /**
   * A `{ [id]: Item }` map of item items.
   */
  items: Record<string, TItem>;

  /**
   * Loads items into the store.
   *
   * @param items The items to load.
   */
  loadItems(items: TItem[]): void;

  /**
   * Sets a item in the store.
   *
   * @param item The item to set.
   */
  setItem(item: TItem): void;

  /**
   * Removes a item from the store.
   *
   * @param itemId The ID of the item to remove.
   */
  removeItem(itemId: string): void;

  /**
   * Clears all items from the store.
   */
  clearItems(): void;
}

export interface ItemStore<TItem extends { id: string }> {
  useStore: UseBoundStore<StoreApi<ItemStoreInternalApi<TItem>>>;

  /**
   * Retrieves a item item by ID.
   *
   * @param id The ID of the item item to get.
   */
  get(id: string): TItem;

  /**
   * Returns a `{ [id]: Item }` map of the requested
   * items. Omits any requested resources which do not
   * exist.
   *
   * @param ids The IDs of the item items to get.
   */
  get(id: string[]): Record<string, TItem>;

  /**
   * Returns all item items.
   */
  getAll(): Record<string, TItem>;

  /**
   * Loads the item items into the store.
   *
   * @param items The items to load.
   */
  load(items: TItem[]): void;

  /**
   * Sets a item item in the store.
   *
   * @param item The item to set.
   */
  set(item: TItem): void;

  /**
   * Removes a item item from the store.
   *
   * @param id The ID of the item to remove.
   */
  remove(id: string): void;

  /**
   * Clears all item items from the store.
   */
  clear(): void;

  /**
   * A hook which returns a item item by ID.
   *
   * @param id The ID of the item item to retrieve.
   */
  useItem(id: string): TItem | null;

  /**
   * A hook which returns an `{ [id]: Item | null }` map
   * of the requested items (or null if a resource
   * item does not exist).
   *
   * @param ids The IDs of the items to retrieve.
   */
  useItems(ids: string[]): Record<string, TItem | null>;

  /**
   * A hook which returns a `{ [id]: Item }` map of all
   * the item items.
   */
  useAllItems(): Record<string, TItem>;
}
