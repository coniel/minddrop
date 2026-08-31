import { Events } from '@minddrop/events';
import { Icons } from '@minddrop/ui-icons';
import { TagsStore } from '../TagsStore';
import { TagRenamedEvent, TagUpdatedEvent } from '../events';
import { getTag } from '../getTag';
import { getTagGroup } from '../getTagGroup';
import { Tag, UpdateTagData } from '../types';
import { validateTagName } from '../utils';
import { writeTag } from '../writeTag';

/**
 * Updates a tag, updating it in the store and writing it to the
 * file system.
 *
 * @param tagId - The ID of the tag to update.
 * @param data - The tag data.
 * @returns The updated tag.
 *
 * @throws InvalidParameterError if the new name is empty or already in use.
 * @throws TagGroupNotFoundError if the assigned group does not exist.
 *
 * @dispatches tags:tag:updated
 * @dispatches tags:tag:renamed
 */
export async function updateTag(
  tagId: string,
  data: UpdateTagData,
): Promise<Tag> {
  // Get the tag
  const tag = getTag(tagId);

  // Split the group assignment from the plain field updates
  const { group, ...update } = data;

  // Validate and trim the new name when renaming
  if (typeof update.name === 'string') {
    update.name = validateTagName(update.name, tagId);
  }

  // Generate the updated tag object
  const updatedTag: Tag = {
    ...tag,
    ...update,
    lastModified: new Date(),
  };

  // Assign the group when given, validating that it exists
  if (group) {
    getTagGroup(group);
    updatedTag.group = group;
  }

  // Clear the group when explicitly unset
  if (group === null) {
    delete updatedTag.group;
  }

  // Keep the icon and color in sync: an updated icon carries its
  // color to the tag, an updated color recolors the icon
  if (update.icon && update.color === undefined) {
    const iconColor = Icons.resolveColor(update.icon);

    if (iconColor) {
      updatedTag.color = iconColor;
    }
  } else if (update.color && update.icon === undefined) {
    updatedTag.icon = Icons.applyColor(updatedTag.icon, update.color);
  }

  // Replace the tag in the store
  TagsStore.set(updatedTag);

  // Write the tag config to the file system
  await writeTag(tagId);

  // Dispatch the tag updated event
  await Events.dispatch(TagUpdatedEvent, {
    original: tag,
    updated: updatedTag,
  });

  // Dispatch the tag renamed event when the name changed
  if (tag.name !== updatedTag.name) {
    await Events.dispatch(TagRenamedEvent, {
      original: tag,
      updated: updatedTag,
    });
  }

  return updatedTag;
}
