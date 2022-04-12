import { Core } from '@minddrop/core';
import { ResourceConfig, ResourceDocument, ResourceStore } from '../types';

/**
 * Sets (updates) a document from the resource store
 * and dispatches a `[resource]:remove` event.
 *
 * @param core A MindDrop core instance.
 * @param store The resource store.
 * @param config The resource config.
 * @param documentId The ID of the document to remove from the store.
 */
export function removeResourceDocument<TData>(
  core: Core,
  store: ResourceStore<ResourceDocument<TData>>,
  config: ResourceConfig<TData>,
  documentId: string,
): void {
  // Get the document from the store
  const document = store.get(documentId);

  // Remove the document from the store
  store.remove(documentId);

  // Dispatch a '[resource]:remove' event
  core.dispatch(`${config.resource}:remove`, document);
}
