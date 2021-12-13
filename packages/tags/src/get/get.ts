import { getTag } from '../getTag';
import { getTags } from '../getTags';
import { Tag, TagMap } from '../types';

/**
 * Retrieves one or more tags by ID.
 *
 * If provided a single ID string, returns the tag.
 *
 * If provided an array of IDs, returns a `{ [id]: Tag }` map of the corresponding tags.
 *
 * @param ids An array of tag IDs to retrieve.
 * @returns The requested tag(s).
 */
export function get(tagId: string): Tag;
export function get(tagIds: string[]): TagMap;
export function get(tagId: string | string[]): Tag | TagMap {
  if (Array.isArray(tagId)) {
    return getTags(tagId);
  }

  return getTag(tagId);
}
