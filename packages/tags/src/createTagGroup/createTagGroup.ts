import { Events } from '@minddrop/events';
import { entityId } from '@minddrop/utils';
import { TagGroupsStore } from '../TagGroupsStore';
import { TagGroupCreatedEvent } from '../events';
import { TagGroup } from '../types';
import { validateTagGroupName } from '../utils';
import { writeTagGroup } from '../writeTagGroup';

/**
 * Creates a new tag group, adding it to the store and writing it
 * to the file system.
 *
 * @param name - The name of the group.
 * @returns The created tag group.
 *
 * @throws InvalidParameterError if the name is empty or already in use.
 *
 * @dispatches tags:group:created
 */
export async function createTagGroup(name: string): Promise<TagGroup> {
  // Validate and trim the group name
  const validatedName = validateTagGroupName(name);

  // Generate the tag group object
  const group: TagGroup = {
    id: entityId('tag-group'),
    created: new Date(),
    lastModified: new Date(),
    name: validatedName,
  };

  // Add the group to the store
  TagGroupsStore.set(group);

  // Write the group config to the file system
  await writeTagGroup(group.id);

  // Dispatch the tag group created event
  Events.dispatch(TagGroupCreatedEvent, group);

  return group;
}
