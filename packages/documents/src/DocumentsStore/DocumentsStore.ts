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
    set((state) => {
      documents.forEach((document) => {
        // Add block entries to the BlockDocumentMap
        document.blocks.forEach((blockId) => {
          BlockDocumentMap.set(blockId, document.id);
        });

        // Add view entries to the DocumentViewDocumentMap
        document.views.forEach((viewId) => {
          DocumentViewDocumentMap.set(viewId, document.id);
        });
      });

      return { documents: [...state.documents, ...documents] };
    }),

  add: (document) =>
    set((state) => {
      // Add block entries to the BlockDocumentMap
      document.blocks.forEach((blockId) => {
        BlockDocumentMap.set(blockId, document.id);
      });

      // Add view entries to the DocumentViewDocumentMap
      document.views.forEach((viewId) => {
        DocumentViewDocumentMap.set(viewId, document.id);
      });

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

      const oldDocument = documents[index];
      const newDocument = { ...oldDocument, ...data };

      // Remove old block entries from the BlockDocumentMap
      oldDocument.blocks.forEach((blockId) => {
        BlockDocumentMap.delete(blockId);
      });

      // Add new block entries to the BlockDocumentMap
      newDocument.blocks.forEach((blockId) => {
        BlockDocumentMap.set(blockId, id);
      });

      // Remove old view entries from the DocumentViewDocumentMap
      oldDocument.views.forEach((viewId) => {
        DocumentViewDocumentMap.delete(viewId);
      });

      // Add new view entries to the DocumentViewDocumentMap
      newDocument.views.forEach((viewId) => {
        DocumentViewDocumentMap.set(viewId, id);
      });

      documents[index] = newDocument;

      return { documents };
    }),

  remove: (id) =>
    set((state) => {
      const document = state.documents.find((document) => document.id === id);

      if (document) {
        // Remove block entries from the BlockDocumentMap
        document.blocks.forEach((blockId) => {
          BlockDocumentMap.delete(blockId);
        });

        // Remove view entries from the DocumentViewDocumentMap
        document.views.forEach((viewId) => {
          DocumentViewDocumentMap.delete(viewId);
        });
      }

      return {
        documents: state.documents.filter((document) => id !== document.id),
      };
    }),

  clear: () =>
    set(() => {
      BlockDocumentMap.clear();
      DocumentViewDocumentMap.clear();

      return { documents: [] };
    }),
}));

export const BlockDocumentMap = new Map<string, string>();
export const DocumentViewDocumentMap = new Map<string, string>();
