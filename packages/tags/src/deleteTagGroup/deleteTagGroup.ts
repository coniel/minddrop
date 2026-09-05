import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { TagGroupsStore } from '../TagGroupsStore';
import { TagGroupDeletedEvent } from '../events';
import { getGroupTags } from '../getGroupTags';
import { getTagGroup } from '../getTagGroup';
import { updateTag } from '../updateTag';
import { resolveTagGroupFilePath } from '../utils';

/**
 * Deletes a tag group, removing it from the store and deleting it
 * from the file system. The group's member tags are ungrouped
 * rather than deleted.
 *
 * @param groupId - The ID of the tag group to delete.
 *
 * @dispatches tags:tag:updated
 * @dispatches tags:group:deleted
 */
export async function deleteTagGroup(groupId: string): Promise<void> {
  // Get the tag group
  const group = getTagGroup(groupId);

  // Ungroup the group's member tags
  for (const tag of getGroupTags(groupId)) {
    await updateTag(tag.id, { group: null });
  }

  // Delete the group from the store
  TagGroupsStore.remove(groupId);

  // Dispatch the tag group deleted event
  Events.dispatch(TagGroupDeletedEvent, group);

  // Delete the group file from the file system
  await Fs.removeFile(resolveTagGroupFilePath(groupId));
}
