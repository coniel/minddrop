import { filterTypedResourceDocuments } from '../filterTypedResourceDocuments';
import {
  TRDBaseData,
  TRDTypeData,
  ResourceStore,
  TypedResourceDocument,
  TypedResourceDocumentFilters,
  TypedResourceDocumentMap,
} from '../types';

/**
 * Returns a `{ [id]: ResourceDocument }` map of all resource
 * documents.
 *
 * @param store - The resource documents store.
 * @param filters - Optional filters by which to filter the returned documents.
 * @returns A `{ [id]: ResourceDocument }` map of all documents.
 */
export function useAllTypedResourceDocuments<
  TBaseData extends TRDBaseData = TRDBaseData,
  TTypeData extends TRDTypeData<TBaseData> = TRDTypeData<TBaseData>,
>(
  store: ResourceStore<TypedResourceDocument<TBaseData>>,
  filters?: TypedResourceDocumentFilters,
): TypedResourceDocumentMap<TypedResourceDocument<TBaseData, TTypeData>> {
  // Get all resource documents
  let { documents } = store.useStore();

  if (filters) {
    // Filter the documents if filters were provided
    documents = filterTypedResourceDocuments(documents, filters);
  }

  // Return the documents
  return documents as TypedResourceDocumentMap<
    TypedResourceDocument<TBaseData, TTypeData>
  >;
}
