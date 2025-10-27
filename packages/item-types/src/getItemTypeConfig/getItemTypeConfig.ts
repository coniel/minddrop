import { ItemTypeConfigsStore } from '../ItemTypeConfigsStore';
import { ItemTypeNotFoundError } from '../errors';
import { ItemTypeConfig } from '../types';

/**
 * Retrieves the item type configuration for the specified type.
 *
 * @param type - The type of the item type configuration to retrieve.
 * @param throwOnNotFound - Whether to throw an error if the item type.
 * @returns The item type configuration.
 *
 * @throws {ItemTypeNotFoundError} If the item type configuration does not exist.
 */
export function getItemTypeConfig(type: string): ItemTypeConfig;
export function getItemTypeConfig(
  type: string,
  throwOnNotFound: false,
): ItemTypeConfig | null;
export function getItemTypeConfig(
  type: string,
  throwOnNotFound = true,
): ItemTypeConfig | null {
  // Get the item type config from the store
  const config = ItemTypeConfigsStore.get(type);

  // Throw an error if it doesn't exist, unless specified not to
  if (!config && throwOnNotFound) {
    throw new ItemTypeNotFoundError(type);
  } else if (!config && !throwOnNotFound) {
    return null;
  }

  return config;
}
