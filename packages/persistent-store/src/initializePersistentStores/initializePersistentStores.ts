import { Core } from '@minddrop/core';
import { generateId } from '@minddrop/utils';
import { usePersistentStore } from '../usePersistentStore';

/**
 * Creates persistent store documents if they do not
 * already exist.
 *
 * This function should only be called once the
 * extension has been run and documents have been
 * loaded from the database.
 *
 * @param core A MindDrop core instance.
 */
export function initializePersistentStores(core: Core): void {
  // Check if the global store has an ID. If the ID is
  // null, it means that the document does not exist.
  if (usePersistentStore.getState().global.id === null) {
    // If there is no global store document, create one
    const globalStore = {
      id: generateId(),
      data: {},
    };

    // Load the document into the store
    usePersistentStore.getState().load('global', globalStore);

    // Dispatch a 'persistent-store:create-global' event to
    // trigger the resource connector's document creation
    core.dispatch('persistent-store:create-global', globalStore);
  }

  // Check if the local store has an ID. If the ID is
  // null, it means that the document does not exist.
  if (usePersistentStore.getState().local.id === null) {
    // If there is no local store document, create one
    const localStore = {
      // Use the app instance ID as the store document's ID
      // so that it can be matched to the app instance.
      id: core.appId,
      data: {},
    };

    // Load the document into the store
    usePersistentStore.getState().load('local', localStore);

    // Dispatch a 'persistent-store:create-local' event to
    // trigger the resource connector's document creation
    core.dispatch('persistent-store:create-local', localStore);
  }
}
