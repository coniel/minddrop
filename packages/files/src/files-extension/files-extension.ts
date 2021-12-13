import { Core } from '@minddrop/core';
import { Files } from '../Files';
import { FileReference } from '../types';
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

  // Register the files:file-reference resource
  core.registerResource<FileReference>({
    type: 'files:file-reference',
    createEvent: 'files:create',
    updateEvent: 'files:update',
    deleteEvent: 'files:delete',
    onLoad: (files) =>
      useFileReferencesStore.getState().loadFileReferences(files),
    onChange: (file, deleted) => {
      const store = useFileReferencesStore.getState();
      if (deleted) {
        store.removeFileReference(file.id);
      } else {
        store.loadFileReferences([file]);
      }
    },
  });
}

export function onDisable(core: Core) {
  // Clear the store
  useFileReferencesStore.getState().clear();
  // Remove event listeners
  core.removeAllEventListeners();
}
