import createStore from 'zustand';
import { Resource, ResourceStore } from '../types';

interface Store<TResource> {
  /**
   * A `{ [id]: Resource }` map of resource documents.
   */
  documents: Record<string, TResource>;

  /**
   * Loads documents into the store.
   *
   * @param documents The documents to load.
   */
  loadDocuments(documents: TResource[]): void;

  /**
   * Sets a document in the store.
   *
   * @param document The document to set.
   */
  setDocument(document: TResource): void;

  /**
   * Removes a document from the store.
   *
   * @param id The ID of the document to remove.
   */
  removeDocument(id: string): void;

  /**
   * Clears all documents from the store.
   */
  clearDocuments(): void;
}

/**
 * Does something useful.
 */
export function createResourceStore<
  TResource extends Resource,
>(): ResourceStore<TResource> {
  const useResourceStore = createStore<Store<TResource>>((set) => ({
    documents: {},

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
      })),

    setDocument: (document) =>
      set((state) => ({
        // Add the document to `documents`
        documents: { ...state.documents, [document.id]: document },
      })),

    removeDocument: (id) =>
      set((state) => {
        // Clone store documents
        const documents = { ...state.documents };

        // Delete the doucment
        delete documents[id];

        // Set the updated documents
        return { documents };
      }),

    clearDocuments: () =>
      set({
        // Clear documents
        documents: {},
      }),
  }));

  function get(id: string): TResource;
  function get(ids: string[]): Record<string, TResource>;
  function get(id: string | string[]) {
    const { documents } = useResourceStore.getState();
    if (Array.isArray(id)) {
      return Object.values(documents).reduce(
        (map, document) =>
          id.includes(document.id) ? { ...map, [document.id]: document } : map,
        {},
      );
    }

    return documents[id];
  }

  return {
    get,
    getAll: () => useResourceStore.getState().documents,
    set: (document) => useResourceStore.getState().setDocument(document),
    remove: (id) => useResourceStore.getState().removeDocument(id),
    load: (documents) => useResourceStore.getState().loadDocuments(documents),
    clear: () => useResourceStore.getState().clearDocuments(),
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
