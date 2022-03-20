import { Core } from '@minddrop/core';
import { usePersistentStore } from '../usePersistentStore';
import { PersistentStoreScope } from '../types';
import { createUpdate, FieldValue } from '@minddrop/utils';

/**
 * Deletes a key and assotiated data from a store.
 * Dispatches a `persistent-store:update-[scope]` event.
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
  // Get the scope store (e.g. 'local' store)
  const store = usePersistentStore.getState()[scope];

  // Create an update object which deletes the value
  const update = createUpdate(store, {
    data: FieldValue.objectUnion({
      [core.extensionId]: FieldValue.objectUnion({
        [key]: FieldValue.delete(),
      }),
    }),
  });

  // Delete the value from the store
  usePersistentStore.getState().delete(scope, core.extensionId, key);

  // Dispatch a 'persistent-store:update-[scope] event
  core.dispatch(`persistent-store:update-${scope}`, update);
}
