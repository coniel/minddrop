import { DesignsStore } from '../DesignsStore';
import { Design } from '../types';

/**
 * Retrieves the designs owned by the given entity.
 *
 * @param ownerId - The ID of the owning entity.
 * @param workspaceId - The workspace the designs belong to. Omit for the active workspace.
 * @returns The owner's designs.
 */
export function getOwnedDesigns(
  ownerId: string,
  workspaceId?: string,
): Design[] {
  // Filter the designs down to the owner's
  return DesignsStore.in(workspaceId)
    .getAllArray()
    .filter((design) => design.owner === ownerId);
}
