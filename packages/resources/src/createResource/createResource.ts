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
import { filterResourceDocuments } from '../filterResourceDocuments';
import { useResourceDocuments } from '../useResourceDocuments';
import { useAllResourceDocuments } from '../useAllResourceDocuments';
import { addParentsToResourceDocument } from '../addParentsToResourceDocument';
import { removeParentsFromResourceDocument } from '../removeParentsFromResourceDocument';
import { normalizeResourceDocument } from '../normalizeResourceDocument';

/**
 * Creates a new resource, returning its API.
 *
 * @param config - The resource configuration.
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
    dataSchema: config.dataSchema,
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
    addParents: (core, documentId, parentreferences) =>
      addParentsToResourceDocument(
        core,
        store,
        config,
        documentId,
        parentreferences,
      ),
    removeParents: (core, documentId, parentreferences) =>
      removeParentsFromResourceDocument(
        core,
        store,
        config,
        documentId,
        parentreferences,
      ),
    normalize: (core, documentId) =>
      normalizeResourceDocument(core, store, config, documentId),
    filter: filterResourceDocuments,
    hooks: {
      useDocument: (documentId) => useResourceDocument(store, documentId),
      useDocuments: (documentIds, filters) =>
        useResourceDocuments(store, documentIds, filters),
      useAllDocuments: (filters) => useAllResourceDocuments(store, filters),
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
