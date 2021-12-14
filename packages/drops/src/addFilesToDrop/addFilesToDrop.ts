import { Core } from '@minddrop/core';
import { Files } from '@minddrop/files';
import { FieldValue } from '@minddrop/utils';
import { Drop } from '../types';
import { updateDrop } from '../updateDrop';

/**
 * Adds files to a drop and dispatches a `drops:add-files` event
 * and a `drops:update` event.
 *
 * The file references of the attached files will be automatically
 * updated to include the drop ID in their `attachedTo` value.
 *
 * @param core A MindDrop core instance.
 * @param dropId The ID of the drop to which to add the files.
 * @param fileIds The IDs of the files to add to the drop.
 * @returns The updated drop.
 */
export function addFilesToDrop(
  core: Core,
  dropId: string,
  fileIds: string[],
): Drop {
  // Check that files exist
  const files = Files.get(fileIds);

  // Update the drop
  const drop = updateDrop(core, dropId, {
    files: FieldValue.arrayUnion(fileIds),
  });

  // Adds drop at attachment to the files
  fileIds.forEach((fileId) => {
    Files.addAttachments(core, fileId, [dropId]);
  });

  // Dispatch 'dropd:add-files' event
  core.dispatch('drops:add-files', {
    drop,
    files,
  });

  return drop;
}
