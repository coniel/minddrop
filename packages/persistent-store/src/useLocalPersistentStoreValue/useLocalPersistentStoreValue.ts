import { Core } from '@minddrop/core';
import { useLocalPersistentStore } from '../useLocalPersistentStore';

/**
 * Returns a value from the global store.
 *
 * @param core A MindDrop core instance.
 * @param key The key of the value to retrieve.
 * @param defaultValue The default value returned if the local store value does not exist.
 * @returns The value.
 */
export function useLocalPersistentStoreValue<T = any>(
  core: Core,
  key: string,
  defaultValue?: T,
): T {
  const data = useLocalPersistentStore(core);

  return data[key] || defaultValue;
}
