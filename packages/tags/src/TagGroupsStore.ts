import { createObjectStore } from '@minddrop/stores';
import { TagGroup } from './types';

export const TagGroupsStore = createObjectStore<TagGroup>(
  'Tags:TagGroups',
  'id',
);

/**
 * Retrieves a TagGroup by ID or null if it doesn't exist.
 *
 * @param id - The ID of the tag group to retrieve.
 * @returns The tag group or null if it doesn't exist.
 */
export const useTagGroup = (id: string): TagGroup | null => {
  return TagGroupsStore.useItem(id);
};

/**
 * Retrieves all tag groups.
 *
 * @returns An array of all tag groups.
 */
export const useTagGroups = (): TagGroup[] => {
  return TagGroupsStore.useAllItemsArray();
};
