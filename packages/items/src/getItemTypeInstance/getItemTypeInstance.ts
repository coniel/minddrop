import { ItemTypeInstancesStore } from '../ItemTypeInstancesStore';
import { ItemTypeInstanceNotFoundError } from '../errors';
import { ItemTypeInstance } from '../types';

/**
 * Returns an item type instance by ID, or null if it does not exist.
 *
 * @param id - The item type instance ID.
 * @returns A item type instance or null.
 *
 * @throws {ItemTypeInstanceNotFoundError} If the collection does not exist and `throwOnNotFound` is true.
 */
export function getItemTypeInstance(
  path: string,
  throwOnNotFound: true,
): ItemTypeInstance;
export function getItemTypeInstance(path: string): ItemTypeInstance | null;
export function getItemTypeInstance(
  id: string,
  throwOnNotFound?: boolean,
): ItemTypeInstance | null {
  const instance = ItemTypeInstancesStore.get(id) || null;

  if (!instance && throwOnNotFound) {
    throw new ItemTypeInstanceNotFoundError(id);
  }

  return instance;
}
