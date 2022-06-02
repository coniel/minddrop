import { Core } from '@minddrop/core';
import { InvalidParameterError } from '@minddrop/utils';
import {
  GlobalPersistentStoreResourceApi,
  LocalPersistentStoreResourceApi,
} from '../types';

/**
 * Validates a persistent store key, ensuring that
 * it is defined in the store's schema.
 *
 * @param core - A MindDrop core instance.
 * @param resource - The persistent store resource.
 * @param key - The key to validate.
 *
 * @throws InvalidParameterError
 * Thrown if the key is invalid.
 */
export function validatePersistentStoreKey(
  core: Core,
  resource: GlobalPersistentStoreResourceApi | LocalPersistentStoreResourceApi,
  key: string,
): void {
  const Resource = resource as LocalPersistentStoreResourceApi;

  // Get the extension's persistent store type config
  const config = Resource.getTypeConfig(core.extensionId);

  if (!config.dataSchema[key]) {
    // If the ket does not appear in the data schema, throw
    // a `InvalidParameterError`.
    throw new InvalidParameterError(
      `invalid persistent store key '${key}'. All store values must be defined in the schema provided at initialization.`,
    );
  }
}
