import { Events } from '@minddrop/events';
import { uuid } from '@minddrop/utils';
import { getDocumentViewTypeConfig } from '../DocumentViewTypeConfigsStore';
import { DocumentViewsStore } from '../DocumentViewsStore';
import {
  DocumentViewNotFoundError,
  DocumentViewTypeConfigNotRegisteredError,
} from '../errors';
import { getDocument } from '../getDocument';
import { DocumentView } from '../types';
import { updateDocument } from '../updateDocument';

/**
 * Creates a new document view and adds it to the document.
 *
 * @param documentId - The ID of the document to create the view for.
 * @param type - The type of the view to create.
 * @returns The new view.
 *
 * @throws {DocumentViewNotFoundError} - If the document does not exist.
 * @throws {DocumentViewTypeConfigNotRegisteredError} - If the view type is not registered.
 *
 * @dispatches documents:view:create
 */
export async function createDocumentView<
  TView extends DocumentView = DocumentView,
>(documentId: string, type: string): Promise<TView> {
  // Get the document
  const document = getDocument(documentId);
  // Get the view type config
  const config = getDocumentViewTypeConfig(type);

  // Ensure the document exists
  if (!document) {
    throw new DocumentViewNotFoundError(documentId);
  }

  // Ensure the view type config exists
  if (!config) {
    throw new DocumentViewTypeConfigNotRegisteredError(type);
  }

  // Create the view
  const view: DocumentView = {
    type,
    id: uuid(),
    blocks: [],
  };

  // Initialize the view type's custom data
  if (config.initialize) {
    Object.assign(view, config.initialize(document));
  }

  // Add the view to the store
  DocumentViewsStore.getState().add(view);

  // Add the view to the document
  updateDocument(documentId, { views: [...document.views, view.id] });

  // Dispatch a view create event
  Events.dispatch('documents:view:create', view);

  return view as TView;
}
