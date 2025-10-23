import { getItem as getFromStore } from '../ItemsStore';
import { ItemNotFoundError } from '../errors';
import { Item } from '../types';

/**
 * Retrieves an item by its path.
 *
 * @param path - The path of the item to retrieve.
 * @returns The retrieved item.
 *
 * @throws {ItemNotFoundError} If the item does not exist.
 */
export function getItem<TItem extends Item = Item>(path: string): TItem {
  // Get the item
  const item = getFromStore(path);

  // Ensure the item exists
  if (!item) {
    throw new ItemNotFoundError(path);
  }

  return item as TItem;
}
