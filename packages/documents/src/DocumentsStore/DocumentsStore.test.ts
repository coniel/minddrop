import { describe, afterEach, it, expect, beforeEach } from 'vitest';
import {
  document1,
  wrappedDocument,
  documents,
  document1Blocks,
} from '../test-utils';
import {
  BlockDocumentMap,
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

      // Should remove removed blocks from the map
      expect(BlockDocumentMap.get(document1Blocks[1].id)).toBeUndefined();
      // Should add new blocks to the map
      expect(BlockDocumentMap.get(document1Blocks[0].id)).toBe(document1.id);
      expect(BlockDocumentMap.get('new-block')).toBe(document1.id);
    });

    it('updates the DocumentViewDocumentMap', () => {
      // Update a document
      DocumentsStore.getState().update(document1.id, {
        views: [document1.views[0], 'new-view'],
      });

      // Should remove removed views from the map
      expect(DocumentViewDocumentMap.get(document1.views[1])).toBeUndefined();
      // Should add new views to the map
      expect(DocumentViewDocumentMap.get(document1.views[0])).toBe(
        document1.id,
      );
      expect(DocumentViewDocumentMap.get('new-view')).toBe(document1.id);
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

    it('updates the BlockDocumentMap', () => {
      // Remove a document
      DocumentsStore.getState().remove(document1.id);

      // BlockDocumentMap should no longer have entries
      // for the removed document.
      document1.blocks.forEach((blockId) => {
        expect(BlockDocumentMap.get(blockId)).toBeUndefined();
      });
    });

    it('updates the DocumentViewDocumentMap', () => {
      // Remove a document
      DocumentsStore.getState().remove(document1.id);

      // DocumentViewDocumentMap should no longer have entries
      // for the removed document.
      document1.views.forEach((viewId) => {
        expect(DocumentViewDocumentMap.get(viewId)).toBeUndefined();
      });
    });
  });
});
