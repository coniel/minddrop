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
  const removedFiles = drop.files ? Files.get(drop.files) : [];

  const updated = updateDrop(core, dropId, {
    files: fileIds,
  });

  core.dispatch('drops:replace-files', {
    drop: updated,
    addedFiles,
    removedFiles,
  });

  return updated;
}
