import { ContentViewsStore } from '../ContentViewsStore';
import { ContentView } from '../types';

/**
 * Retrieves all content views owned by the given owner.
 *
 * @param ownerId - The ID of the owner entity.
 * @returns The owned content views.
 */
export function getOwnedContentViews(ownerId: string): ContentView[] {
  // Filter views down to those owned by the given owner
  return ContentViewsStore.getAllArray().filter(
    (view) => view.owner === ownerId,
  );
}
