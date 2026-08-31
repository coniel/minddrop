import { Events } from '@minddrop/events';
import { ContentColor } from '@minddrop/ui-theme';
import { entityId } from '@minddrop/utils';
import { TagsStore } from '../TagsStore';
import { DefaultTagIcon } from '../constants';
import { TagCreatedEvent } from '../events';
import { getTagGroup } from '../getTagGroup';
import { Tag, TagGroupId } from '../types';
import { resolveNextTagColor, validateTagName } from '../utils';
import { writeTag } from '../writeTag';

/**
 * Creates a new tag, adding it to the store and writing it to the
 * file system.
 *
 * @param name - The name of the tag.
 * @param color - The tag color, defaults to the next color in the rotation.
 * @param group - The ID of the group to assign the tag to.
 * @returns The created tag.
 *
 * @throws InvalidParameterError if the name is empty or already in use.
 * @throws TagGroupNotFoundError if the group does not exist.
 *
 * @dispatches tags:tag:created
 */
export async function createTag(
  name: string,
  color?: ContentColor,
  group?: TagGroupId,
): Promise<Tag> {
  // Validate and trim the tag name
  const validatedName = validateTagName(name);

  // Validate that the group exists when assigning one
  if (group) {
    getTagGroup(group);
  }

  // Generate the tag object
  const tag: Tag = {
    id: entityId('tag'),
    created: new Date(),
    lastModified: new Date(),
    name: validatedName,
    color: color || resolveNextTagColor(),
    icon: DefaultTagIcon,
  };

  // Assign the group when given
  if (group) {
    tag.group = group;
  }

  // Add the tag to the store
  TagsStore.set(tag);

  // Write the tag config to the file system
  await writeTag(tag.id);

  // Dispatch the tag created event
  Events.dispatch(TagCreatedEvent, tag);

  return tag;
}
