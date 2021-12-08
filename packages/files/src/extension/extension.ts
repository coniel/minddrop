import { Core } from '@minddrop/core';
import { Files } from '../Files';
import { useFileReferencesStore } from '../useFileReferencesStore';

export function onRun(core: Core) {
  // Listen to files:load events and load files into the store
  Files.addEventListener(core, 'files:load', (payload) =>
    useFileReferencesStore.getState().loadFileReferences(payload.data),
  );

  // Listen to files:clear events and clear the store
  Files.addEventListener(
    core,
    'files:clear',
    useFileReferencesStore.getState().clear,
  );

  // Listen to files:create events and add new file references to the store
  Files.addEventListener(core, 'files:create', (payload) =>
    useFileReferencesStore.getState().addFileReference(payload.data.reference),
  );

  // Listen to files:delete events and remove files from the store
  Files.addEventListener(core, 'files:delete', (payload) =>
    useFileReferencesStore.getState().removeFileReference(payload.data.id),
  );
}

export function onDisable(core: Core) {
  // Clear the store
  useFileReferencesStore.getState().clear();
  // Remove event listeners
  core.removeAllEventListeners();
}
