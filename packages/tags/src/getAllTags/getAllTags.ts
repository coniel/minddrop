import { TagsStore } from '../TagsStore';
import { TagMap } from '../types';

/**
 * Retrieves all tags from the tags store as
 * a `{ [id]: Tag }` map.
 *
 * @returns A map of all tags.
 */
export function getAllTags(): TagMap {
  // Return all tags from the store
  return TagsStore.getAll();
}
