import {
  RICH_TEXT_TEST_DATA,
  UpdateRichTextElementData,
} from '@minddrop/rich-text';
import {
  EditorSession,
  useRichTextEditorStore,
} from './useRichTextEditorStore';

const { paragraphElement1, paragraphElement2 } = RICH_TEXT_TEST_DATA;

// The store's static methods
const {
  clear,
  addSession,
  removeSession,
  resetSessionChanges,
  addCreatedElement,
  removeCreatedElement,
  addUpdatedElement,
  removeUpdatedElement,
  addDeletedElement,
  removeDeletedElement,
  addDocumentRevision,
  setDocumentChildren,
} = useRichTextEditorStore.getState();

const sessionId = 'session-id';

function getSessionValue(key: keyof EditorSession) {
  return useRichTextEditorStore.getState().sessions[sessionId][key];
}

describe('useRichTextEditorStore', () => {
  beforeEach(() => {
    // Create a test editor session
    addSession('session-id');
  });

  afterEach(() => {
    // Clear all sessions
    clear();
  });

  describe('addSession', () => {
    it('adds a session to `sessions`', () => {
      // Add a session
      addSession('new-session-id');

      // Session should be in `sessions`
      expect(
        useRichTextEditorStore.getState().sessions['new-session-id'],
      ).toBeDefined();
      // Session should have a `sessionRevision`
      expect(
        useRichTextEditorStore.getState().sessions['new-session-id']
          .sessionRevision,
      ).toBeDefined();
    });

    it('initializes `documentRevisions` with the provided revision ID', () => {
      // Add a session
      addSession('new-session-id', 'doc-rev-id');

      // Session `documentRevisions` should contain the provided revision ID
      expect(
        useRichTextEditorStore.getState().sessions['new-session-id']
          .documentRevisions,
      ).toContain('doc-rev-id');
    });
  });

  describe('removeSession', () => {
    it('removes the session from `sessions`', () => {
      // Add a session
      addSession('new-session-id');
      // Remove the session
      removeSession('new-session-id');

      // Session should no longer be in `sessions`
      expect(
        useRichTextEditorStore.getState().sessions['new-session-id'],
      ).not.toBeDefined();
    });
  });

  describe('addDocumentRevision', () => {
    it('adds a document revision', () => {
      // Add a document revision
      addDocumentRevision(sessionId, 'revision-id');

      // Document revision ID should be in the session's `documentRevisions`
      expect(getSessionValue('documentRevisions')).toContain('revision-id');
    });

    it('does not change the session revision', () => {
      // Get the session revision
      const originalRevision = getSessionValue('sessionRevision');

      // Add a document revision
      addDocumentRevision(sessionId, 'revision-id');

      // Session revision should not have changed
      expect(getSessionValue('sessionRevision')).toBe(originalRevision);
    });
  });

  describe('addCreatedElement', () => {
    it('adds the element to `createdElements`', () => {
      // Add a created element
      addCreatedElement(sessionId, paragraphElement1);

      // Element should be added to `createdElements`
      expect(getSessionValue('createdElements')[paragraphElement1.id]).toEqual(
        paragraphElement1,
      );
    });

    it('adds the created element ID to the end of `creationOrder`', () => {
      // Add a created element
      addCreatedElement(sessionId, paragraphElement1);
      // Add a second created element
      addCreatedElement(sessionId, paragraphElement2);

      // Adds the element ID to the end of `creationOrder`
      expect(getSessionValue('creationOrder')).toEqual([
        paragraphElement1.id,
        paragraphElement2.id,
      ]);
    });

    it('changes the session revision', () => {
      // Get the current revision ID
      const originalRevision = getSessionValue('sessionRevision');

      // Add a created element
      addCreatedElement(sessionId, paragraphElement1);

      // Should change the `sessionRevision`
      expect(getSessionValue('sessionRevision')).not.toBe(originalRevision);
    });
  });

  describe('removeCreatedElement', () => {
    it('removes the element from `createdElements`', () => {
      // Add a created element
      addCreatedElement(sessionId, paragraphElement1);
      // Remove the created element
      removeCreatedElement(sessionId, paragraphElement1.id);

      // Element should no longer be in `createdElements`
      expect(
        getSessionValue('createdElements')[paragraphElement1.id],
      ).toBeUndefined();
    });

    it('removes the element ID from `creationOrder`', () => {
      // Add a created element
      addCreatedElement(sessionId, paragraphElement1);
      // Remove the created element
      removeCreatedElement(sessionId, paragraphElement1.id);

      // Removes the element ID from `creationOrder`
      expect(getSessionValue('creationOrder')).not.toContain(
        paragraphElement1.id,
      );
    });

    it('changes the session revision', () => {
      // Add a created element
      addCreatedElement(sessionId, paragraphElement1);

      // Get the current revision ID
      const originalRevision = getSessionValue('sessionRevision');

      // Remove the created element
      removeCreatedElement(sessionId, paragraphElement1.id);

      // Should change the `sessionRevision`
      expect(getSessionValue('sessionRevision')).not.toBe(originalRevision);
    });
  });

  describe('addUpdatedElement', () => {
    // The update data
    const data: UpdateRichTextElementData = {
      children: [{ text: 'Hello world' }],
    };

    it('adds the updated element data to `updatedElements`', () => {
      // Add an updated element
      addUpdatedElement(sessionId, paragraphElement1.id, data);

      // Data should be added to `updatedElements`
      expect(getSessionValue('updatedElements')[paragraphElement1.id]).toEqual(
        data,
      );
    });

    it('changes the session revision', () => {
      // Get the current revision ID
      const originalRevision = getSessionValue('sessionRevision');

      // Add an updated element
      addUpdatedElement(sessionId, paragraphElement1.id, data);

      // Should change the `sessionRevision`
      expect(getSessionValue('sessionRevision')).not.toBe(originalRevision);
    });
  });

  describe('removeUpdatedElement', () => {
    // The update data
    const data: UpdateRichTextElementData = {
      children: [{ text: 'Hello world' }],
    };

    it('removes the updated element data from `updatedElements`', () => {
      // Add an updated element
      addUpdatedElement(sessionId, paragraphElement1.id, data);
      // Remove the updated element
      removeUpdatedElement(sessionId, paragraphElement1.id);

      // Element should no longer be in `updatedElements`
      expect(
        getSessionValue('updatedElements')[paragraphElement1.id],
      ).toBeUndefined();
    });

    it('changes the session revision', () => {
      // Add an updated element
      addUpdatedElement(sessionId, paragraphElement1.id, data);

      // Get the current revision ID
      const originalRevision = getSessionValue('sessionRevision');

      // Remove the updated element
      removeUpdatedElement(sessionId, paragraphElement1.id);

      // Should change the `sessionRevision`
      expect(getSessionValue('sessionRevision')).not.toBe(originalRevision);
    });
  });

  describe('addDeletedElement', () => {
    it('adds the deleted element ID to `deletedElements`', () => {
      // Add a deleted element
      addDeletedElement(sessionId, paragraphElement1.id);

      // Element ID should be in `deletedElements`
      expect(getSessionValue('deletedElements')).toContain(
        paragraphElement1.id,
      );
    });

    it('changes the session revision', () => {
      // Get the current revision ID
      const originalRevision = getSessionValue('sessionRevision');

      // Add a deleted element
      addDeletedElement(sessionId, paragraphElement1.id);

      // Should change the `sessionRevision`
      expect(getSessionValue('sessionRevision')).not.toBe(originalRevision);
    });
  });

  describe('removeDeletedElement', () => {
    it('removes the element ID from `deletedElements`', () => {
      // Add a deleted element
      addDeletedElement(sessionId, paragraphElement1.id);
      // Remove the deleted element
      removeDeletedElement(sessionId, paragraphElement1.id);

      // Element ID should no longer be in `deletedElements`
      expect(getSessionValue('deletedElements')).not.toContain(
        paragraphElement1.id,
      );
    });

    it('changes the session revision', () => {
      // Add a deleted element
      addDeletedElement(sessionId, paragraphElement1.id);

      // Get the current revision ID
      const originalRevision = getSessionValue('sessionRevision');

      // Remove the deleted element
      removeDeletedElement(sessionId, paragraphElement1.id);

      // Should change the `sessionRevision`
      expect(getSessionValue('sessionRevision')).not.toBe(originalRevision);
    });
  });

  describe('setDocumentChildren', () => {
    it('sets the document children', () => {
      // Set document children
      setDocumentChildren(sessionId, [
        paragraphElement1.id,
        paragraphElement2.id,
      ]);

      // Children should be set to the new value
      expect(getSessionValue('documentChildren')).toEqual([
        paragraphElement1.id,
        paragraphElement2.id,
      ]);
    });

    it('changes the session revision', () => {
      // Get the current revision ID
      const originalRevision = getSessionValue('sessionRevision');

      // Set document children
      setDocumentChildren(sessionId, [
        paragraphElement1.id,
        paragraphElement2.id,
      ]);

      // Should change the `sessionRevision`
      expect(getSessionValue('sessionRevision')).not.toBe(originalRevision);
    });
  });

  describe('resetSessionChanges', () => {
    it('clears all session data apart from sessionRevision and documentRevisions', () => {
      // Add data to the session
      addCreatedElement(sessionId, paragraphElement1);
      addUpdatedElement(sessionId, paragraphElement1.id, {
        children: [{ text: '' }],
      });
      addDeletedElement(sessionId, paragraphElement1.id);
      setDocumentChildren(sessionId, [paragraphElement1.id]);
      addDocumentRevision(sessionId, 'rev-id');

      // Get the current session revision
      const originalSessionRevision = getSessionValue('sessionRevision');

      // Reset the session changes
      resetSessionChanges(sessionId);

      // Should reset `createdElements`
      expect(getSessionValue('createdElements')).toEqual({});
      // Should reset `creationOrder`
      expect(getSessionValue('creationOrder')).toEqual([]);
      // Should reset `updatedElements`
      expect(getSessionValue('updatedElements')).toEqual({});
      // Should reset `deletedElements`
      expect(getSessionValue('deletedElements')).toEqual([]);
      // Should reset `documentChildren`
      expect(getSessionValue('documentChildren')).toEqual([]);
      // Should not reset `documentRevisions`
      expect(getSessionValue('documentRevisions')).toEqual(['rev-id']);
      // Should not change `sessionRevision`
      expect(getSessionValue('sessionRevision')).toBe(originalSessionRevision);
    });
  });

  describe('clear', () => {
    it('removes all sessions', () => {
      // Clear sessions
      clear();

      // `sessions` should be empty
      expect(useRichTextEditorStore.getState().sessions).toEqual({});
    });
  });
});
