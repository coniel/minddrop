import { createObjectStore } from '@minddrop/stores';
import { Space } from './types';

export const SpacesStore = createObjectStore<Space>('Spaces:Spaces', 'id');

/**
 * Retrieves a Space by ID or null if it doesn't exist.
 *
 * @param id - The ID of the space to retrieve.
 * @returns The space or null if it doesn't exist.
 */
export const useSpace = (id: string): Space | null => {
  return SpacesStore.useItem(id);
};

/**
 * Retrieves spaces matching the given IDs.
 *
 * @param ids - The IDs of the spaces to retrieve.
 * @returns An array of matching spaces.
 */
export const useSpaces = (ids: string[]): Space[] => {
  return SpacesStore.useItemsArray(ids);
};

/**
 * Retrieves all spaces.
 *
 * @returns An array of all spaces.
 */
export const useAllSpaces = (): Space[] => {
  return SpacesStore.useAllItemsArray();
};
