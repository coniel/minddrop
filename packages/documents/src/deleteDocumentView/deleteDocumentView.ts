import { Events } from '@minddrop/events';
import { DocumentViewsStore } from '../DocumentViewsStore';
import { getDocumentView } from '../getDocumentView';

/**
 * Deletes a document view.
 *
 * @param viewId - The ID of the document view to delete.
 *
 * @throws {DocumentViewNotFoundError} If the view does not exist.
 *
 * @dispatches documents:view:delete
 */
export function deleteDocumentView(viewId: string): void {
  // Get the view
  const view = getDocumentView(viewId);

  // Delete the view from the store
  DocumentViewsStore.getState().remove(viewId);

  Events.dispatch('documents:view:delete', view);
}
