import { Events } from '@minddrop/events';
import { Icons } from '@minddrop/ui-icons';
import { ContentColor } from '@minddrop/ui-theme';
import { entityId } from '@minddrop/utils';
import { TagsStore } from '../TagsStore';
import { DefaultTagIcon } from '../constants';
import { TagCreatedEvent } from '../events';
import { getTagGroup } from '../getTagGroup';
import { Tag } from '../types';
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
  group?: string,
): Promise<Tag> {
  // Validate and trim the tag name
  const validatedName = validateTagName(name);

  // Validate that the group exists when assigning one
  const tagGroup = group ? getTagGroup(group) : null;

  // The tag's color, defaulting to the next one in the rotation
  const tagColor = color || resolveNextTagColor();

  // Generate the tag object, with the default icon in the tag's
  // color
  const tag: Tag = {
    id: entityId('tag'),
    created: new Date(),
    lastModified: new Date(),
    name: validatedName,
    color: tagColor,
    icon: Icons.applyColor(DefaultTagIcon, tagColor),
  };

  // Assign the group when given
  if (tagGroup) {
    tag.group = tagGroup.id;
  }

  // Add the tag to the store
  TagsStore.set(tag);

  // Dispatch the tag created event
  Events.dispatch(TagCreatedEvent, tag);

  // Write the tag config to the file system
  await writeTag(tag.id);

  return tag;
}
