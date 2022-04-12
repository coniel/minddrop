import { Core } from '@minddrop/core';
import { getResourceDocument } from '../getResourceDocument';
import { ResourceConfig, ResourceDocument, ResourceStore } from '../types';

/**
 * Permanently deletes a resource document and dispatches a
 * `[resource]:delete-permanently` event.
 *
 * @param core A MindDrop core instance.
 * @param store The resource store.
 * @param config The resource config.
 * @param documentId The ID of the document to delete permanently.
 */
export function permanentlyDeleteResourceDocument<TData>(
  core: Core,
  store: ResourceStore<ResourceDocument<TData>>,
  config: ResourceConfig<TData>,
  documentId: string,
): ResourceDocument<TData> {
  // Get the document
  const document = getResourceDocument(store, config, documentId);

  // Remove the document from the store
  store.remove(documentId);

  // Dispatch a '[resource]:delete-permanently' event
  core.dispatch(`${config.resource}:delete-permanently`, document);

  // Return the deleted document
  return document;
}
