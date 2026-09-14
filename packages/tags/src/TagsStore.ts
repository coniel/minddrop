import { createObjectStore } from '@minddrop/stores';
import { Tag } from './types';

export const TagsStore = createObjectStore<Tag>('Tags:Tags', 'id', {
  scope: 'workspace',
});

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
 * Retrieves all tags.
 *
 * @returns An array of tags.
 */
export const useTags = (): Tag[] => {
  return TagsStore.useAllItemsArray();
};
