import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import {
  TRDBaseData,
  TRDTypeData,
  TypedResourceDocument,
  ResourceTypeConfigsStore,
  TypedResourceConfig,
  ResourceReference,
  ResourceStore,
} from '../types';
import { updateTypedResourceDocument } from '../updateTypedResourceDocument';

/**
 * Removes parent resource references from a resource document.
 *
 * @param core - A MindDrop core instance.
 * @param store - The resource store.
 * @param typeConfigsStore - The resource type configs store.
 * @param config - The resource config.
 * @param documentId - The ID of the document from which to remove the parents.
 * @param parentReferences - The resource references of the parents to remove.
 */
export function removeParentsFromTypedResourceDocument<
  TBaseData extends TRDBaseData,
  TTypeData extends TRDTypeData<TBaseData>,
>(
  core: Core,
  store: ResourceStore<TypedResourceDocument<TBaseData>>,
  typeConfigsStore: ResourceTypeConfigsStore<TBaseData, TTypeData>,
  config: TypedResourceConfig<TBaseData, TypedResourceDocument<TBaseData>>,
  documentId: string,
  parentReferences: ResourceReference[],
): TypedResourceDocument<TBaseData, TTypeData> {
  // Update the document, removing the specified parent references
  const document = updateTypedResourceDocument<TBaseData, TTypeData>(
    core,
    store,
    typeConfigsStore,
    config,
    documentId,
    {
      parents: FieldValue.arrayRemove(parentReferences),
    },
    true,
  );

  return document;
}
