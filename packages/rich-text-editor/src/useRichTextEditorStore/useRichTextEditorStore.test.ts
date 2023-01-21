import {
  EditorSession,
  useRichTextEditorStore,
} from './useRichTextEditorStore';

// The store's static methods
const { clear, addSession, removeSession, addDocumentRevision } =
  useRichTextEditorStore.getState();

const sessionId = 'session-id';

function getSessionValue(key: keyof EditorSession) {
  return useRichTextEditorStore.getState().sessions[sessionId][key];
}

describe('useRichTextEditorStore', () => {
  beforeEach(() => {
    // Create a test editor session
    addSession('session-id', 'document-id');
  });

  afterEach(() => {
    // Clear all sessions
    clear();
  });

  describe('addSession', () => {
    it('adds a session to `sessions`', () => {
      // Add a session
      addSession('new-session-id', 'document-id');

      // Session should be in `sessions`
      expect(
        useRichTextEditorStore.getState().sessions['new-session-id'],
      ).toEqual({
        documentId: 'document-id',
        documentRevisions: [],
        pauseUpdates: false,
      });
    });

    it('initializes `documentRevisions` with the provided revision ID', () => {
      // Add a session
      addSession('new-session-id', 'document-id', 'doc-rev-id');

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
      addSession('new-session-id', 'document-id');
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
  });

  describe('pauseUpdates', () => {
    it('sets `pauseUpdates` to `true` on a session', () => {
      // Pause a session
      useRichTextEditorStore.getState().pauseUpdates('session-id');

      // `pauseUpdates` should be `true`
      expect(getSessionValue('pauseUpdates')).toBe(true);
    });
  });

  describe('pauseUpdates', () => {
    it('sets `pauseUpdates` to `true` on a session', () => {
      // Pause a session
      useRichTextEditorStore.getState().pauseUpdates('session-id');

      // Resume the session
      useRichTextEditorStore.getState().resumeUpdates('session-id');

      // `pauseUpdates` should be `false`
      expect(getSessionValue('pauseUpdates')).toBe(false);
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
