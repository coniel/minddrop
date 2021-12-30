import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { PersistentStoreScope } from '../types';
import { usePersistentStore } from '../usePersistentStore';

/**
 * Permanently deletes all data added by the extension
 * from the global store. Dispatches a
 * `persistent-store:update-[global/local]` event.
 *
 * @param scope The scope in which to delete the store.
 * @param core A MindDrop core instance.
 */
export function deleteStore(scope: PersistentStoreScope, core: Core): void {
  usePersistentStore.getState().clear(scope, core.extensionId);
  const data = usePersistentStore.getState()[scope];

  core.dispatch(`persistent-store:update-${scope}`, {
    ...data,
    [core.extensionId]: FieldValue.delete(),
  });
}
