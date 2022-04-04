import {
  RichTextElement,
  RichTextElementMap,
  UpdateRichTextElementData,
} from '@minddrop/rich-text';
import { generateId } from '@minddrop/utils';
import createStore, { SetState } from 'zustand';

export interface EditorSession {
  /**
   * A UUID changed every time the editor session data (except
   * `documentRevisions`) is modified. Allows the store to be
   * watched for changes without needing to do deep comparisons
   * of the data.
   */
  sessionRevision: string;

  /**
   * The document revisions created during this editing session.
   */
  documentRevisions: string[];

  /**
   * An `{ [id]: RichTextElement }` map of created rich
   * text elements.
   */
  createdElements: RichTextElementMap;

  /**
   * The IDs of created elements in the order in which
   * they were created.
   */
  creationOrder: string[];

  /**
   * An `{ [id]: UpdateRichTextElementData }` map of updates
   * to rich text elements.
   */
  updatedElements: Record<string, UpdateRichTextElementData>;

  /**
   * An array of deleted rich text element IDs.
   */
  deletedElements: string[];

  /**
   * The document's children. Empty if no changes have occured.
   */
  documentChildren: string[];
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
  addSession(sessionId: string, documentRevision?: string): void;

  /**
   * Removes an editor session from the store.
   *
   * @param sessionId The ID of the session to remove.
   */
  removeSession(sessionId: string): void;

  /**
   * Clears all of an editor session's data apart from the document
   * revision IDs.
   *
   * @param sessionId The ID of the session for which to clear the data.
   */
  resetSessionChanges(sessionId: string): void;

  /**
   * Adds a new document revision ID to the editor session.
   *
   * @param sessionId The editor session ID.
   * @param revision The revision ID.
   */
  addDocumentRevision(sessionId: string, revision: string): void;

  /**
   * Adds a created element to the editor session.
   *
   * @param sessionId The editor session ID.
   * @param element The created element.
   */
  addCreatedElement(sessionId: string, element: RichTextElement): void;

  /**
   * Removes a created element from the editor session.
   *
   * @param sessionId The editor session ID.
   * @param id The ID of the element to remove.
   */
  removeCreatedElement(sessionId: string, id: string): void;

  /**
   * Adds the update data of an updated element to the editor session.
   *
   * @param sessionId The editor session ID.
   * @param id The ID of the updated element.
   * @param data The update data.
   */
  addUpdatedElement(
    sessionId: string,
    id: string,
    data: UpdateRichTextElementData,
  ): void;

  /**
   * Removes the update data of an updated element from the editor session.
   *
   * @param sessionId The editor session ID.
   * @param id The ID of the element to remove.
   */
  removeUpdatedElement(sessionId: string, id: string): void;

  /**
   * Adds the ID of a deleted element to the editor session.
   *
   * @param sessionId The editor session ID.
   * @param id The ID of the deleted element.
   */
  addDeletedElement(sessionId: string, id: string): void;

  /**
   * Removes the ID of a deleted element from the editor session.
   *
   * @param sessionId The editor session ID.
   * @param id The ID of the element to remove.
   */
  removeDeletedElement(sessionId: string, id: string): void;

  /**
   * Sets the document children in the editor session.
   *
   * @param sessionId The editor session ID.
   * @param children The document's children.
   */
  setDocumentChildren(sessionId: string, children: string[]): void;

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
  changeRevision = true,
) =>
  set((state) => ({
    sessions: {
      ...state.sessions,
      [sessionId]: {
        ...state.sessions[sessionId],
        // Set a new session revision unless specified not to
        sessionRevision: changeRevision
          ? generateId()
          : state.sessions[sessionId].sessionRevision,
        // Set the data
        ...setter(state.sessions[sessionId]),
      },
    },
  }));

export const useRichTextEditorStore = createStore<RichTextEditorStore>(
  (set) => ({
    sessions: {},

    addSession: (sessionId, documentRevision) =>
      set((state) => ({
        sessions: {
          ...state.sessions,
          // Add a new session with the given ID
          [sessionId]: {
            sessionRevision: generateId(),
            createdElements: {},
            creationOrder: [],
            updatedElements: {},
            deletedElements: [],
            documentChildren: [],
            documentRevisions: documentRevision ? [documentRevision] : [],
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

    resetSessionChanges: (sessionId) =>
      setSessionData(
        set,
        sessionId,
        () => ({
          // Reset all change fields
          createdElements: {},
          creationOrder: [],
          updatedElements: {},
          deletedElements: [],
          documentChildren: [],
        }),
        // Don't change the session revision
        false,
      ),

    addCreatedElement: (sessionId, element) =>
      setSessionData(set, sessionId, (session) => ({
        // Add the element to `createdElements`
        createdElements: {
          ...session.createdElements,
          [element.id]: element,
        },
        // Add the element ID to `creationOrder`
        creationOrder: [...session.creationOrder, element.id],
      })),

    removeCreatedElement: (sessionId, elementId) =>
      setSessionData(set, sessionId, (session) => {
        // Clone created elements
        const createdElements = { ...session.createdElements };

        // Remove the element
        delete createdElements[elementId];

        return {
          // Set `createdElements` to the updated value
          createdElements,
          // Remove the element ID from `creationOrder`
          creationOrder: session.creationOrder.filter((id) => elementId !== id),
        };
      }),

    addUpdatedElement: (sessionId, elementId, data) =>
      setSessionData(set, sessionId, (session) => ({
        // Add the updated element data to `updatedElements`
        updatedElements: { ...session.updatedElements, [elementId]: data },
      })),

    removeUpdatedElement: (sessionId, elementId) =>
      setSessionData(set, sessionId, (session) => {
        // Clone updated elements
        const updatedElements = { ...session.updatedElements };

        // Remove the element update data
        delete updatedElements[elementId];

        return {
          // Set `updatedElements` to the updated value
          updatedElements,
        };
      }),

    addDeletedElement: (sessionId, elementId) =>
      setSessionData(set, sessionId, (session) => ({
        // Add the element ID to `deletedElements`
        deletedElements: [...session.deletedElements, elementId],
      })),

    removeDeletedElement: (sessionId, elementId) =>
      setSessionData(set, sessionId, (session) => ({
        // Remove the element ID from `deletedElements`
        deletedElements: session.deletedElements.filter(
          (id) => elementId !== id,
        ),
      })),

    addDocumentRevision: (sessionId, revision) =>
      setSessionData(
        set,
        sessionId,
        (session) => ({
          // Add the revision to `documentResisions`
          documentRevisions: [...session.documentRevisions, revision],
        }),
        // Don't change the session revision
        false,
      ),

    setDocumentChildren: (sessionId, children) =>
      setSessionData(set, sessionId, () => ({
        // Set `documentChildren` to the new value
        documentChildren: children,
      })),

    clear: () =>
      set({
        // Clear all sessions
        sessions: {},
      }),
  }),
);
