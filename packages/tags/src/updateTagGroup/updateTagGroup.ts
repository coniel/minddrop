import { Events } from '@minddrop/events';
import { TagGroupsStore } from '../TagGroupsStore';
import { TagGroupUpdatedEvent } from '../events';
import { getTagGroup } from '../getTagGroup';
import { TagGroup, UpdateTagGroupData } from '../types';
import { validateTagGroupName } from '../utils';
import { writeTagGroup } from '../writeTagGroup';

/**
 * Updates a tag group, updating it in the store and writing it to
 * the file system.
 *
 * @param groupId - The ID of the tag group to update.
 * @param data - The tag group data.
 * @returns The updated tag group.
 *
 * @throws InvalidParameterError if the new name is empty or already in use.
 *
 * @dispatches tags:group:updated
 */
export async function updateTagGroup(
  groupId: string,
  data: UpdateTagGroupData,
): Promise<TagGroup> {
  // Get the tag group
  const group = getTagGroup(groupId);

  // Validate and trim the new name when renaming
  const update: UpdateTagGroupData = { ...data };

  if (typeof update.name === 'string') {
    update.name = validateTagGroupName(update.name, groupId);
  }

  // Generate the updated group object
  const updatedGroup: TagGroup = {
    ...group,
    ...update,
    lastModified: new Date(),
  };

  // Update the group in the store
  TagGroupsStore.update(groupId, {
    ...update,
    lastModified: new Date(),
  });

  // Write the group config to the file system
  await writeTagGroup(groupId);

  // Dispatch the tag group updated event
  await Events.dispatch(TagGroupUpdatedEvent, {
    original: group,
    updated: updatedGroup,
  });

  return updatedGroup;
}
