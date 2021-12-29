import { Core } from '@minddrop/core';
import { PersistentStoreScope } from '../types';
import { usePersistentStore } from '../usePersistentStore';

/**
 * Does something useful.
 */
export function setStore(
  scope: PersistentStoreScope,
  core: Core,
  data: Record<string, any>,
): void {
  const store = usePersistentStore.getState()[scope];
  usePersistentStore
    .getState()
    .load(scope, { ...store, [core.extensionId]: data });
}
