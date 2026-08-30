import { TagsStore } from '../TagsStore';
import { TagNotFoundError } from '../errors';
import { Tag } from '../types';

/**
 * Retrieves a tag from the store by name (case-insensitive).
 *
 * @param name - The name of the tag.
 * @param throwOnNotFound - Whether to throw an error if the tag is not found.
 * @returns The tag object.
 *
 * @throws {TagNotFoundError} If the tag does not exist.
 */
export function getTagByName(name: string): Tag;
export function getTagByName(name: string, throwOnNotFound: false): Tag | null;
export function getTagByName(name: string, throwOnNotFound = true): Tag | null {
  // Find the tag by name, ignoring case
  const tag = TagsStore.getAllArray().find(
    (candidate) => candidate.name.toLowerCase() === name.toLowerCase(),
  );

  // Throw an error if it doesn't exist, unless specified not to
  if (!tag && throwOnNotFound) {
    throw new TagNotFoundError(name);
  } else if (!tag && !throwOnNotFound) {
    return null;
  }

  return tag || null;
}
