import { Events } from '@minddrop/events';
import { ContentColor } from '@minddrop/ui-theme';
import { entityId } from '@minddrop/utils';
import { TagsStore } from '../TagsStore';
import { TagCreatedEvent } from '../events';
import { Tag } from '../types';
import { resolveNextTagColor, validateTagName } from '../utils';
import { writeTag } from '../writeTag';

/**
 * Creates a new tag, adding it to the store and writing it to the
 * file system.
 *
 * @param name - The name of the tag.
 * @param color - The tag color, defaults to the next color in the rotation.
 * @returns The created tag.
 *
 * @throws InvalidParameterError if the name is empty or already in use.
 *
 * @dispatches tags:tag:created
 */
export async function createTag(
  name: string,
  color?: ContentColor,
): Promise<Tag> {
  // Validate and trim the tag name
  const validatedName = validateTagName(name);

  // Generate the tag object
  const tag: Tag = {
    id: entityId('tag'),
    created: new Date(),
    lastModified: new Date(),
    name: validatedName,
    color: color || resolveNextTagColor(),
  };

  // Add the tag to the store
  TagsStore.set(tag);

  // Write the tag config to the file system
  await writeTag(tag.id);

  // Dispatch the tag created event
  Events.dispatch(TagCreatedEvent, tag);

  return tag;
}
