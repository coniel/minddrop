import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import {
  ResourceConfig,
  ResourceDocument,
  ResourceDocumentCustomData,
  ResourceStore,
} from '../types';
import { updateResourceDocument } from '../updateResourceDocument';

/**
 * Restores a soft-deleted resource document and
 * dispatches a `[resource]:restore` event.
 *
 * @param core - A MindDrop core instance.
 * @param store - The resource store.
 * @param config - The resource config.
 * @param documentId - The ID of the document to restore.
 * @returns The restored resource document.
 *
 * @throws ResourceDocumentNotFoundError
 * Thrown if the resource document does not exist.
 */
export function restoreResourceDocument<
  TData extends ResourceDocumentCustomData,
  TResourceDocument extends ResourceDocument<TData> = ResourceDocument<TData>,
>(
  core: Core,
  store: ResourceStore<TResourceDocument>,
  config: ResourceConfig<TData, TResourceDocument>,
  documentId: string,
): TResourceDocument {
  // Restore the document by removing the `deleted` and
  // `deletedAt` proprties.
  const document = updateResourceDocument<TData, TResourceDocument>(
    core,
    store,
    config,
    documentId,
    { deleted: FieldValue.delete(), deletedAt: FieldValue.delete() },
    true,
  );

  // Dispatch a '[resource]:restore' event
  core.dispatch(`${config.resource}:restore`, document);

  // Return the restored document
  return document;
}
