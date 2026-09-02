import { useMemo } from 'react';
import { createObjectStore } from '@minddrop/stores';
import { Tag } from './types';

export const TagsStore = createObjectStore<Tag>('Tags:Tags', 'id');

/**
 * Retrieves a Tag by ID or null if it doesn't exist.
 *
 * @param id - The ID of the tag to retrieve.
 * @returns The tag or null if it doesn't exist.
 */
export const useTag = (id: string): Tag | null => {
  return TagsStore.useItem(id);
};

/**
 * Retrieves all tags, optionally limited to a tag group.
 *
 * @param group - The ID of the tag group to limit the tags to.
 * @returns An array of tags.
 */
export const useTags = (group?: string): Tag[] => {
  const tags = TagsStore.useAllItemsArray();

  // Limit the tags to the group when one is given
  return useMemo(
    () => (group ? tags.filter((tag) => tag.group === group) : tags),
    [tags, group],
  );
};
