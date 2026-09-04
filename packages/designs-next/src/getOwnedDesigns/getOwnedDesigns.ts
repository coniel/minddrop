import { DesignsStore } from '../DesignsStore';
import { Design } from '../types';

/**
 * Retrieves the designs owned by the given entity.
 *
 * @param ownerId - The ID of the owning entity.
 * @returns The owner's designs.
 */
export function getOwnedDesigns(ownerId: string): Design[] {
  // Filter the designs down to the owner's
  return DesignsStore.getAllArray().filter(
    (design) => design.owner === ownerId,
  );
}
