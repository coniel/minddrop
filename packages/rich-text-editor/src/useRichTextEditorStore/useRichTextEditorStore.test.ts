import {
  RICH_TEXT_TEST_DATA,
  UpdateRichTextElementData,
} from '@minddrop/rich-text';
import { useRichTextEditorStore } from './useRichTextEditorStore';

const { paragraphElement1, paragraphElement2 } = RICH_TEXT_TEST_DATA;

describe('useRichTextEditorStore', () => {
  afterEach(() => {
    // Clear the store data
    useRichTextEditorStore.getState().clear();
    // Clear the document revisions
    useRichTextEditorStore.getState().clearDocumentRevisions();
  });

  it('adds a revision', () => {
    // Add a revision
    useRichTextEditorStore.getState().addDocumentRevision('revision-id');

    // Adds the revision to `revisions`
    expect(useRichTextEditorStore.getState().documentRevisions).toContain(
      'revision-id',
    );
  });

  describe('addCreatedElement', () => {
    it('adds the element to `createdElements`', () => {
      // Add a created element
      useRichTextEditorStore.getState().addCreatedElement(paragraphElement1);

      // Element should be added to `createdElements`
      expect(
        useRichTextEditorStore.getState().createdElements[paragraphElement1.id],
      ).toEqual(paragraphElement1);
    });

    it('adds the created element ID to the end of `creationOrder`', () => {
      // Add a created element
      useRichTextEditorStore.getState().addCreatedElement(paragraphElement1);
      // Add a second created element
      useRichTextEditorStore.getState().addCreatedElement(paragraphElement2);

      // Adds the element ID to the end of `creationOrder`
      expect(useRichTextEditorStore.getState().creationOrder).toEqual([
        paragraphElement1.id,
        paragraphElement2.id,
      ]);
    });

    it('updates the store revision', () => {
      // Get the current revision ID
      const originalRevision = useRichTextEditorStore.getState().storeRevision;

      // Add a created element
      useRichTextEditorStore.getState().addCreatedElement(paragraphElement1);

      // Should chnage the `storeRevision`
      expect(useRichTextEditorStore.getState().storeRevision).not.toBe(
        originalRevision,
      );
    });
  });

  describe('removeCreatedElement', () => {
    it('removes the element from `createdElements`', () => {
      // Add a created element
      useRichTextEditorStore.getState().addCreatedElement(paragraphElement1);
      // Remove the created element
      useRichTextEditorStore
        .getState()
        .removeCreatedElement(paragraphElement1.id);

      // Element should no longer be in `createdElements`
      expect(
        useRichTextEditorStore.getState().createdElements[paragraphElement1.id],
      ).toBeUndefined();
    });

    it('removes the element ID from `creationOrder`', () => {
      // Add a created element
      useRichTextEditorStore.getState().addCreatedElement(paragraphElement1);
      // Remove the created element
      useRichTextEditorStore
        .getState()
        .removeCreatedElement(paragraphElement1.id);

      // Removes the element ID from `creationOrder`
      expect(useRichTextEditorStore.getState().creationOrder).not.toContain(
        paragraphElement1.id,
      );
    });

    it('updates the store revision', () => {
      // Add a created element
      useRichTextEditorStore.getState().addCreatedElement(paragraphElement1);

      // Get the current revision ID
      const originalRevision = useRichTextEditorStore.getState().storeRevision;

      // Remove the created element
      useRichTextEditorStore
        .getState()
        .removeCreatedElement(paragraphElement1.id);

      // Should chnage the `storeRevision`
      expect(useRichTextEditorStore.getState().storeRevision).not.toBe(
        originalRevision,
      );
    });
  });

  describe('addUpdatedElement', () => {
    it('adds the updated element data to `updatedElements`', () => {
      // The update data
      const data: UpdateRichTextElementData = {
        children: [{ text: 'Hello world' }],
      };

      // Add an updated element
      useRichTextEditorStore
        .getState()
        .addUpdatedElement(paragraphElement1.id, data);

      // Data should be added to `updatedElements`
      expect(
        useRichTextEditorStore.getState().updatedElements[paragraphElement1.id],
      ).toEqual(data);
    });

    it('updates the store revision', () => {
      // Get the current revision ID
      const originalRevision = useRichTextEditorStore.getState().storeRevision;

      // Add an updated element
      useRichTextEditorStore
        .getState()
        .addUpdatedElement(paragraphElement1.id, { children: [{ text: '' }] });

      // Should chnage the `storeRevision`
      expect(useRichTextEditorStore.getState().storeRevision).not.toBe(
        originalRevision,
      );
    });
  });

  describe('removeUpdatedElement', () => {
    it('removes the updated element data from `updatedElements`', () => {
      // Add an updated element
      useRichTextEditorStore
        .getState()
        .addUpdatedElement(paragraphElement1.id, { children: [{ text: '' }] });
      // Remove the updated element
      useRichTextEditorStore
        .getState()
        .removeUpdatedElement(paragraphElement1.id);

      // Element should no longer be in `updatedElements`
      expect(
        useRichTextEditorStore.getState().updatedElements[paragraphElement1.id],
      ).toBeUndefined();
    });

    it('updates the store revision', () => {
      // Add an updated element
      useRichTextEditorStore
        .getState()
        .addUpdatedElement(paragraphElement1.id, { children: [{ text: '' }] });

      // Get the current revision ID
      const originalRevision = useRichTextEditorStore.getState().storeRevision;

      // Remove the updated element
      useRichTextEditorStore
        .getState()
        .removeUpdatedElement(paragraphElement1.id);

      // Should chnage the `storeRevision`
      expect(useRichTextEditorStore.getState().storeRevision).not.toBe(
        originalRevision,
      );
    });
  });

  describe('addDeletedElement', () => {
    it('adds the deleted element ID to `deletedElements`', () => {
      // Add a deleted element
      useRichTextEditorStore.getState().addDeletedElement(paragraphElement1.id);

      // Element ID should be in `deletedElements`
      expect(useRichTextEditorStore.getState().deletedElements).toContain(
        paragraphElement1.id,
      );
    });

    it('updates the store revision', () => {
      // Get the current revision ID
      const originalRevision = useRichTextEditorStore.getState().storeRevision;

      // Add a deleted element
      useRichTextEditorStore.getState().addDeletedElement(paragraphElement1.id);

      // Should chnage the `storeRevision`
      expect(useRichTextEditorStore.getState().storeRevision).not.toBe(
        originalRevision,
      );
    });
  });

  describe('removeDeletedElement', () => {
    it('removes the element ID from `deletedElements`', () => {
      // Add a deleted element
      useRichTextEditorStore.getState().addDeletedElement(paragraphElement1.id);
      // Remove the deleted element
      useRichTextEditorStore
        .getState()
        .removeDeletedElement(paragraphElement1.id);

      // Element ID should no longer be in `deletedElements`
      expect(useRichTextEditorStore.getState().deletedElements).not.toContain(
        paragraphElement1.id,
      );
    });

    it('updates the store revision', () => {
      // Add a deleted element
      useRichTextEditorStore.getState().addDeletedElement(paragraphElement1.id);

      // Get the current revision ID
      const originalRevision = useRichTextEditorStore.getState().storeRevision;

      // Remove the deleted element
      useRichTextEditorStore
        .getState()
        .removeDeletedElement(paragraphElement1.id);

      // Should chnage the `storeRevision`
      expect(useRichTextEditorStore.getState().storeRevision).not.toBe(
        originalRevision,
      );
    });
  });

  describe('setDocumentChildren', () => {
    it('sets the child IDs to `documentChildren`', () => {
      // Set document children
      useRichTextEditorStore
        .getState()
        .setDocumentChildren([paragraphElement1.id, paragraphElement2.id]);

      // Children should be set to the new value
      expect(useRichTextEditorStore.getState().documentChildren).toEqual([
        paragraphElement1.id,
        paragraphElement2.id,
      ]);
    });

    it('updates the store revision', () => {
      // Get the current revision ID
      const originalRevision = useRichTextEditorStore.getState().storeRevision;

      // Set document children
      useRichTextEditorStore
        .getState()
        .setDocumentChildren([paragraphElement1.id, paragraphElement2.id]);

      // Should chnage the `storeRevision`
      expect(useRichTextEditorStore.getState().storeRevision).not.toBe(
        originalRevision,
      );
    });
  });

  it('clears revisions', () => {
    // Add a revision
    useRichTextEditorStore.getState().addDocumentRevision('revision-id');

    // Clear revisions
    useRichTextEditorStore.getState().clearDocumentRevisions();

    // Should clear revisions
    expect(useRichTextEditorStore.getState().documentRevisions).toEqual([]);
  });

  it('clears all store data except revisions', () => {
    // Set data in the store
    useRichTextEditorStore.getState().addDocumentRevision('revision-id');
    useRichTextEditorStore.getState().addCreatedElement(paragraphElement1);
    useRichTextEditorStore.getState().addUpdatedElement(paragraphElement1.id, {
      children: [{ text: 'Hello world' }],
    });
    useRichTextEditorStore.getState().addDeletedElement(paragraphElement1.id);
    useRichTextEditorStore
      .getState()
      .setDocumentChildren([paragraphElement1.id, paragraphElement2.id]);

    // Clear the store
    useRichTextEditorStore.getState().clear();

    // Get the store state
    const {
      createdElements,
      creationOrder,
      updatedElements,
      deletedElements,
      documentChildren,
      documentRevisions,
    } = useRichTextEditorStore.getState();

    // Should clear `createdElements`
    expect(createdElements).toEqual({});
    // Should clear `creationOrder`
    expect(creationOrder).toEqual([]);
    // Should clear `updatedElements`
    expect(updatedElements).toEqual({});
    // Should clear `deletedElements`
    expect(deletedElements).toEqual([]);
    // Should clear `documentChildren`
    expect(documentChildren).toEqual([]);
    // Should not clear revisions
    expect(documentRevisions).toEqual(['revision-id']);
  });
});
