import { Core } from '@minddrop/core';
import { ResourceConfig, ResourceDocument, ResourceStore } from '../types';
import { updateResourceDocument } from '../updateResourceDocument';

/**
 * Soft-deletes a resource document and dispatches a
 * `[resource]:delete` event.
 *
 * @param core A MindDrop core instance.
 * @param store The resource store.
 * @param config The resource config.
 * @param documentId The ID of the document to delete.
 */
export function deleteResourceDocument<TData>(
  core: Core,
  store: ResourceStore<ResourceDocument<TData>>,
  config: ResourceConfig<TData>,
  documentId: string,
): ResourceDocument<TData> {
  // Mark document as deleted by adding `deleted` and
  // `deletedAt` proprties.
  const document = updateResourceDocument<TData>(
    core,
    store,
    config,
    documentId,
    { deleted: true, deletedAt: new Date() },
  );

  // Dispatch a '[resource]:delete' event
  core.dispatch(`${config.resource}:delete`, document);

  // Return the deleted document
  return document;
}
