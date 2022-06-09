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
export function usePersistentStoreValue<TValue = unknown>(
  core: Core,
  resource: GlobalPersistentStoreResourceApi | LocalPersistentStoreResourceApi,
  key: string,
  defaultValue: TValue | null = null,
): TValue | null {
  const Resource = resource as LocalPersistentStoreResourceApi;

  // Get the store document
  const document = getPersistentStoreDocument(core, resource);

  // Ensure that the key is a valid store key
  validatePersistentStoreKey(core, resource, key);

  // Get the store document using the hook for
  // live updates.
  const hookDocument = Resource.hooks.useDocument(document.id);

  if (!hookDocument) {
    return defaultValue;
  }

  // Return the value or default value
  return hookDocument[key] || defaultValue;
}
