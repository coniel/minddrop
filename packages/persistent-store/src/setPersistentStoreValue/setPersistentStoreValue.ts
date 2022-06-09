import { Core } from '@minddrop/core';
import {
  GlobalPersistentStoreResourceApi,
  LocalPersistentStoreResourceApi,
} from '../types';
import { getPersistentStoreDocument } from '../getPersistentStoreDocument';
import { validatePersistentStoreKey } from '../validatePersistentStoreKey';

/**
 * Sets a persistent store value.
 *
 * @param core - A MindDrop core instance.
 * @param resource - The persistent store resource.
 * @param key - The key of the value to set.
 * @param value - The value to set.
 *
 * @throws InvalidParameterError
 * Thrown if the key is invalid (not listed in the
 * store's schema).
 *
 * @throws ResourceTypeNotRegisteredError
 * Thrown if the extension has not initialized the
 * persistent store.
 *
 * @throws ReourceValidationError
 * Thrown if the value is invalid.
 */
export function setPersistentStoreValue<TValue = unknown>(
  core: Core,
  resource: GlobalPersistentStoreResourceApi | LocalPersistentStoreResourceApi,
  key: string,
  value: TValue,
): void {
  const Resource = resource as LocalPersistentStoreResourceApi;

  // Get the persistent store document
  const document = getPersistentStoreDocument(core, resource);

  // Ensure that the key is a valid key
  validatePersistentStoreKey(core, resource, key);

  // Update the document, setting the new value
  Resource.update(core, document.id, { [key]: value });
}
