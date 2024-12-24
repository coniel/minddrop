import { create } from 'zustand';
import { Document } from '../types';
import { isWrapped } from '../utils';

export interface DocumentsStore {
  /**
   * The user's documents.
   */
  documents: Record<string, Document>;

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
  documents: {},

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

      // Update the child-to-parent map with new documents
      updateChildToParentMap(documents, state.documents, DocumentParentMap);

      return {
        documents: {
          ...state.documents,
          ...documents.reduce(
            (docs, document) => ({ ...docs, [document.id]: document }),
            {},
          ),
        },
      };
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

      // Update the child-to-parent map with the new document
      updateChildToParentMap([document], state.documents, DocumentParentMap);

      return {
        documents: { ...state.documents, [document.id]: document },
      };
    }),

  update: (id, data) =>
    set((state) => {
      const documents = { ...state.documents };
      const oldDocument = documents[id];
      delete documents[id];

      if (!oldDocument) {
        return {};
      }

      const newDocument = { ...oldDocument, ...data };

      if (data.blocks) {
        // Add new block entries to the BlockDocumentMap
        newDocument.blocks.forEach((blockId) => {
          BlockDocumentMap.set(blockId, id);
        });
      }

      if (data.views) {
        // Add new view entries to the DocumentViewDocumentMap
        newDocument.views.forEach((viewId) => {
          DocumentViewDocumentMap.set(viewId, id);
        });
      }

      if (data.path) {
        // Update the child-to-parent map to reflect the new path
        DocumentParentMap.delete(id);
        updateChildToParentMap([newDocument], documents, DocumentParentMap);
      }

      documents[id] = newDocument;

      return { documents };
    }),

  remove: (id) =>
    set((state) => {
      const documents = { ...state.documents };

      delete documents[id];

      return { documents };
    }),

  clear: () =>
    set(() => {
      BlockDocumentMap.clear();
      DocumentViewDocumentMap.clear();

      return { documents: {} };
    }),
}));

export const BlockDocumentMap = new Map<string, string>();
export const DocumentViewDocumentMap = new Map<string, string>();
export const DocumentParentMap = new Map<string, string>();

/**
 * Update the child-to-parent map with new documents.
 *
 * @param newDocuments - The flat array of new document objects.
 * @param existingDocuments - An object containing existing documents keyed by their ID.
 * @param childToParentMap - An existing Map to update with child-to-parent relationships.
 * @returns The updated Map where each key is a child document ID and the value is its parent document ID.
 */
function updateChildToParentMap(
  newDocuments: Document[],
  existingDocuments: Record<string, Document>,
  childToParentMap: Map<string, string>,
) {
  // Combine existing and new documents into a single lookup map for paths
  const allDocuments = { ...existingDocuments };

  for (const doc of newDocuments) {
    allDocuments[doc.id] = doc;
  }

  // Create a lookup for paths to document IDs
  const pathToIdMap = new Map<string, string>(
    Object.values(allDocuments).map((doc) => [doc.path, doc.id]),
  );

  // Sort new documents by path length to ensure parents are processed before children
  const sortedNewDocuments = newDocuments.sort(
    (a, b) => a.path.split('/').length - b.path.split('/').length,
  );

  for (const document of sortedNewDocuments) {
    const pathParts = document.path.split('/');

    // Check if the document has a potential parent directory
    const parentDocumentDir = pathParts
      .slice(0, isWrapped(document.path) ? -2 : -1)
      .join('/');

    const potentialParentPath = `${parentDocumentDir}/${parentDocumentDir.split('/').slice(-1)[0]}.minddrop`;

    const parentId = pathToIdMap.get(potentialParentPath);

    if (parentId) {
      childToParentMap.set(document.id, parentId);
    }
  }
}
