import { describe, afterEach, it, expect, beforeEach } from 'vitest';
import { document1, wrappedDocument, documents } from '../test-utils';
import { Document } from '../types';
import { DocumentsStore } from './DocumentsStore';

function loadDocuments() {
  DocumentsStore.getState().load(documents);
}

describe('DocumentsStore', () => {
  afterEach(() => {
    DocumentsStore.getState().clear();
  });

  describe('load', () => {
    it('loads documents into the store, preserving existing ones', () => {
      // Load a document into the store
      DocumentsStore.getState().load([document1]);
      // Load a second document into the store
      DocumentsStore.getState().load([wrappedDocument]);

      // Both documents should be in the store
      expect(DocumentsStore.getState().documents).toEqual([
        document1,
        wrappedDocument,
      ]);
    });
  });

  describe('add', () => {
    it('adds a document to the store', () => {
      // Load a document into the store
      DocumentsStore.getState().load([document1]);

      // Add a second document to the store
      DocumentsStore.getState().add(wrappedDocument);

      // Both documents should be in the store
      expect(DocumentsStore.getState().documents).toEqual([
        document1,
        wrappedDocument,
      ]);
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
      const document = DocumentsStore.getState().documents.find(
        ({ id }) => id === document1.id,
      ) as Document;

      // Document title should be updated
      expect(document).toEqual({ ...document1, title: 'New title' });
    });

    it('does nothing if the document does not exist', () => {
      const initialState = [...DocumentsStore.getState().documents];

      // Update a missing document
      DocumentsStore.getState().update('foo', {
        title: 'New title',
      });

      // Documents state should remain unchanged
      expect(DocumentsStore.getState().documents).toEqual(initialState);
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
      expect(
        DocumentsStore.getState().documents.find(
          (document) => document.id === document1.id,
        ),
      ).toBeUndefined();
    });
  });
});
