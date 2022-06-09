import { Core } from '@minddrop/core';
import { getPersistentStoreValue } from './getPersistentStoreValue';
import { initializePersistentStore } from './initializePersistentStore';
import { LocalStoreResource } from './LocalStoreResource';
import { setPersistentStoreValue } from './setPersistentStoreValue';
import { LocalPersistentStoreApi } from './types';
import { usePersistentStoreValue } from './usePersistentStoreValue';

export const LocalPersistentStore: LocalPersistentStoreApi = {
  store: LocalStoreResource.store,
  typeConfigsStore: LocalStoreResource.typeConfigsStore,
  initialize: (core, schema, defaultData) =>
    initializePersistentStore(core, LocalStoreResource, schema, defaultData),
  get: (core, key, defaultValue) =>
    getPersistentStoreValue(core, LocalStoreResource, key, defaultValue),
  set: (core, key, value) =>
    setPersistentStoreValue(core, LocalStoreResource, key, value),
};

/**
 * Retrives a value from the local persistent store.
 *
 * Optionaly, a default value can be provided which
 * is returned if the key is not set.
 *
 * @param core - A MindDrop core instance.
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
export const useLocalPersistentStoreValue = <TValue = unknown>(
  core: Core,
  key: string,
  defaultValue: TValue,
): TValue =>
  usePersistentStoreValue<TValue>(core, LocalStoreResource, key, defaultValue);
