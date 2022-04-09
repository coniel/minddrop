import { Tag } from '../types';
import { TagNotFoundError } from '../errors';
import { TagsStore } from '../TagsStore';

/**
 * Retrieves a tag by ID.
 *
 * @param id The ID of the tag to retrieve.
 * @returns The requested tag.
 */
export function getTag(tagId: string): Tag {
  // Get the tag from the store
  const tag = TagsStore.get(tagId);

  if (!tag) {
    // If the tag does not exist, throw a `TagNotFoundError`.
    // providing the tag ID.
    throw new TagNotFoundError(tagId);
  }

  return tag;
}
