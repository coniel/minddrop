import { Core } from '@minddrop/core';
import { PersistentStoreScope } from '../types';
import { usePersistentStore } from '../usePersistentStore';

/**
 * Sets the extension's data in a store and dispatches
 * a `persistent-store:update-[global/local]` event.
 *
 * @param scope The scope for which to set the store.
 * @param core A MindDrop core isntance.
 * @param data The store data.
 */
export function setStore(
  scope: PersistentStoreScope,
  core: Core,
  data: Record<string, any>,
): void {
  const store = usePersistentStore.getState()[scope];
  const updated = { ...store, [core.extensionId]: data };
  usePersistentStore.getState().load(scope, updated);

  core.dispatch(`persistent-store:update-${scope}`, updated);
}
