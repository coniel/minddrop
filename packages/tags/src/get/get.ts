import { getTag } from '../getTag';
import { getTags } from '../getTags';
import { Tag, TagMap } from '../types';

/**
 * Retrieves one or more tags by ID.
 * - If provided a single ID string, returns the tag.
 * - If provided an array of IDs, returns a
 * `{ [id]: Tag }` map of the corresponding tags.
 *
 * - Throws a `TagNotFound` error if any of the requested
 *   tags do not exist.
 *
 * @param ids An array of tag IDs to retrieve.
 * @returns The requested tag(s).
 */
export function get(tagId: string): Tag;
export function get(tagIds: string[]): TagMap;
export function get(tagId: string | string[]): Tag | TagMap {
  if (Array.isArray(tagId)) {
    // If multiple IDs were given, get the
    // requested tags as a map.
    return getTags(tagId);
  }

  // Return a single tag
  return getTag(tagId);
}
