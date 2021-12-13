import { TagMap } from '../types';
import { useTagsStore } from '../useTagsStore';

/**
 * Retrieves all tags from the tags store as a `{ [id]: Tag }` map.
 *
 * @returns A `{ [id]: Tag }` map.
 */
export function getAllTags(): TagMap {
  const { tags } = useTagsStore.getState();

  return tags;
}
