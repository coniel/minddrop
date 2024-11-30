import { DocumentViewsStore } from '../DocumentViewsStore';
import { DocumentViewNotFoundError } from '../errors';
import { DocumentView } from '../types';

/**
 * Returns a document view by ID.
 *
 * @param id - The document view ID.
 * @returns A document view.
 *
 * @throws {DocumentViewNotFoundError} If the document view is not found.
 */
export function getDocumentView(id: string): DocumentView {
  const view = DocumentViewsStore.getState().documents.find(
    (view) => view.id === id,
  );

  if (!view) {
    throw new DocumentViewNotFoundError(id);
  }

  return view;
}
