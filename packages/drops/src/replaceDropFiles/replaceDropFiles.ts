import { Core } from '@minddrop/core';
import { Files } from '@minddrop/files';
import { getDrop } from '../getDrop';
import { Drop } from '../types';
import { updateDrop } from '../updateDrop';

/**
 * Replaces a drop's files, removing the current ones and
 * adding the new ones. Dispatches a `drops:replace-files` event
 * and a `drops:update` event.
 *
 * The file references of the added files will be automatically
 * updated to include the drop ID in their `attachedTo` value.
 *
 * The file references of the removed files will be automatically
 * updated to remove the drop ID from their `attachedTo` value, and
 * deleted if the drop was their only attachment.
 *
 * @param core A MindDrop core instance.
 * @param dropId The ID of the drop in which to replace the files.
 * @param fileIds The IDs of the files to add to the drop.
 * @returns The updated drop.
 */
export function replaceDropFiles(
  core: Core,
  dropId: string,
  fileIds: string[],
): Drop {
  const drop = getDrop(dropId);
  const addedFiles = Files.get(fileIds);
  const removedFiles = drop.files ? Files.get(drop.files) : {};

  const updated = updateDrop(core, dropId, {
    files: fileIds,
  });

  // Remove drop as attachment from removed files
  Object.keys(removedFiles).forEach((fileId) => {
    Files.removeAttachments(core, fileId, [dropId]);
  });

  // Adds drop as an attachment to added files
  fileIds.forEach((fileId) => {
    Files.addAttachments(core, fileId, [dropId]);
  });

  core.dispatch('drops:replace-files', {
    drop: updated,
    addedFiles,
    removedFiles,
  });

  return updated;
}
