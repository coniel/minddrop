import { Events } from '@minddrop/events';
import { TagsStore } from '../TagsStore';
import { TagUpdatedEvent } from '../events';
import { getTag } from '../getTag';
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
 *
 * @dispatches tags:tag:updated
 */
export async function updateTag(
  tagId: string,
  data: UpdateTagData,
): Promise<Tag> {
  // Get the tag
  const tag = getTag(tagId);

  // Validate and trim the new name when renaming
  const update: UpdateTagData = { ...data };

  if (typeof update.name === 'string') {
    update.name = validateTagName(update.name, tagId);
  }

  // Generate the updated tag object
  const updatedTag: Tag = {
    ...tag,
    ...update,
    lastModified: new Date(),
  };

  // Update the tag in the store
  TagsStore.update(tagId, {
    ...update,
    lastModified: new Date(),
  });

  // Write the tag config to the file system
  await writeTag(tagId);

  // Dispatch the tag updated event
  await Events.dispatch(TagUpdatedEvent, {
    original: tag,
    updated: updatedTag,
  });

  return updatedTag;
}
