import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { updateFileReference } from '..';
import { FileReference } from '../types';

/**
 * Adds resource IDs to a file reference's `attachedTo` value and
 * dispatches a `files:add-attachments` event as well as a
 * `files:update-file-reference` event.
 * Returns the updated file reference.
 *
 * @param core A MindDrop core instance.
 * @param fileId The ID of the file to which to add the attachments.
 * @param resourceIds The IDs of the resources attached to the file.
 * @returns The updated file reference.
 */
export function addAttachments(
  core: Core,
  fileId: string,
  resourceIds: string[],
): FileReference {
  // Update the file reference
  const updated = updateFileReference(core, fileId, {
    attachedTo: FieldValue.arrayUnion(resourceIds),
  });

  // Dispatch a 'files:add-attachments' event
  core.dispatch('files:add-attachments', { reference: updated, resourceIds });

  return updated;
}
