import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Fs } from '@minddrop/file-system';
import {
  document1,
  document1Blocks,
  documents,
  grandChildDocument,
  wrappedChildDocument,
  wrappedDocument,
} from '../test-utils';
import {
  BlockDocumentMap,
  DocumentParentMap,
  DocumentViewDocumentMap,
  DocumentsStore,
} from './DocumentsStore';

function loadDocuments() {
  DocumentsStore.getState().load(documents);
}

describe('DocumentsStore', () => {
  afterEach(() => {
    DocumentsStore.getState().clear();
    BlockDocumentMap.clear();
    DocumentViewDocumentMap.clear();
    DocumentParentMap.clear();
  });

  describe('load', () => {
    it('loads documents into the store, preserving existing ones', () => {
      // Load a document into the store
      DocumentsStore.getState().load([document1]);
      // Load a second document into the store
      DocumentsStore.getState().load([wrappedDocument]);

      // Both documents should be in the store
      expect(DocumentsStore.getState().documents).toEqual({
        [document1.id]: document1,
        [wrappedDocument.id]: wrappedDocument,
      });
    });

    it('updates the BlockDocumentMap', () => {
      // Load a document into the store
      DocumentsStore.getState().load([document1]);

      // BlockDocumentMap should contain entries for the
      // document's blocks.
      document1.blocks.forEach((blockId) => {
        expect(BlockDocumentMap.get(blockId)).toBe(document1.id);
      });
    });

    it('updates the DocumentViewDocumentMap', () => {
      // Load a document into the store
      DocumentsStore.getState().load([document1]);

      // DocumentViewDocumentMap should contain an entry for the
      // document's views.
      document1.views.forEach((viewId) => {
        expect(DocumentViewDocumentMap.get(viewId)).toBe(document1.id);
      });
    });

    it('updates the DocumentParentMap', () => {
      // Load a document into the store
      DocumentsStore.getState().load([wrappedDocument, wrappedChildDocument]);
      // Load more child documents into the store
      DocumentsStore.getState().load([grandChildDocument]);

      // DocumentParentMap should contain entry for child documents
      expect(DocumentParentMap.get(wrappedChildDocument.id)).toBe(
        wrappedDocument.id,
      );
      expect(DocumentParentMap.get(grandChildDocument.id)).toBe(
        wrappedChildDocument.id,
      );
    });
  });

  describe('add', () => {
    it('adds a document to the store', () => {
      // Load a document into the store
      DocumentsStore.getState().load([document1]);

      // Add a second document to the store
      DocumentsStore.getState().add(wrappedDocument);

      // Both documents should be in the store
      expect(DocumentsStore.getState().documents).toEqual({
        [document1.id]: document1,
        [wrappedDocument.id]: wrappedDocument,
      });
    });

    it('updates the BlockDocumentMap', () => {
      // Add a document to the store
      DocumentsStore.getState().add(document1);

      // BlockDocumentMap should contain entries for the
      // document's blocks>
      document1.blocks.forEach((blockId) => {
        expect(BlockDocumentMap.get(blockId)).toBe(document1.id);
      });
    });

    it('updates the DocumentViewDocumentMap', () => {
      // Add a document to the store
      DocumentsStore.getState().add(document1);

      // DocumentViewDocumentMap should contain an entry for the
      // document's views.
      document1.views.forEach((viewId) => {
        expect(DocumentViewDocumentMap.get(viewId)).toBe(document1.id);
      });
    });

    it('updates the DocumentParentMap', () => {
      // Load a document into the store
      DocumentsStore.getState().load([wrappedDocument]);

      // Add a child document to the store
      DocumentsStore.getState().add(wrappedChildDocument);

      // DocumentParentMap should contain an entry for the
      // child document.
      expect(DocumentParentMap.get(wrappedChildDocument.id)).toBe(
        wrappedDocument.id,
      );
    });
  });

  describe('update', () => {
    beforeEach(() => {
      // Load documents into the store
      loadDocuments();
    });

    it('updates the specified document in the store', () => {
      // Update a document
      DocumentsStore.getState().update(document1.id, { title: 'New title' });

      // Get the document from the store
      const document = DocumentsStore.getState().documents[document1.id];

      // Document title should be updated
      expect(document).toEqual({ ...document1, title: 'New title' });
    });

    it('does nothing if the document does not exist', () => {
      const initialState = { ...DocumentsStore.getState().documents };

      // Update a missing document
      DocumentsStore.getState().update('foo', {
        title: 'New title',
      });

      // Documents state should remain unchanged
      expect(DocumentsStore.getState().documents).toEqual(initialState);
    });

    it('updates the BlockDocumentMap', () => {
      // Update a document
      DocumentsStore.getState().update(document1.id, {
        blocks: [document1Blocks[0].id, 'new-block'],
      });

      // Should preserve removed blocks from the map
      expect(BlockDocumentMap.get(document1Blocks[1].id)).toBe(document1.id);
      // Should add new blocks to the map
      expect(BlockDocumentMap.get(document1Blocks[0].id)).toBe(document1.id);
      expect(BlockDocumentMap.get('new-block')).toBe(document1.id);
    });

    it('updates the DocumentViewDocumentMap', () => {
      // Update a document
      DocumentsStore.getState().update(document1.id, {
        views: [document1.views[0], 'new-view'],
      });

      // Should preserve removed views from the map
      expect(DocumentViewDocumentMap.get(document1.views[1])).toBe(
        document1.id,
      );
      // Should add new views to the map
      expect(DocumentViewDocumentMap.get(document1.views[0])).toBe(
        document1.id,
      );
      expect(DocumentViewDocumentMap.get('new-view')).toBe(document1.id);
    });

    it('updates the DocumentParentMap if the path has changed', () => {
      // Move grandChildDocument to a new parent
      DocumentsStore.getState().update(grandChildDocument.id, {
        path: Fs.concatPath(
          Fs.parentDirPath(wrappedDocument.path),
          Fs.fileNameFromPath(grandChildDocument.path),
        ),
      });

      // Should update the parent of the moved document
      expect(DocumentParentMap.get(grandChildDocument.id)).toBe(
        wrappedDocument.id,
      );
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      // Load documents into the store
      loadDocuments();
    });

    it('removes the document from the store', () => {
      // Remove a document
      DocumentsStore.getState().remove(document1.id);

      // document should no longer be in the store
      expect(DocumentsStore.getState().documents[document1.id]).toBeUndefined();
    });

    it('preserves block entries in BlockDocumentMap', () => {
      // Remove a document
      DocumentsStore.getState().remove(document1.id);

      // BlockDocumentMap should still contain entries for the
      // removed document's blocks.
      document1.blocks.forEach((blockId) => {
        expect(BlockDocumentMap.get(blockId)).toEqual(document1.id);
      });
    });

    it('preserves view entries in DocumentViewDocumentMap', () => {
      // Remove a document
      DocumentsStore.getState().remove(document1.id);

      // DocumentViewDocumentMap should still contain entries
      // for the removed document's views.
      document1.views.forEach((viewId) => {
        expect(DocumentViewDocumentMap.get(viewId)).toBe(document1.id);
      });
    });

    it('preserves subdocument entries in DocumentParentMap', () => {
      // Remove a subdocument
      DocumentsStore.getState().remove(wrappedChildDocument.id);

      // DocumentParentMap should still contain an entry
      // for the removed subdocument.
      expect(DocumentParentMap.get(wrappedChildDocument.id)).toBe(
        wrappedDocument.id,
      );
    });
  });
});
