import {
  TypedResourceDocument,
  TRDBaseData,
  TRDTypeData,
  ResourceStore,
} from '../types';

/**
 * Returns a typed resource document by ID or `null` if
 * the document does not exist.
 *
 * @param store - The resource documents store.
 * @param documentId - The ID of the document to retrieve.
 * @returns The requested document or `null`.
 */
export function useTypedResourceDocument<
  TBaseData extends TRDBaseData = TRDBaseData,
  TTypeData extends TRDTypeData<TBaseData> = TRDTypeData<TBaseData>,
>(
  store: ResourceStore<TypedResourceDocument<TBaseData>>,
  documentId: string,
): TypedResourceDocument<TBaseData, TTypeData> | null {
  // Get the document from the store
  const document = store.useStore.getState().documents[
    documentId
  ] as TypedResourceDocument<TBaseData, TTypeData>;

  // Return the document or null if it does not exist
  return document || null;
}
