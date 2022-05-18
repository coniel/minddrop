import { Core } from '@minddrop/core';
import { ResourceDocumentNotFoundError } from '../errors';
import { runSchemaDeleteHooks } from '../runSchemaDeleteHooks';
import {
  ResourceConfig,
  ResourceDocument,
  RDData,
  ResourceStore,
} from '../types';

/**
 * Permanently deletes a resource document and dispatches a
 * `[resource]:delete-permanently` event.
 *
 * @param core A MindDrop core instance.
 * @param store The resource store.
 * @param config The resource config.
 * @param documentId The ID of the document to delete permanently.
 */
export function permanentlyDeleteResourceDocument<
  TData extends RDData,
  TResourceDocument extends ResourceDocument<TData> = ResourceDocument<TData>,
>(
  core: Core,
  store: ResourceStore<TResourceDocument>,
  config: ResourceConfig<TData>,
  documentId: string,
): TResourceDocument {
  // Get the document
  const document = store.get(documentId);

  if (!document) {
    // Throw a `ResourceDocumentNotFoundError` if the document
    // does not exist.
    throw new ResourceDocumentNotFoundError(config.resource, documentId);
  }

  // Remove the document from the store
  store.remove(documentId);

  // Run schema delete hooks
  runSchemaDeleteHooks(core, config.dataSchema, document);

  // Dispatch a '[resource]:delete-permanently' event
  core.dispatch(`${config.resource}:delete-permanently`, document);

  // Return the deleted document
  return document;
}
