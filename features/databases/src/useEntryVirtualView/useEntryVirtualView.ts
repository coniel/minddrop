import { useEffect } from 'react';
import { ContentView, ContentViews } from '@minddrop/content-views';
import { DatabaseEntries } from '@minddrop/databases';

/**
 * Returns the virtual view a design element embeds for a virtual
 * collection. Creates the view once the element maps to a
 * collection. Returns null until then.
 *
 * @param collectionId - The virtual collection ID, null while the element maps to none.
 * @param elementId - The ID of the design element embedding the view.
 * @param viewType - The view's type.
 * @returns The virtual view, or null.
 */
export function useEntryVirtualView(
  collectionId: string | null,
  elementId: string,
  viewType: string,
): ContentView | null {
  // Resolve the ID of the view the element embeds for the collection
  const viewId = collectionId
    ? DatabaseEntries.virtualViewId(collectionId, elementId, viewType)
    : '';
  // Subscribe to the view
  const view = ContentViews.use(viewId);

  // Create the view once the element maps to a collection
  useEffect(() => {
    if (collectionId) {
      DatabaseEntries.ensureVirtualView(collectionId, elementId, viewType);
    }
  }, [collectionId, elementId, viewType]);

  return view;
}
