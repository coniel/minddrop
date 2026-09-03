import { createObjectStore } from '@minddrop/stores';
import { Design, DesignType } from './types';

export const DesignsStore = createObjectStore<Design>(
  'DesignsNext:Designs',
  'id',
);

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

/**
 * Retrieves all designs of the given design type.
 *
 * @param type - The design type to filter by.
 * @returns An array of the matching designs.
 */
export const useDesignsOfType = (type: DesignType): Design[] => {
  // Filter the designs down to the requested type
  return DesignsStore.useAllItemsArray().filter(
    (design) => design.type === type,
  );
};
