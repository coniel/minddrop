import { TagsStore } from '../../TagsStore';
import { Tag } from '../../types';

/**
 * Returns the most recently created tags, newest first.
 *
 * @param limit - Maximum number of tags to return.
 * @returns The most recently created tags.
 */
export function getRecentTags(limit: number): Tag[] {
  // Sort a copy by creation date, newest first, and cap the result
  // at the limit.
  return [...TagsStore.getAllArray()]
    .sort((tagA, tagB) => tagB.created.getTime() - tagA.created.getTime())
    .slice(0, limit);
}
