import { Core } from '@minddrop/core';
import {
  ResourceConfig,
  ResourceDocument,
  ResourceDocumentCustomData,
  ResourceStore,
} from '../types';
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
export function deleteResourceDocument<
  TData extends ResourceDocumentCustomData,
  TResourceDocument extends ResourceDocument<TData> = ResourceDocument<TData>,
>(
  core: Core,
  store: ResourceStore<TResourceDocument>,
  config: ResourceConfig<TData, TResourceDocument>,
  documentId: string,
): TResourceDocument {
  // Mark document as deleted by adding `deleted` and
  // `deletedAt` proprties.
  const document = updateResourceDocument<TData, TResourceDocument>(
    core,
    store,
    config,
    documentId,
    { deleted: true, deletedAt: new Date() },
    true,
  );

  // Dispatch a '[resource]:delete' event
  core.dispatch(`${config.resource}:delete`, document);

  // Return the deleted document
  return document;
}
