import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { ResourceConfig, ResourceDocument, ResourceStore } from '../types';
import { updateResourceDocument } from '../updateResourceDocument';

/**
 * Restores a soft-deleted a resource document and
 * dispatches a `[resource]:restore` event.
 *
 * @param core A MindDrop core instance.
 * @param store The resource store.
 * @param config The resource config.
 * @param documentId The ID of the document to restore.
 */
export function restoreResourceDocument<TData>(
  core: Core,
  store: ResourceStore<ResourceDocument<TData>>,
  config: ResourceConfig<TData>,
  documentId: string,
): ResourceDocument<TData> {
  // Restore the document by removing the `deleted` and
  // `deletedAt` proprties.
  const document = updateResourceDocument<TData>(
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
