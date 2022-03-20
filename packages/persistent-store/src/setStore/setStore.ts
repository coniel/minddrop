import { Core } from '@minddrop/core';
import { createUpdate, FieldValue } from '@minddrop/utils';
import { PersistentStoreScope } from '../types';
import { usePersistentStore } from '../usePersistentStore';

/**
 * Sets the extension's data in a store and dispatches
 * a `persistent-store:update-[scope]` event.
 *
 * @param scope The scope for which to set the store.
 * @param core A MindDrop core instance.
 * @param data The store data.
 */
export function setStore(
  scope: PersistentStoreScope,
  core: Core,
  data: Record<string, any>,
): void {
  // Get the scope store (e.g. 'local' store)
  const store = usePersistentStore.getState()[scope];

  // Create an update object which adds the extension's store
  const update = createUpdate(store, {
    data: FieldValue.objectUnion({
      [core.extensionId]: data,
    }),
  });

  // Update the store
  usePersistentStore.getState().load(scope, update.after);

  // Dispatch a 'persistent-store:update-[scope]' event
  core.dispatch(`persistent-store:update-${scope}`, update);
}
