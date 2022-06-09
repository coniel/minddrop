import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import {
  ResourceConfig,
  ResourceDocument,
  RDData,
  ResourceReference,
  ResourceStore,
} from '../types';
import { updateResourceDocument } from '../updateResourceDocument';

/**
 * Removes parent resource references to a resource document.
 *
 * @param core - A MindDrop core instance.
 * @param store - The resource store.
 * @param config - The resource config.
 * @param documentId - The ID of the document to delete.
 * @param parentReferences - The resource references of the parents to remove.
 */
export function removeParentsFromResourceDocument<
  TData extends RDData,
  TResourceDocument extends ResourceDocument<TData> = ResourceDocument<TData>,
>(
  core: Core,
  store: ResourceStore<TResourceDocument>,
  config: ResourceConfig<TData, TResourceDocument>,
  documentId: string,
  parentReferences: ResourceReference[],
): TResourceDocument {
  // Update the document, removing the parent references
  const document = updateResourceDocument<TData, TResourceDocument>(
    core,
    store,
    config,
    documentId,
    {
      parents: FieldValue.arrayRemove(parentReferences),
    },
    true,
  );

  return document;
}
