import {
  ResourceApi,
  ResourceConfig,
  ResourceDocument,
  RDData,
  ResourceStore,
} from '../types';
import { clearResourceDocuments } from '../clearResourceDocuments';
import { createResourceDocument } from '../createResourceDocument';
import { createResourceStore } from '../createResourceStore';
import { deleteResourceDocument } from '../deleteResourceDocument';
import { getAllResourceDocuments } from '../getAllResourceDocuments';
import { getResourceDocument } from '../getResourceDocument';
import { getResourceDocuments } from '../getResourceDocuments';
import { loadResourceDocuments } from '../loadResourceDocuments';
import { permanentlyDeleteResourceDocument } from '../permanentlyDeleteResourceDocument';
import { restoreResourceDocument } from '../restoreResourceDocument';
import { updateResourceDocument } from '../updateResourceDocument';
import { addResourceDocument } from '../addResourceDocument';
import { setResourceDocument } from '../setResourceDocument';
import { removeResourceDocument } from '../removeResourceDocument';
import { validateResourceDataSchema } from '../validation/validateResourceDataSchema';
import { useResourceDocument } from '../useResourceDocument';

/**
 * Creates a new resource type, returning its API.
 *
 * @param config The resource configuration.
 * @returns A resource API.
 */
export function createResource<
  TData extends RDData,
  TCreateData extends Partial<Record<keyof TData, any>> & RDData,
  TUpdateData extends Partial<Record<keyof TData, any>> & RDData,
  TResourceDocument extends ResourceDocument<TData> = ResourceDocument<TData>,
>(
  config: ResourceConfig<TData, TResourceDocument>,
  customStore?: ResourceStore<TResourceDocument>,
): ResourceApi<TData, TCreateData, TUpdateData, TResourceDocument> {
  // Validate the data schema
  validateResourceDataSchema(config.resource, config.dataSchema);

  // Create the resource document store
  const store = customStore || createResourceStore<TResourceDocument>();

  // Create the `get` function which returns one or multiple documents
  // based on the whether `documentId` argument is a string or an array.
  function get(documentId: string): TResourceDocument;
  function get(documentIds: string[]): Record<string, TResourceDocument>;
  function get(documentId: string | string[]) {
    if (Array.isArray(documentId)) {
      return getResourceDocuments(store, config, documentId);
    }

    return getResourceDocument(store, config, documentId);
  }

  // Return the resource API
  return {
    resource: config.resource,
    get,
    getAll: () => getAllResourceDocuments(store, config),
    create: (core, data) => createResourceDocument(core, store, config, data),
    update: (core, documentId, data) =>
      updateResourceDocument(core, store, config, documentId, data),
    delete: (core, documentId) =>
      deleteResourceDocument(core, store, config, documentId),
    restore: (core, documentId) =>
      restoreResourceDocument(core, store, config, documentId),
    deletePermanently: (core, documentId) =>
      permanentlyDeleteResourceDocument(core, store, config, documentId),
    hooks: {
      useDocument: (documentId: string) =>
        useResourceDocument(store, documentId),
    },
    store: {
      get: store.get,
      getAll: store.getAll,
      add: (core, document) =>
        addResourceDocument(core, store, config, document),
      set: (core, document) =>
        setResourceDocument(core, store, config, document),
      remove: (core, documentId) =>
        removeResourceDocument(core, store, config, documentId),
      load: (core, documents) =>
        loadResourceDocuments(core, store, config, documents),
      clear: () => clearResourceDocuments(store, config),
    },
  };
}
