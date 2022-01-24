import { Core } from '@minddrop/core';
import { createUpdate } from '@minddrop/utils';
import { PersistentStoreScope } from '../types';
import { usePersistentStore } from '../usePersistentStore';

/**
 * Sets a value in a store and dispaches a
 * `persistent-store:update-[global/local]` event.
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
  // Get data for the entire scope (e.g. 'local' store)
  const scopeData = usePersistentStore.getState()[scope];
  // Get the calling extension's data
  const extensionData = scopeData[core.extensionId] || {};
  // Create a data update object
  const dataUpdate = { [key]: value };
  // Create the update object
  const update = createUpdate(extensionData, dataUpdate);

  // Set the updated value in the store
  usePersistentStore
    .getState()
    .set(scope, core.extensionId, key, update.after[key]);

  // Dispatch 'persistent-store:update-[scope]' event
  core.dispatch(`persistent-store:update-${scope}`, {
    before: scopeData,
    after: {
      ...scopeData,
      [core.extensionId]: { ...extensionData, ...update.after },
    },
    changes: { [core.extensionId]: update.changes },
  });
}
