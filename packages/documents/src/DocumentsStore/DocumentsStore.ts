import { create } from 'zustand';
import { Document } from '../types';

export interface DocumentsStore {
  /**
   * The user's documents.
   */
  documents: Document[];

  /**
   * Load documents into the store.
   */
  load(document: Document[]): void;

  /**
   * Add a document to the store.
   */
  add(document: Document): void;

  /**
   * Updates a document in the store by id.
   */
  update(id: string, data: Partial<Document>): void;

  /**
   * Remove a document from the store by id.
   */
  remove(id: string): void;

  /**
   * Clear all documents.
   */
  clear(): void;
}

export const DocumentsStore = create<DocumentsStore>()((set) => ({
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
