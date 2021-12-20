import { Core } from '@minddrop/core';
import { useGlobalStore } from '../useGlobalStore';

/**
 * Returns a value from the global store.
 *
 * @param core A MindDrop core instance.
 * @param key The key of the value to retrieve.
 * @returns The value.
 */
export function useGlobalStoreValue<T = any>(core: Core, key: string): T {
  const data = useGlobalStore(core);

  return data[key];
}
