import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { History } from '@minddrop/history';
import { TagsStore } from '../TagsStore';
import { TagHistoryCauses } from '../constants';
import { TagDeletedEvent } from '../events';
import { getTag } from '../getTag';
import { resolveTagFilePath } from '../utils';

/**
 * Deletes a tag, removing it from the store and deleting it from the
 * file system.
 *
 * @param tagId - The ID of the tag to delete.
 *
 * @dispatches tags:tag:deleted
 */
export async function deleteTag(tagId: string): Promise<void> {
  // Get the tag
  const tag = getTag(tagId);

  // Delete the tag from the store
  TagsStore.remove(tagId);

  // Dispatch the tag deleted event
  Events.dispatch(TagDeletedEvent, {
    ...tag,
    action: History.createAction(TagHistoryCauses.TagDeleted),
  });

  // Delete the tag file from the file system
  await Fs.removeFile(resolveTagFilePath(tagId));
}
