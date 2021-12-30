import { Core } from '@minddrop/core';
import { useLocalPersistentStore } from '../useLocalPersistentStore';

/**
 * Returns a value from the global store.
 *
 * @param core A MindDrop core instance.
 * @param key The key of the value to retrieve.
 * @returns The value.
 */
export function useLocalPersistentStoreValue<T = any>(
  core: Core,
  key: string,
): T {
  const data = useLocalPersistentStore(core);

  return data[key];
}
