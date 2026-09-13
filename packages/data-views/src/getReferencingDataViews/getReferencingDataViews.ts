import { DataViewsStore } from '../DataViewsStore';
import { DataView } from '../types';

/**
 * Retrieves the data views referencing any of the given item IDs
 * within their options or data.
 *
 * @param itemIds - The referenced item IDs.
 * @param workspaceId - The workspace the data views belong to. Omit for the active workspace.
 * @returns The referencing data views.
 */
export function getReferencingDataViews(
  itemIds: string[],
  workspaceId?: string,
): DataView[] {
  // Index the item IDs for lookup
  const ids = new Set(itemIds);

  // Filter views whose references intersect the IDs
  return DataViewsStore.in(workspaceId)
    .getAllArray()
    .filter((view) =>
      view.references?.some((referencedId) => ids.has(referencedId)),
    );
}
