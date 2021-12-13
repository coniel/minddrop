import { Core } from '@minddrop/core';
import { getFileReference } from '../getFileReference';

/**
 * Permanently deletes a file and removes its file reference from the store.
 * Alos dispatches a `files:delete` event.
 *
 * @param core A MindDrop core instance.
 * @param fileId The ID of the file to delete.
 */
export function deleteFile(core: Core, fileId: string): void {
  const file = getFileReference(fileId);

  // Dispatch 'files:delete' event
  core.dispatch('files:delete', file);
}
