import { TagMap } from '../types';
import { useTagsStore } from '../useTagsStore';

/**
 * Returns a { [id]: Tag } map of tags matching the provided IDs.
 *
 * @param tagIds The IDs of the tags to retrieve.
 * @returns A `[id]: Tag` map of the requested tags.
 */
export function useTags(tagIds: string[]): TagMap {
  const { tags } = useTagsStore();

  return tagIds.reduce(
    (map, tagId) => (tags[tagId] ? { ...map, [tagId]: tags[tagId] } : map),
    {},
  );
}
