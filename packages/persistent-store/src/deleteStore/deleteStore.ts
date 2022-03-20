import { Core } from '@minddrop/core';
import { createUpdate, FieldValue } from '@minddrop/utils';
import { PersistentStoreScope } from '../types';
import { usePersistentStore } from '../usePersistentStore';

/**
 * Permanently deletes all data added by the extension
 * from the given persistent store scope. Dispatches a
 * `persistent-store:update-[scope]` event.
 *
 * @param scope The scope in which to delete the store.
 * @param core A MindDrop core instance.
 */
export function deleteStore(scope: PersistentStoreScope, core: Core): void {
  // Get the scope's store
  const store = usePersistentStore.getState()[scope];

  // Create an update which deletes the extension's
  // data from the store.
  const update = createUpdate(store, {
    data: FieldValue.objectUnion({ [core.extensionId]: FieldValue.delete() }),
  });

  // Clear the extension's store data for the given scope in the store
  usePersistentStore.getState().clear(scope, core.extensionId);

  // Dispatch a 'persistent-store:update-[scope]' event
  core.dispatch(`persistent-store:update-${scope}`, update);
}
