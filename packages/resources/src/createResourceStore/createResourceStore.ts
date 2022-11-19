import createStore from 'zustand';
import {
  ResourceDocument,
  ResourceStore,
  ResourceStoreInternalApi,
} from '../types';

/**
 * Creates a new resource store.
 *
 * @returns The resource store.
 */
export function createResourceStore<
  TDocument extends ResourceDocument,
>(): ResourceStore<TDocument> {
  const useResourceStore = createStore<ResourceStoreInternalApi<TDocument>>(
    (set) => ({
      documents: {},
      revisions: {},

      loadDocuments: (documents) =>
        set((state) => ({
          // Merge loaded documents into the store
          documents: {
            ...state.documents,
            ...documents.reduce(
              (map, document) => ({
                ...map,
                [document.id]: document,
              }),
              {},
            ),
          },
          // Add the document revisions
          revisions: {
            ...state.revisions,
            ...documents.reduce(
              (map, document) => ({
                ...map,
                [document.id]: [document.revision],
              }),
              {},
            ),
          },
        })),

      setDocument: (document) =>
        set((state) => ({
          // Add the document
          documents: { ...state.documents, [document.id]: document },
          // Add the document revision
          revisions: {
            ...state.revisions,
            [document.id]: [
              ...(state.revisions[document.id] || []),
              document.revision,
            ],
          },
        })),

      removeDocument: (id) =>
        set((state) => {
          // Clone store documents
          const documents = { ...state.documents };
          // Clone store revisions
          const revisions = { ...state.revisions };

          // Delete the document
          delete documents[id];
          // Delete the document revisions
          delete revisions[id];

          // Set the updated documents and revisions
          return { documents, revisions };
        }),

      clearDocuments: () =>
        set({
          // Clear documents
          documents: {},
          // Clear revisions
          revisions: {},
        }),
    }),
  );

  // Create the `get` function which returns one or multiple documents
  // based on the whether `documentId` argument is a string or an array.
  function get(documentId: string): TDocument;
  function get(documentIds: string[]): Record<string, TDocument>;
  function get(documentId: string | string[]) {
    const { documents } = useResourceStore.getState();

    if (Array.isArray(documentId)) {
      return documentId.reduce(
        (map, id) => ({ ...map, [id]: documents[id] }),
        {},
      );
    }

    return documents[documentId];
  }

  return {
    useStore: useResourceStore,
    get,
    getAll: () => useResourceStore.getState().documents,
    set: (document) => useResourceStore.getState().setDocument(document),
    remove: (id) => useResourceStore.getState().removeDocument(id),
    load: (documents) => useResourceStore.getState().loadDocuments(documents),
    clear: () => useResourceStore.getState().clearDocuments(),
    containsRevision: (documentId, revisionId) =>
      (useResourceStore.getState().revisions[documentId] || []).includes(
        revisionId,
      ),
    useResource: (id) =>
      useResourceStore(({ documents }) => documents[id] || null),
    useResources: (ids) =>
      useResourceStore(({ documents }) =>
        Object.values(documents).reduce(
          (map, { id }) =>
            ids.includes(id) ? { ...map, [id]: documents[id] } : map,
          {},
        ),
      ),
    useAllResources: () => useResourceStore(({ documents }) => documents),
  };
}
