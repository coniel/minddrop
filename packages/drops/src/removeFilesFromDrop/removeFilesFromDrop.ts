import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { Files } from '@minddrop/files';
import { Drop } from '../types';
import { updateDrop } from '../updateDrop';

/**
 * Removes files from a drop and dispatches a `drops:add-files` event
 * and a `drops:update` event.
 *
 * The file references of the removed files will be automatically updated
 * to remove the drop ID from their `attachedTo` value, and deleted if the
 * drop was their only attachment.
 *
 * @param core A MindDrop core instance.
 * @param dropId The ID of the drop from which to remove the files.
 * @param fileIds The IDs of the files to remove.
 * @returns The updated drop.
 */
export function removeFilesFromDrop(
  core: Core,
  dropId: string,
  fileIds: string[],
): Drop {
  const files = Files.get(fileIds);

  // Remove the files from the drop
  const drop = updateDrop(core, dropId, {
    files: FieldValue.arrayRemove(fileIds),
  });

  // Remove drop as an attachment from the files
  fileIds.forEach((fileId) => {
    files[fileId] = Files.removeAttachments(core, fileId, [dropId]);
  });

  // Dispatch 'drops:remove-files' event
  core.dispatch('drops:remove-files', { drop, files });

  return drop;
}
