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
 * Adds parent resource references to a resource document.
 *
 * @param core - A MindDrop core instance.
 * @param store - The resource store.
 * @param typeConfigsStore - The resource type configs store.
 * @param config - The resource config.
 * @param documentId - The ID of the document to which to add the parents.
 * @param parentReferences - The resource references of the parents to add.
 */
export function addParentsToTypedResourceDocument<
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
  // Update the document, adding the new parent references
  const document = updateTypedResourceDocument<TBaseData, TTypeData>(
    core,
    store,
    typeConfigsStore,
    config,
    documentId,
    {
      parents: FieldValue.arrayUnion(parentReferences),
    },
    true,
  );

  return document;
}
