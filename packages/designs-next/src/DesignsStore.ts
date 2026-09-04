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
 * Retrieves all designs, or only those owned by the given entity.
 *
 * @param ownerId - The ID of the owning entity to filter by.
 * @returns An array of the matching designs.
 */
export const useDesigns = (ownerId?: string): Design[] => {
  const designs = DesignsStore.useAllItemsArray();

  if (!ownerId) {
    return designs;
  }

  // Filter the designs down to the owner's
  return designs.filter((design) => design.owner === ownerId);
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
