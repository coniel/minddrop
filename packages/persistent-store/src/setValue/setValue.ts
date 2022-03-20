import { Core } from '@minddrop/core';
import { createUpdate, FieldValue } from '@minddrop/utils';
import { PersistentStoreScope } from '../types';
import { usePersistentStore } from '../usePersistentStore';

/**
 * Sets a value in a store and dispaches a
 * `persistent-store:update-[scope]` event.
 *
 * @param scope The scope for which to set the value.
 * @param core A MindDrop core instance.
 * @param key The key of the value to set.
 * @param value The value to set.
 */
export function setValue<T = any>(
  scope: PersistentStoreScope,
  core: Core,
  key: string,
  value: T,
): void {
  // Get the scope store (e.g. 'local' store)
  const store = usePersistentStore.getState()[scope];

  // Create the update object
  const update = createUpdate(store, {
    data: FieldValue.objectUnion({
      [core.extensionId]: FieldValue.objectUnion({ [key]: value }),
    }),
  });

  // Get the updated value
  const updatedValue = update.after.data[core.extensionId][key];

  // Set the updated value in the store
  usePersistentStore.getState().set(scope, core.extensionId, key, updatedValue);

  // Dispatch 'persistent-store:update-[scope]' event
  core.dispatch(`persistent-store:update-${scope}`, update);
}
