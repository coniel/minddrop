import { create } from 'zustand';
import { ItemStore, ItemStoreInternalApi } from '../types';

/**
 * Creates a new item store.
 *
 * @returns The item store.
 */
export function createItemStore<
  TItem extends { id: string },
>(): ItemStore<TItem> {
  const useItemStore = create<ItemStoreInternalApi<TItem>>()((set) => ({
    items: {},
    revisions: {},

    loadItems: (items) =>
      set((state) => ({
        // Merge loaded items into the store
        items: {
          ...state.items,
          ...items.reduce(
            (map, item) => ({
              ...map,
              [item.id]: item,
            }),
            {},
          ),
        },
      })),

    setItem: (item) =>
      set((state) => ({
        // Add the item
        items: { ...state.items, [item.id]: item },
      })),

    removeItem: (id) =>
      set((state) => {
        // Clone store items
        const items = { ...state.items };

        // Delete the item
        delete items[id];

        // Set the updated items and revisions
        return { items };
      }),

    clearItems: () =>
      set({
        // Clear items
        items: {},
      }),
  }));

  // Create the `get` function which returns one or multiple items
  // based on the whether `itemId` argument is a string or an array.
  function get(itemId: string): TItem;
  function get(itemIds: string[]): Record<string, TItem>;
  function get(itemId: string | string[]) {
    const { items } = useItemStore.getState();

    if (Array.isArray(itemId)) {
      return itemId.reduce((map, id) => ({ ...map, [id]: items[id] }), {});
    }

    return items[itemId];
  }

  return {
    useStore: useItemStore,
    get,
    getAll: () => useItemStore.getState().items,
    set: (item) => useItemStore.getState().setItem(item),
    remove: (id) => useItemStore.getState().removeItem(id),
    load: (items) => useItemStore.getState().loadItems(items),
    clear: () => useItemStore.getState().clearItems(),
    useItem: (id) =>
      useItemStore(({ items }) => (items[id] ? { ...items[id] } : null)),
    useItems: (ids) =>
      useItemStore(({ items }) =>
        ids.reduce((map, id) => ({ ...map, [id]: items[id] }), {}),
      ),
    useAllItems: () => useItemStore(({ items }) => items),
  };
}
