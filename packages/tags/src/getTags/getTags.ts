import { TagMap } from '../types';
import { TagNotFoundError } from '../errors';
import { TagsStore } from '../TagsStore';

/**
 * Retrieves tags by ID from the tags store.
 *
 * @param tagIds An array of tag IDs to retrieve.
 * @returns The requested tags as a `{ [id]: Tag }` map.
 */
export function getTags(tagIds: string[]): TagMap {
  // Get all tags
  const allTags = TagsStore.getAll();

  // Get the requested tags
  const tags = tagIds.reduce(
    (map, id) => (allTags[id] ? { ...map, [id]: allTags[id] } : map),
    {},
  );

  if (Object.keys(tags).length !== tagIds.length) {
    // Get the IDs of missing tags
    const missing = tagIds.filter((id) => !tags[id]);

    // Throw a `TagNotFoundError`, providing the missing tag IDs
    throw new TagNotFoundError(missing);
  }

  return tags;
}
