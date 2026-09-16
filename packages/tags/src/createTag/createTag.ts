import { Events } from '@minddrop/events';
import { Icons } from '@minddrop/ui-icons';
import { ContentColor } from '@minddrop/ui-theme';
import { entityId } from '@minddrop/utils';
import { TagsStore } from '../TagsStore';
import { DefaultTagIcon, TagEntityType } from '../constants';
import { TagCreatedEvent } from '../events';
import { Tag } from '../types';
import { validateTagName } from '../utils';
import { writeTag } from '../writeTag';

/**
 * Creates a new tag, adding it to the store and writing it to the
 * file system.
 *
 * @param name - The name of the tag.
 * @param color - The tag color.
 * @returns The created tag.
 *
 * @throws InvalidParameterError if the name is empty or already in use.
 *
 * @dispatches tags:tag:created
 */
export async function createTag(
  name: string,
  color: ContentColor = 'default',
): Promise<Tag> {
  // Validate and trim the tag name
  const validatedName = validateTagName(name);

  // Generate the tag object, with the default icon in the tag's
  // color.
  const tag: Tag = {
    id: entityId(TagEntityType),
    created: new Date(),
    lastModified: new Date(),
    name: validatedName,
    color,
    icon: Icons.applyColor(DefaultTagIcon, color),
  };

  // Add the tag to the store
  TagsStore.set(tag);

  // Dispatch the tag created event
  Events.dispatch(TagCreatedEvent, tag);

  // Write the tag config to the file system
  await writeTag(tag.id);

  return tag;
}
