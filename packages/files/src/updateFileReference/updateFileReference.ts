import { Core } from '@minddrop/core';
import { createUpdate } from '@minddrop/utils';
import { getFileReference } from '../getFileReference';
import { FileReference, FileReferenceChanges } from '../types';
import { useFileReferencesStore } from '../useFileReferencesStore';

/**
 * Updates a file reference and dispatches a
 * `files:update-file-reference` event.
 *
 * @param core A MindDrop core instance.
 * @param fileReferenceId The ID of the file reference to update.
 * @param data The update data.
 * @returns The updated file reference.
 */
export function updateFileReference(
  core: Core,
  fileReferenceId: string,
  data: FileReferenceChanges,
): FileReference {
  const reference = getFileReference(fileReferenceId);
  const update = createUpdate(reference, data);

  // Update file reference in the store
  useFileReferencesStore.getState().setFileReference(update.after);

  // Dispatch 'files:update-file-reference' event
  core.dispatch('files:update-file-reference', update);

  return update.after;
}
