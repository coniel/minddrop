import { Core } from '@minddrop/core';
import { useLocalStore } from '../useLocalStore';

/**
 * Returns a value from the global store.
 *
 * @param core A MindDrop core instance.
 * @param key The key of the value to retrieve.
 * @returns The value.
 */
export function useLocalStoreValue<T = any>(core: Core, key: string): T {
  const data = useLocalStore(core);

  return data[key];
}
