import { DesignsStore } from '../DesignsStore';
import { DesignNotFoundError } from '../errors';
import { Design } from '../types';

/**
 * Retrieves a design by its ID.
 *
 * @param id - The ID of the design to retrieve.
 * @param throwOnNotFound - Whether to throw an error if the design is not found, defaults to true.
 * @returns The retrieved design or null if it doesn't exist and throwOnNotFound is false.
 *
 * @throws {DesignNotFoundError} If the design with the specified ID does not exist and throwOnNotFound is true.
 */
export function getDesign(id: string): Design;
export function getDesign(id: string, throwOnNotFound: false): Design | null;
export function getDesign(id: string, throwOnNotFound = true): Design | null {
  // Get the design from the store
  const design = DesignsStore.get(id);

  // If we need to throw on not found, ensure the design exists
  if (!design && throwOnNotFound) {
    throw new DesignNotFoundError(id);
  }

  return design || null;
}
