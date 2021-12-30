import { Core } from '@minddrop/core';
import { updateFileReference } from '..';
import { deleteFile } from '../deleteFile';
import { getFileReference } from '../getFileReference';
import { FileReference } from '../types';

/**
 * Replaces the resource IDs (removing the current ones and
 * adding the given ones) in file reference's `attachedTo` value.
 *
 * If `resourceIds` is an empty array, the file will be deleted.
 *
 * Dispatches a `files:replace-attachments` event as well as
 * a `files:update-file-reference` event unless the file was
 * deleted, in which case a `files:delete` event is dispatched.
 *
 * Returns the updated file reference.
 *
 * @param core A MindDrop core instance.
 * @param fileId The ID of the file for which to replace the attachments.
 * @param resourceIds The IDs of the resources to which the file was attached.
 * @returns The updated file reference.
 */
export function replaceAttachments(
  core: Core,
  fileId: string,
  resourceIds: string[],
): FileReference {
  // If replacing with an empty array, delete the file
  if (resourceIds.length === 0) {
    return deleteFile(core, fileId);
  }

  const reference = getFileReference(fileId);

  // Update the file reference
  const updated = updateFileReference(core, fileId, {
    attachedTo: resourceIds,
  });

  // Dispatch a 'files:replace-attachments' event
  core.dispatch('files:replace-attachments', {
    reference: updated,
    oldResourceIds: reference.attachedTo,
    newResourceIds: resourceIds,
  });

  return updated;
}
