import { Core } from '@minddrop/core';
import {
  GlobalPersistentStoreResourceApi,
  LocalPersistentStoreResourceApi,
} from '../types';
import { getPersistentStoreDocument } from '../getPersistentStoreDocument';
import { validatePersistentStoreKey } from '../validatePersistentStoreKey';

/**
 * Retrives a persistent store value.
 *
 * Optionaly, a default value can be provided which
 * is returned if the key is not set.
 *
 * @param core - A MindDrop core instance.
 * @param resource - The persistent store resource.
 * @param key - The key of the value to retrieve.
 * @param defaultValue - The default value to return in case the key is not set.
 *
 * @throws InvalidParameterError
 * Thrown if the key is invalid (not listed in the
 * store's schema).
 *
 * @throws ResourceTypeNotRegisteredError
 * Thrown if the extension has not initialized the
 * persistent store.
 */
export function getPersistentStoreValue<TValue = unknown>(
  core: Core,
  resource: GlobalPersistentStoreResourceApi | LocalPersistentStoreResourceApi,
  key: string,
  defaultValue: TValue | null = null,
): TValue | null {
  // Get the store document
  const document = getPersistentStoreDocument(core, resource);

  // Ensure that the key is a valid key
  validatePersistentStoreKey(core, resource, key);

  // Return the value
  return document[key] || defaultValue;
}
