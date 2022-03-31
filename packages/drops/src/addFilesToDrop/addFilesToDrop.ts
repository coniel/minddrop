import { Core } from '@minddrop/core';
import { Files } from '@minddrop/files';
import { FieldValue } from '@minddrop/utils';
import { Drop } from '../types';
import { updateDrop } from '../updateDrop';

/**
 * Adds files to a drop and dispatches a `drops:add-files`.
 * Returns the updated drop.
 *
 * The drop is added as a parent on the files.
 *
 * - Throws a `DropNotFoundError` if the drop does not exist.
 * - Throws a `FileReferenceNotFoundError` if any of the file
 *   references do not exist.
 *
 * @param core A MindDrop core instance.
 * @param dropId The ID of the drop to which to add the files.
 * @param fileIds The IDs of the files to add to the drop.
 * @returns The updated drop.
 */
export function addFilesToDrop<TDrop extends Drop = Drop>(
  core: Core,
  dropId: string,
  fileIds: string[],
): TDrop {
  // Check that files exist
  const files = Files.get(fileIds);

  // Update the drop, adding the file IDs to its files
  const drop = updateDrop<TDrop>(core, dropId, {
    files: FieldValue.arrayUnion(fileIds),
  });

  // Add drop as a parent on the files
  fileIds.forEach((fileId) => {
    // Update the file in the files map
    files[fileId] = Files.addAttachments(core, fileId, [dropId]);
  });

  // Dispatch a 'dropd:add-files' event
  core.dispatch('drops:add-files', { drop, files });

  // Return the updated drop
  return drop;
}
