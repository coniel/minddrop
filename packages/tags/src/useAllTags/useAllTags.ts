import { TagMap } from '../types';
import { useTagsStore } from '../useTagsStore';

/**
 * Returns a `{ [id]: Tag }` map of all tags.
 *
 * @returns A `{ [id]: Tag }` map of all tags.
 */
export function useAllTags(): TagMap {
  const { tags } = useTagsStore();

  return tags;
}
