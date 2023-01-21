import createStore, { SetState } from 'zustand';

export interface EditorSession {
  /**
   * The ID of the RichTextDocument being edited.
   */
  documentId: string;

  /**
   * The document revisions created during this editing session.
   */
  documentRevisions: string[];

  /**
   * When true, changes made in the editor will not trigger resource
   * document updates. Used to prevent an infinite update loop when
   * reseting editor content.
   */
  pauseUpdates: boolean;
}

export interface RichTextEditorStore {
  /**
   * An `{ [id]: EditorSession }` map of editor sessions.
   * For every rendered rich text editor, a session with
   * a unique ID is created. When changes are made to
   * elements or the document, the changes are recorded
   * in the editor's sessions object.
   */
  sessions: Record<string, EditorSession>;

  /**
   * Adds a new editor session the store. Initializes `documentRevisions`
   * with the current document revision ID if provided.
   *
   * @param sessionId The ID of the session.
   * @param documentRevision The current document revision ID.
   */
  addSession(
    sessionId: string,
    documentId: string,
    documentRevision?: string,
  ): void;

  /**
   * Removes an editor session from the store.
   *
   * @param sessionId The ID of the session to remove.
   */
  removeSession(sessionId: string): void;

  /**
   * Adds a new document revision ID to the editor session.
   *
   * @param sessionId The editor session ID.
   * @param revision The revision ID.
   */
  addDocumentRevision(sessionId: string, revision: string): void;

  /**
   * Sets `pauseUpdates` to `true` on an editor session.
   */
  pauseUpdates(sessionId: string): void;

  /**
   * Sets `pauseUpdates` to `false` on an editor session.
   */
  resumeUpdates(sessionId: string): void;

  /**
   * Clears all sessions.
   */
  clear(): void;
}

/**
 * Returns a state update which updates the data
 * on a specific session.
 *
 * @param set The store's set state function.
 * @param sessionId The ID of the session for which to set the data.
 * @param setter The callback which returns the data to be set.
 * @returns The updated session data.
 */
const setSessionData = (
  set: SetState<RichTextEditorStore>,
  sessionId: string,
  setter: (session: EditorSession) => Partial<EditorSession>,
) =>
  set((state) => ({
    sessions: {
      ...state.sessions,
      [sessionId]: {
        ...state.sessions[sessionId],
        // Set the data
        ...setter(state.sessions[sessionId]),
      },
    },
  }));

export const useRichTextEditorStore = createStore<RichTextEditorStore>(
  (set) => ({
    sessions: {},

    addSession: (sessionId, documentId, documentRevision) =>
      set((state) => ({
        sessions: {
          ...state.sessions,
          // Add a new session with the given ID
          [sessionId]: {
            documentId,
            documentRevisions: documentRevision ? [documentRevision] : [],
            pauseUpdates: false,
          },
        },
      })),

    removeSession: (sessionId) =>
      set((state) => {
        // Clone the sessions
        const sessions = { ...state.sessions };

        // Remove the session
        delete sessions[sessionId];

        return {
          // Set `sessions` to the updated value
          sessions,
        };
      }),

    addDocumentRevision: (sessionId, revision) =>
      setSessionData(set, sessionId, (session) => ({
        // Add the revision to `documentResisions`
        documentRevisions: [...session.documentRevisions, revision],
      })),

    pauseUpdates: (sessionId) =>
      set((state) => ({
        sessions: {
          ...state.sessions,
          [sessionId]: {
            ...state.sessions[sessionId],
            pauseUpdates: true,
          },
        },
      })),

    resumeUpdates: (sessionId) =>
      set((state) => ({
        sessions: {
          ...state.sessions,
          [sessionId]: {
            ...state.sessions[sessionId],
            pauseUpdates: false,
          },
        },
      })),

    clear: () =>
      set({
        // Clear all sessions
        sessions: {},
      }),
  }),
);
