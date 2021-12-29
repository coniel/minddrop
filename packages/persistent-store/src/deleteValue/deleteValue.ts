import { Core } from '@minddrop/core';
import { usePersistentStore } from '../usePersistentStore';
import { PersistentStoreScope } from '..';

/**
 * Deletes a key and assotiated data from a store.
 * Dispatches a `persistent-store:update-[global/local]` event.
 *
 * @param scope The scope from which to delete the value.
 * @param core A MindDrop core instance.
 * @param key The key of the value to delete.
 */
export function deleteValue(
  scope: PersistentStoreScope,
  core: Core,
  key: string,
): void {
  usePersistentStore.getState().delete(scope, core.extensionId, key);
  const data = usePersistentStore.getState()[scope];

  core.dispatch(`persistent-store:update-${scope}`, data);
}
