import { createArrayStore } from '@minddrop/utils';
import { CollectionTypeConfig } from './types';

export const CollectionTypeConfigsStore =
  createArrayStore<CollectionTypeConfig>('id');

/**
 * Registers a CollectionTypeConfig.
 *
 * @param type - The collection type config to register.
 */
export function registerCollectionTypeConfig(type: CollectionTypeConfig): void {
  CollectionTypeConfigsStore.remove(type.id);
  CollectionTypeConfigsStore.add(type);
}

/**
 * Unregisters a CollectionTypeConfig by ID.
 *
 * @param id - The ID of the collection type to unregister.
 */
export function unregisterCollectionTypeConfig(id: string): void {
  CollectionTypeConfigsStore.remove(id);
}

/**
 * Retrieves a CollectionTypeConfig by ID or null if it doesn't exist.
 *
 * @param id - The ID of the type to retrieve.
 * @returns The collection type config or null if it doesn't exist.
 */
export function getCollectionTypeConfig(
  id: string,
): CollectionTypeConfig | null {
  const type = CollectionTypeConfigsStore.get(id);

  return type || null;
}

/**
 * Retrieves a CollectionTypeConfig by ID or null if it doesn't exist.
 *
 * @param id - The ID of the collection type config to retrieve.
 * @returns The type or null if it doesn't exist.
 */
export const useCollectionTypeConfig = (
  id: string,
): CollectionTypeConfig | null => {
  return (
    CollectionTypeConfigsStore.useAllItems().find((type) => type.id === id) ||
    null
  );
};

/**
 * Retrieves all CollectionTypeConfigs.
 *
 * @returns And array of all registered CollectionTypeConfigs.
 */
export const useCollectionTypeConfigs = (): CollectionTypeConfig[] => {
  return CollectionTypeConfigsStore.useAllItems();
};
