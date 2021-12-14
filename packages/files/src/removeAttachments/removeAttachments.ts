import { Core } from '@minddrop/core';
import { createUpdate, FieldValue } from '@minddrop/utils';
import { updateFileReference } from '..';
import { deleteFile } from '../deleteFile';
import { getFileReference } from '../getFileReference';
import { FileReference } from '../types';

/**
 * Removes resource IDs from a file reference's `attachedTo` value.
 *
 * If the file reference's `attachedTo` value becomes empty, the
 * files is deleted.
 *
 * Dispatches a `files:replace-attachments` event as well as
 * a `files:update-file-reference` event unless the file was
 * deleted, in which case a `files:delete` event is dispatched.
 *
 * Returns the updated file reference.
 *
 * @param core A MindDrop core instance.
 * @param fileId The ID of the file from which to remove the attachments.
 * @param resourceIds The IDs of the resources to remove from the attachedTo value.
 * @returns The updated file reference.
 */
export function removeAttachments(
  core: Core,
  fileId: string,
  resourceIds: string[],
): FileReference {
  const reference = getFileReference(fileId);
  const update = createUpdate(reference, {
    attachedTo: FieldValue.arrayRemove(resourceIds),
  });

  // If all attachemnts were removed, delete the file
  if (update.after.attachedTo.length === 0) {
    return deleteFile(core, fileId);
  }

  // Update the file reference
  const updated = updateFileReference(core, fileId, {
    attachedTo: FieldValue.arrayRemove(resourceIds),
  });

  // Dispatch a 'files:remove-attachments' event
  core.dispatch('files:remove-attachments', {
    reference: updated,
    resourceIds,
  });

  return updated;
}
