import { Core } from '@minddrop/core';
import { useExtensionsStore } from '../useExtensionsStore';

/**
 * Clears the extensions store.
 *
 * @param core A MindDrop core extension.
 */
export function clearExtensions(core: Core): void {
  // Clear the store
  useExtensionsStore.getState().clear();

  // Dispatch 'extensions:clear' event
  core.dispatch('extensions:clear');
}
