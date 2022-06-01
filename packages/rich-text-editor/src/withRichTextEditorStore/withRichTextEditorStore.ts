import { Editor } from '../types';
import { withRTElementsApi } from '../withRTElementsApi';
import { useRichTextEditorStore } from '../useRichTextEditorStore';

// Static store methods
const {
  addCreatedElement,
  removeCreatedElement,
  addUpdatedElement,
  removeUpdatedElement,
  addDeletedElement,
  removeDeletedElement,
  setDocumentChildren,
} = useRichTextEditorStore.getState();

/**
 * Returns an editor session by ID from the rich text
 * editor store.
 *
 * @param sessionId The ID of the session to retrieve.
 * @returns An editor session.
 */
function getSession(sessionId: string) {
  return useRichTextEditorStore.getState().sessions[sessionId];
}

const createApi = (sessionId: string) => ({
  setDocumentChildren: (children) => setDocumentChildren(sessionId, children),
  createElement: (element) => {
    // Add the created element to the session's created elements
    addCreatedElement(sessionId, element);

    // Get the session's deleted elements
    const { deletedElements } = getSession(sessionId);

    // If the element was previously deleted (e.g. due to a undo/redo
    // operation), remove it from deleted elements.
    if (deletedElements.includes(element.id)) {
      removeDeletedElement(sessionId, element.id);
    }
  },
  updateElement: (id, data) => {
    // Get the session's created elements
    const { createdElements } = getSession(sessionId);

    if (createdElements[id]) {
      // If the element appears in the session's `createdElements`,
      // update the created element data.
      addCreatedElement(sessionId, { ...createdElements[id], ...data });
    } else {
      // Get the session's updated elements
      const { updatedElements } = getSession(sessionId);
      // If the element was previously updated, get its previous udapte data
      const existingData = updatedElements[id] || {};

      // Add element update data to the session's updated elements, merging
      // into previous update data.
      addUpdatedElement(sessionId, id, { ...existingData, ...data });
    }
  },
  deleteElement: (id) => {
    // Get the session's created elements
    const { createdElements } = getSession(sessionId);

    if (createdElements[id]) {
      // Remove the element from `createdElements` if present
      removeCreatedElement(sessionId, id);
    } else {
      // Otherwise, add the element ID to the session's deleted elements
      addDeletedElement(sessionId, id);

      // Get the session's udpated elements
      const { updatedElements } = getSession(sessionId);

      if (updatedElements[id]) {
        // If the element appears in `updatedElements`, cancel the update by
        // removing the update data from the session.
        removeUpdatedElement(sessionId, id);
      }
    }
  },
});

/**
 * Synchronizes rich text element create, update, and delete,
 * events, as well as document children changes with the rich
 * text editor store.
 *
 * @param editor An editor instance.
 * @param sessionId The ID of the rich text editor session.
 * @returns The editor instance with the plugin behaviour.
 */
export function withRichTextEditorStore(
  editor: Editor,
  sessionId: string,
): Editor {
  // Add the rich text elements API plugin to the
  // editor with the configured API.
  return withRTElementsApi(editor, createApi(sessionId));
}
