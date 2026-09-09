import { ArrayItemStore } from '../../createArrayStore';
import { ObjectItemStore } from '../../createObjectStore';
import { InspectableStore, missingItemMessage } from '../inspectStore';

/**
 * Retrieves an item from a store, throwing when the store does not
 * hold it. Use it in tests to assert on an item's fields without
 * having to handle the store getter's nullable return.
 *
 * @param store - The store to read the item from.
 * @param id - The identifier of the item to retrieve.
 * @returns The item.
 *
 * @throws When the store holds no item with the given identifier.
 */
export function storeItem<TItem extends object>(
  store: ObjectItemStore<TItem> | ArrayItemStore<TItem>,
  id: string,
): TItem {
  const item = store.get(id);

  if (!item) {
    throw new Error(
      missingItemMessage(store as unknown as InspectableStore, id),
    );
  }

  return item;
}
