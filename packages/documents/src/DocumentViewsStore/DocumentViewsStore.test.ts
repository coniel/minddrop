import { describe, afterEach, it, expect, beforeEach } from 'vitest';
import { document1View1, document1View2, documentViews } from '../test-utils';
import { DocumentView } from '../types';
import { DocumentViewsStore } from './DocumentViewsStore';

function loadDocumentViews() {
  DocumentViewsStore.getState().load(documentViews);
}

describe('DocumentViewsStore', () => {
  afterEach(() => {
    DocumentViewsStore.getState().clear();
  });

  describe('load', () => {
    it('loads documents into the store, preserving existing ones', () => {
      // Load a view into the store
      DocumentViewsStore.getState().load([document1View1]);
      // Load a second view into the store
      DocumentViewsStore.getState().load([document1View2]);

      // Both documents should be in the store
      expect(DocumentViewsStore.getState().documents).toEqual([
        document1View1,
        document1View2,
      ]);
    });
  });

  describe('add', () => {
    it('adds a view to the store', () => {
      // Load a view into the store
      DocumentViewsStore.getState().load([document1View1]);

      // Add a second view to the store
      DocumentViewsStore.getState().add(document1View2);

      // Both documents should be in the store
      expect(DocumentViewsStore.getState().documents).toEqual([
        document1View1,
        document1View2,
      ]);
    });
  });

  describe('update', () => {
    beforeEach(() => {
      // Load documents into the store
      loadDocumentViews();
    });

    it('updates the specified view in the store', () => {
      // Update a document
      DocumentViewsStore.getState().update(document1View1.id, {
        blocks: ['new-block'],
      });

      // Get the view from the store
      const view = DocumentViewsStore.getState().documents.find(
        ({ id }) => id === document1View1.id,
      ) as DocumentView;

      // DocumentView title should be updated
      expect(view).toEqual({ ...document1View1, blocks: ['new-block'] });
    });

    it('does nothing if the view does not exist', () => {
      const initialState = [...DocumentViewsStore.getState().documents];

      // Update a missing document
      DocumentViewsStore.getState().update('foo', {
        blocks: ['new-block'],
      });

      // DocumentViews state should remain unchanged
      expect(DocumentViewsStore.getState().documents).toEqual(initialState);
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      // Load documents into the store
      loadDocumentViews();
    });

    it('removes the view from the store', () => {
      // Remove a document
      DocumentViewsStore.getState().remove(document1View1.id);

      // view should no longer be in the store
      expect(
        DocumentViewsStore.getState().documents.find(
          (view) => view.id === document1View1.id,
        ),
      ).toBeUndefined();
    });
  });
});
