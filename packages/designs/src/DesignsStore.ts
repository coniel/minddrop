import { createArrayStore } from '@minddrop/utils';
import { Design } from './types';

export const DesignsStore = createArrayStore<Design>('id');

/**
 * Retrieves a design by its ID.
 *
 * @param id - The ID of the design to retrieve.
 * @returns The design or null if it doesn't exist.
 */
export const useDesign = (id: string): Design | null => {
  return DesignsStore.useAllItems().find((view) => view.type === id) || null;
};

/**
 * Retrieves all designs.
 *
 * @returns And array of all designs.
 */
export const useDesigns = (): Design[] => {
  return DesignsStore.useAllItems();
};

/**
 * Retrieves all designs of a specific type.
 *
 * @param type - The type of designs to retrieve.
 * @returns An array of designs of the specified type.
 */
export const useDesignsOfType = (type: string): Design[] => {
  return DesignsStore.useAllItems().filter((design) => design.type === type);
};
