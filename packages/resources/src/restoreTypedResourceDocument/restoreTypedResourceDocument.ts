import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import {
  ResourceStore,
  TypedResourceConfig,
  TypedResourceDocument,
  TypedResourceDocumentBaseCustomData,
  TypedResourceDocumentTypeCustomData,
  TypedResourceTypeConfigsStore,
} from '../types';
import { updateTypedResourceDocument } from '../updateTypedResourceDocument';

/**
 * Restores a soft-deleted typed resource document and
 * dispatches a `[resource]:restore` event.
 *
 * @param core - A MindDrop core instance.
 * @param store - The resource store.
 * @param typeConfigsStore - The resource type configs store.
 * @param config - The resource config.
 * @param documentId - The ID of the document to restore.
 * @returns The restored resource document.
 *
 * @throws ResourceNotFoundError
 * Thrown if the resource document does not exist.
 */
export function restoreTypedResourceDocument<
  TBaseData extends TypedResourceDocumentBaseCustomData,
  TTypeData extends TypedResourceDocumentTypeCustomData<TBaseData>,
>(
  core: Core,
  store: ResourceStore<TypedResourceDocument<TBaseData>>,
  typeConfigsStore: TypedResourceTypeConfigsStore<TBaseData, TTypeData>,
  config: TypedResourceConfig<TBaseData, TypedResourceDocument<TBaseData>>,
  documentId: string,
): TypedResourceDocument<TBaseData, TTypeData> {
  // Restore the document by removing the `deleted` and
  // `deletedAt` proprties.
  const document = updateTypedResourceDocument<TBaseData, TTypeData>(
    core,
    store,
    typeConfigsStore,
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
