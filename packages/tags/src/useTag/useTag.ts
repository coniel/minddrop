import { Tag } from '../types';
import { useTagsStore } from '../useTagsStore';

/**
 * Returns a tag by ID or `null` if no tag was found.
 *
 * @param tagId The ID of the tag to retrieve.
 * @returns The requested tag or null.
 */
export function useTag(tagId: string): Tag | null {
  const { tags } = useTagsStore();
  return tags[tagId] || null;
}
