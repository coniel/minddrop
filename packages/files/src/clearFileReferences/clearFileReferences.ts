import { Core } from '@minddrop/core';
import { useFileReferencesStore } from '../useFileReferencesStore';

/**
 * Clears file references from the store and dispatches a `files:clear` event.
 *
 * @param core A MindDrop core instance.
 */
export function clearFileReferences(core: Core): void {
  // Clears file references from the store
  useFileReferencesStore.getState().clear();

  // Dispatch 'files:clear' event
  core.dispatch('files:clear');
}
