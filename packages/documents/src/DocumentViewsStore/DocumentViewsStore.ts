import { create } from 'zustand';
import { DocumentView } from '../types';

export interface DocumentViewsStore {
  /**
   * The user's documents.
   */
  documents: DocumentView[];

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
  documents: [],

  load: (documents) =>
    set((state) => ({ documents: [...state.documents, ...documents] })),

  add: (document) =>
    set((state) => {
      return {
        documents: [...state.documents, document],
      };
    }),

  update: (id, data) =>
    set((state) => {
      const index = state.documents.findIndex((document) => document.id === id);
      const documents = [...state.documents];

      if (index === -1) {
        return {};
      }

      documents[index] = { ...documents[index], ...data };

      return { documents };
    }),

  remove: (id) =>
    set((state) => {
      return {
        documents: state.documents.filter((document) => id !== document.id),
      };
    }),

  clear: () => set({ documents: [] }),
}));
