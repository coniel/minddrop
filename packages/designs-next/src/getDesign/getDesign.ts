import { DesignsStore } from '../DesignsStore';
import { DesignNotFoundError } from '../errors';
import { Design } from '../types';

/**
 * Retrieves a design by its ID.
 *
 * @param id - The ID of the design to retrieve.
 * @param throwOnNotFound - Whether to throw an error if the design is not found, defaults to true.
 * @param workspaceId - The workspace the design belongs to. Omit for the active workspace.
 * @returns The retrieved design or null if it doesn't exist and throwOnNotFound is false.
 *
 * @throws {DesignNotFoundError} If the design does not exist and throwOnNotFound is true.
 */
export function getDesign(
  id: string,
  throwOnNotFound?: true,
  workspaceId?: string,
): Design;
export function getDesign(
  id: string,
  throwOnNotFound: false,
  workspaceId?: string,
): Design | null;
export function getDesign(
  id: string,
  throwOnNotFound = true,
  workspaceId?: string,
): Design | null {
  // Get the design from the workspace's store record
  const design = DesignsStore.in(workspaceId).get(id);

  // If we need to throw on not found, ensure the design exists
  if (!design && throwOnNotFound) {
    throw new DesignNotFoundError(id);
  }

  return design || null;
}
