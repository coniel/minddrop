import { DataViewsStore } from '../DataViewsStore';
import { DataView } from '../types';

/**
 * Retrieves the data views referencing any of the given item IDs
 * within their options or data.
 *
 * @param itemIds - The referenced item IDs.
 * @returns The referencing data views.
 */
export function getReferencingDataViews(itemIds: string[]): DataView[] {
  // Index the item IDs for lookup
  const ids = new Set(itemIds);

  // Filter views whose references intersect the IDs
  return DataViewsStore.getAllArray().filter((view) =>
    view.references?.some((referencedId) => ids.has(referencedId)),
  );
}
