import { Core } from '@minddrop/core';
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
 * Soft-deletes a typed resource document and dispatches a
 * `[resource]:delete` event.
 *
 * @param core - A MindDrop core instance.
 * @param store - The resource store.
 * @param typeConfigsStore - The resource type configs store.
 * @param config - The resource config.
 * @param documentId - The ID of the document to delete.
 * @returns The deleted resource document.
 *
 * @throws ResourceDocumentNotFoundError
 * Thrown if the resource document does not exist.
 */
export function deleteTypedResourceDocument<
  TBaseData extends TypedResourceDocumentBaseCustomData,
  TTypeData extends TypedResourceDocumentTypeCustomData<TBaseData>,
>(
  core: Core,
  store: ResourceStore<TypedResourceDocument<TBaseData>>,
  typeConfigsStore: TypedResourceTypeConfigsStore<TBaseData, TTypeData>,
  config: TypedResourceConfig<TBaseData, TypedResourceDocument<TBaseData>>,
  documentId: string,
): TypedResourceDocument<TBaseData, TTypeData> {
  // Mark document as deleted by adding `deleted` and
  // `deletedAt` proprties.
  const document = updateTypedResourceDocument<TBaseData, TTypeData>(
    core,
    store,
    typeConfigsStore,
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
