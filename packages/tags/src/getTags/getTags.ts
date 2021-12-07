import { TagMap } from '../types';
import { useTagsStore } from '../useTagsStore';
import { TagNotFoundError } from '../errors';

/**
 * Retrieves tags by ID from the tags store.
 *
 * @param ids An array of tag IDs to retrieve.
 * @returns The requested tags as a `[id]: Tag` map.
 */
export function getTags(ids: string[]): TagMap {
  const { tags } = useTagsStore.getState();
  const requested = ids.reduce(
    (map, id) => (tags[id] ? { ...map, [id]: tags[id] } : map),
    {},
  );

  if (Object.keys(requested).length !== ids.length) {
    throw new TagNotFoundError();
  }

  return requested;
}
