import { Events } from '@minddrop/events';
import { DocumentViewsStore } from '../DocumentViewsStore';
import { getDocumentView } from '../getDocumentView';
import { DocumentView } from '../types';

/**
 * Updates a document view, returning the updated view.
 *
 * @param id - The ID of the document view to update.
 * @param data - The updated data to apply to the document view.
 *
 * @throws {ViewNotFoundError} Thrown if the view does not exist.
 *
 * @dispatches documents:view:update
 */
export function updateDocumentView<TView extends DocumentView = DocumentView>(
  id: string,
  data: Partial<TView>,
): TView {
  // Get the view, throws if not found
  const view = getDocumentView(id);

  const updatedView = {
    ...view,
    ...data,
  };

  // Update the view in the store
  DocumentViewsStore.getState().update(id, updatedView);

  // Dispatch a view update event
  Events.dispatch('documents:view:update', updatedView);

  return updatedView as TView;
}
