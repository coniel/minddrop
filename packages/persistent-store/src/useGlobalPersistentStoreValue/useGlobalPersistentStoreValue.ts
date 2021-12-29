import { Core } from '@minddrop/core';
import { useGlobalPersistentStore } from '../useGlobalPersistentStore';

/**
 * Returns a value from the global store.
 *
 * @param core A MindDrop core instance.
 * @param key The key of the value to retrieve.
 * @returns The value.
 */
export function useGlobalPersistentStoreValue<T = any>(
  core: Core,
  key: string,
): T {
  const data = useGlobalPersistentStore(core);

  return data[key];
}
