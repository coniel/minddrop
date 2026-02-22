import { DesignsStore } from '../DesignsStore';
import { DesignNotFoundError } from '../errors';
import { Design } from '../types';

/**
 * Retrieves a design by its ID.
 *
 * @param id - The ID of the design to retrieve.
 * @returns The retrieved design.
 *
 * @throws {DesignNotFoundError} If the design with the specified ID does not exist.
 */
export function getDesign(id: string): Design {
  // Get the design from the store
  const design = DesignsStore.get(id);

  // Ensure the design exists
  if (!design) {
    throw new DesignNotFoundError(id);
  }

  return design;
}
