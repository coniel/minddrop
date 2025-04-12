import { CollectionTypeConfigsStore } from '../CollectionTypeConfigsStore';
import { CollectionTypeNotRegisteredError } from '../errors';
import { CollectionTypeConfig } from '../types';

/**
 * Returns the configuration for a collection type.
 *
 * @param type - The type of the collection.
 * @returns The configuration for the collection type.
 *
 * @throws {CollectionTypeNotRegisteredError} If the collection type is not registered.
 */
export function getCollectionTypeConfig(type: string): CollectionTypeConfig {
  const config = CollectionTypeConfigsStore.get(type);

  if (!config) {
    throw new CollectionTypeNotRegisteredError(type);
  }

  return config;
}
