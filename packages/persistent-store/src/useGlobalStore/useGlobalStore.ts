import { Core } from '@minddrop/core';
import { usePersistentStore } from '../usePersistentStore';

/**
 * Returns an object containing all of the data stored
 * by the extension in the global store.
 *
 * @param core A MindDrop core instance.
 * @returns The extension's global store data.
 */
export function useGlobalStore<T = Record<string, any>>(core: Core): T {
  const { global } = usePersistentStore();

  return (global[core.extensionId] || {}) as T;
}
