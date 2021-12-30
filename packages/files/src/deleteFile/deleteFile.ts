import { Core } from '@minddrop/core';
import { FileReference } from '../types';
import { getFileReference } from '../getFileReference';
import { useFileReferencesStore } from '../useFileReferencesStore';

/**
 * Permanently deletes a file and removes its file reference from the store.
 * Alos dispatches a `files:delete` event.
 *
 * @param core A MindDrop core instance.
 * @param fileId The ID of the file to delete.
 * @retuns The reference of the deleted file.
 */
export function deleteFile(core: Core, fileId: string): FileReference {
  const file = getFileReference(fileId);

  // Remove the file from the store
  useFileReferencesStore.getState().removeFileReference(fileId);

  // Dispatch 'files:delete' event
  core.dispatch('files:delete', file);

  return file;
}
