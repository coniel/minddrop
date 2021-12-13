import { Core } from '@minddrop/core';
import { FileReference } from '../types';
import { useFileReferencesStore } from '../useFileReferencesStore';

export function onRun(core: Core) {
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
