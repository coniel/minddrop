import { DataViewsStore } from '../DataViewsStore';
import { DataView } from '../types';

/**
 * Retrieves all data views owned by the given owner.
 *
 * @param ownerId - The ID of the owner entity.
 * @returns The owned data views.
 */
export function getOwnedDataViews(ownerId: string): DataView[] {
  // Filter views down to those owned by the given owner
  return DataViewsStore.getAllArray().filter((view) => view.owner === ownerId);
}
