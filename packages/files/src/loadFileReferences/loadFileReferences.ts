import { Core } from '@minddrop/core';
import { FileReference } from '../types';
import { useFileReferencesStore } from '../useFileReferencesStore';

/**
 * Loads file references into the store and dispatches a `files:load` event.
 *
 * @param core A MindDrop core instance.
 * @param files The file references to load.
 */
export function loadFileReferences(core: Core, files: FileReference[]): void {
  // Load files references into the store
  useFileReferencesStore.getState().loadFileReferences(files);

  // Dispatch 'files:load' event
  core.dispatch('files:load', files);
}
