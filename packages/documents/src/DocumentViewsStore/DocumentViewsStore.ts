import { create } from 'zustand';
import { DocumentView } from '../types';

export interface DocumentViewsStore {
  /**
   * The user's documents.
   */
  documents: Record<string, DocumentView>;

  /**
   * Load documents into the store.
   */
  load(document: DocumentView[]): void;

  /**
   * Add a document to the store.
   */
  add(document: DocumentView): void;

  /**
   * Updates a document in the store by id.
   */
  update(id: string, data: Partial<DocumentView>): void;

  /**
   * Remove a document from the store by id.
   */
  remove(id: string): void;

  /**
   * Clear all documents.
   */
  clear(): void;
}

export const DocumentViewsStore = create<DocumentViewsStore>()((set) => ({
  documents: {},

  load: (documents) =>
    set((state) => ({
      documents: {
        ...state.documents,
        ...documents.reduce(
          (docs, document) => ({
            ...docs,
            [document.id]: document,
          }),
          {},
        ),
      },
    })),

  add: (document) =>
    set((state) => {
      return {
        documents: { ...state.documents, [document.id]: document },
      };
    }),

  update: (id, data) =>
    set((state) => {
      const document = state.documents[id];

      if (!document) {
        return {};
      }

      return {
        documents: { ...state.documents, [id]: { ...document, ...data } },
      };
    }),

  remove: (id) =>
    set((state) => {
      const documents = { ...state.documents };

      delete documents[id];

      return { documents };
    }),

  clear: () => set({ documents: {} }),
}));
