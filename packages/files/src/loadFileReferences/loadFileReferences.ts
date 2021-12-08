import { Core } from '@minddrop/core';
import { FileReference } from '../types';

/**
 * Loads file references into the store by dispatching a `files:load` event.
 *
 * @param core A MindDrop core instance.
 * @param files The file references to load.
 */
export function loadFileReferences(core: Core, files: FileReference[]): void {
  // Dispatch 'files:load' event
  core.dispatch('files:load', files);
}
