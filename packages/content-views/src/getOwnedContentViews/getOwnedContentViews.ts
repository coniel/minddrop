import { ContentViewsStore } from '../ContentViewsStore';
import { ContentView } from '../types';

/**
 * Retrieves all content views owned by the given owner.
 *
 * @param ownerId - The ID of the owner entity.
 * @param workspaceId - The workspace the content views belong to. Omit for the active workspace.
 * @returns The owned content views.
 */
export function getOwnedContentViews(
  ownerId: string,
  workspaceId?: string,
): ContentView[] {
  // Filter views down to those owned by the given owner
  return ContentViewsStore.in(workspaceId)
    .getAllArray()
    .filter((view) => view.owner === ownerId);
}
