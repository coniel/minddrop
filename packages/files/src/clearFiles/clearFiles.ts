import { Core } from '@minddrop/core';

/**
 * Clears file references from the store by dispatching a `files:clear` event.
 *
 * @param core A MindDrop core instance.
 */
export function clearFileReferences(core: Core): void {
  // Dispatch 'files:clear' event
  core.dispatch('files:clear');
}
