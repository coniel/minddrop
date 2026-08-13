import { createObjectStore } from '@minddrop/stores';
import { Design, Layout } from './types';

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

/**
 * Retrieves a layout by its ID from the design containing it.
 *
 * @param id - The ID of the layout to retrieve.
 * @returns The layout or null if it doesn't exist.
 */
export const useLayout = (id: string): Layout | null => {
  // Search every design's layouts for the requested ID
  return (
    DesignsStore.useAllItemsArray()
      .flatMap((design) => design.layouts)
      .find((layout) => layout.id === id) ?? null
  );
};
