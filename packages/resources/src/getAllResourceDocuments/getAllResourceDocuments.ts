import { mapById } from '@minddrop/utils';
import {
  ResourceConfig,
  ResourceDocument,
  RDData,
  ResourceStore,
} from '../types';

/**
 * Returns a `{ [id]: ResourceDocument }` map of all
 * resource documents.
 *
 * @param store The resource store.
 * @param config The resource config.
 * @returns The requested documenta.
 */
export function getAllResourceDocuments<
  TData extends RDData,
  TResourceDocument extends ResourceDocument<TData> = ResourceDocument<TData>,
>(
  store: ResourceStore<TResourceDocument>,
  config: ResourceConfig<TData, TResourceDocument>,
): Record<string, TResourceDocument> {
  // Get all resource documents from the store
  let documents = store.getAll();

  if (config.onGet) {
    // Call the config's `onGet` method which will return
    // possibly modidfied version of the documents.
    documents = mapById(
      Object.values(documents).map((document) => config.onGet(document)),
    );
  }

  // Return the documents
  return documents;
}
