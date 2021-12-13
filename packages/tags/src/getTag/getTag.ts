import { Tag } from '../types';
import { useTagsStore } from '../useTagsStore';
import { TagNotFoundError } from '../errors';

/**
 * Retrieves a tag by ID from the tags store.
 *
 * @param id The tag ID.
 * @returns The requested tag.
 */
export function getTag(id: string): Tag {
  const tag = useTagsStore.getState().tags[id];

  if (!tag) {
    throw new TagNotFoundError();
  }

  return tag;
}
