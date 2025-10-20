import { ItemTypeConfigsStore } from '../ItemTypeConfigsStore';
import { ItemTypeNotFoundError } from '../errors';
import { ItemTypeConfig } from '../types';

/**
 * Retrieves the item type configuration for the specified type.
 *
 * @param type - The type of the item type configuration to retrieve.
 * @returns The item type configuration.
 *
 * @throws {ItemTypeNotFoundError} If the item type configuration does not exist.
 */
export function getItemTypeConfig(type: string): ItemTypeConfig {
  // Get the item type config from the store
  const config = ItemTypeConfigsStore.get(type);

  // Throw an error if it doesn't exist
  if (!config) {
    throw new ItemTypeNotFoundError(type);
  }

  return config;
}
