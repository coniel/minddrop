import { ContentViewsStore } from '../ContentViewsStore';
import { ContentView } from '../types';

/**
 * Retrieves the content views referencing any of the given item IDs
 * within their options or data.
 *
 * @param itemIds - The referenced item IDs.
 * @param workspaceId - The workspace the content views belong to. Omit for the active workspace.
 * @returns The referencing content views.
 */
export function getReferencingContentViews(
  itemIds: string[],
  workspaceId?: string,
): ContentView[] {
  // Index the item IDs for lookup
  const ids = new Set(itemIds);

  // Filter views whose references intersect the IDs
  return ContentViewsStore.in(workspaceId)
    .getAllArray()
    .filter((view) =>
      view.references?.some((referencedId) => ids.has(referencedId)),
    );
}
