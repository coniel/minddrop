import { fuzzySearchBy } from '@minddrop/utils';
import { TagsStore } from '../../TagsStore';
import { Tag } from '../../types';

/**
 * Performs a fuzzy search on tag names.
 *
 * @param query - The search query.
 * @param tags - IDs of the tags to include. All tags are included when omitted.
 * @returns The matched tags ranked by match quality.
 */
export function searchTags(query: string, tags?: string[]): Tag[] {
  const allTags = TagsStore.getAllArray();

  // Filter tags to the given IDs when provided
  const searchedTags = tags ? filterByIds(allTags, tags) : allTags;

  return fuzzySearchBy(searchedTags, query, (tag) => tag.name);
}

/**
 * Returns the tags with the given IDs.
 */
function filterByIds(tags: Tag[], ids: string[]): Tag[] {
  const idSet = new Set(ids);

  return tags.filter((tag) => idSet.has(tag.id));
}
