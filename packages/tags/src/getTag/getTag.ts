import { TagsStore } from '../TagsStore';
import { TagNotFoundError } from '../errors';
import { Tag } from '../types';

/**
 * Retrieves a tag from the store by ID.
 *
 * @param id - The ID of the tag.
 * @param throwOnNotFound - Whether to throw an error if the tag is not found.
 * @returns The tag object.
 *
 * @throws {TagNotFoundError} If the tag does not exist.
 */
export function getTag(id: string): Tag;
export function getTag(id: string, throwOnNotFound: false): Tag | null;
export function getTag(id: string, throwOnNotFound = true): Tag | null {
  // Get the tag from the store
  const tag = TagsStore.get(id);

  // Throw an error if it doesn't exist, unless specified not to
  if (!tag && throwOnNotFound) {
    throw new TagNotFoundError(id);
  } else if (!tag && !throwOnNotFound) {
    return null;
  }

  return tag;
}
