import { getItem as getFromStore } from '../ItemsStore';
import { ItemNotFoundError } from '../errors';
import { Item } from '../types';

/**
 * Retrieves an item by its path.
 *
 * @param path - The path of the item to retrieve.
 * @param throwOnNotFound - Whether to throw an error if the item is not found.
 * @returns The item if found, or null if not found.
 */
export function getItem(path: string, throwOnNotFound: true): Item;
export function getItem(path: string): Item | null;
export function getItem(path: string, throwOnNotFound?: boolean): Item | null {
  // Get the item
  const item = getFromStore(path);

  // If the item does not exist and throwOnNotFound is true, throw an error
  if (!item && throwOnNotFound) {
    throw new ItemNotFoundError(path);
  }

  return item;
}
