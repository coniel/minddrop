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
 * Adds parent resource references to a resource document.
 *
 * @param core - A MindDrop core instance.
 * @param store - The resource store.
 * @param config - The resource config.
 * @param documentId - The ID of the document to delete.
 * @param parentReferences - The resource references of the parents to add.
 */
export function addParentsToResourceDocument<
  TData extends RDData,
  TResourceDocument extends ResourceDocument<TData> = ResourceDocument<TData>,
>(
  core: Core,
  store: ResourceStore<TResourceDocument>,
  config: ResourceConfig<TData, TResourceDocument>,
  documentId: string,
  parentReferences: ResourceReference[],
): TResourceDocument {
  // Update the document, adding the new parent references
  const document = updateResourceDocument<TData, TResourceDocument>(
    core,
    store,
    config,
    documentId,
    {
      parents: FieldValue.arrayUnion(parentReferences),
    },
    true,
  );

  return document;
}
