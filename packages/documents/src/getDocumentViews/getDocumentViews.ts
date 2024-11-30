import { DocumentViewsStore } from '../DocumentViewsStore';
import { DocumentView } from '../types';

/**
 * Returns the document views with the given IDs.
 * Any views that are not found are filtered out.
 *
 * @param ids - The IDs of the views to return.
 * @returns An array of document views.
 */
export function getDocumentViews(ids: string[]): DocumentView[] {
  // Turn the array of view IDs into a Set for faster lookups
  const idSet = new Set(ids);

  return DocumentViewsStore.getState().documents.filter((view) =>
    idSet.has(view.id),
  );
}
