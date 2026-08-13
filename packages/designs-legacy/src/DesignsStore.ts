import { createObjectStore } from '@minddrop/stores';
import { Design } from './types';

export const DesignsStore = createObjectStore<Design>('Designs:Designs', 'id');

/**
 * Retrieves a design by its ID.
 *
 * @param id - The ID of the design to retrieve.
 * @returns The design or null if it doesn't exist.
 */
export const useDesign = (id: string): Design | null => {
  return DesignsStore.useItem(id);
};

/**
 * Retrieves all designs.
 *
 * @returns An array of all designs.
 */
export const useDesigns = (): Design[] => {
  return DesignsStore.useAllItemsArray();
};
