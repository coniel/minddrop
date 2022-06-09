import { Core } from '@minddrop/core';
import { GlobalStoreResource } from './GlobalStoreResource';
import { GlobalPersistentStoreApi } from './types';
import { initializePersistentStore } from './initializePersistentStore';
import { getPersistentStoreValue } from './getPersistentStoreValue';
import { setPersistentStoreValue } from './setPersistentStoreValue';
import { usePersistentStoreValue } from './usePersistentStoreValue';

export const GlobalPersistentStore: GlobalPersistentStoreApi = {
  store: GlobalStoreResource.store,
  typeConfigsStore: GlobalStoreResource.typeConfigsStore,
  initialize: (core, schema, defaultData) =>
    initializePersistentStore(core, GlobalStoreResource, schema, defaultData),
  get: (core, key, defaultValue) =>
    getPersistentStoreValue(core, GlobalStoreResource, key, defaultValue),
  set: (core, key, value) =>
    setPersistentStoreValue(core, GlobalStoreResource, key, value),
};

/**
 * Retrives a value from the global persistent store.
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
export const useGlobalPersistentStoreValue = <TValue = unknown>(
  core: Core,
  key: string,
  defaultValue: TValue,
): TValue =>
  usePersistentStoreValue<TValue>(core, GlobalStoreResource, key, defaultValue);
