import { Editor } from '../types';
import { withRichTextElementsApi } from '../withRichTextElementsApi';
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

const api = {
  setDocumentChildren,
  createElement: (element) => {
    // Add the created element to the store
    addCreatedElement(element);

    // If the element was previously deleted (e.g. due to a undo/redo
    // operation), remove it from deleted elements.
    if (
      useRichTextEditorStore.getState().deletedElements.includes(element.id)
    ) {
      removeDeletedElement(element.id);
    }
  },
  updateElement: (id, data) => {
    // Get the element from `createdElements` (only there if it was
    // recenty created).
    const existingElement =
      useRichTextEditorStore.getState().createdElements[id];

    if (existingElement) {
      // If the element appears in the store's `createdElements`,
      // update the created element data.
      addCreatedElement({ ...existingElement, ...data });
    } else {
      // Get existing update data for this element if there is any
      const existingData =
        useRichTextEditorStore.getState().updatedElements[id] || {};

      // Add element update data to the store, merging into previous update data
      addUpdatedElement(id, { ...existingData, ...data });
    }
  },
  deleteElement: (id) => {
    if (useRichTextEditorStore.getState().createdElements[id]) {
      // Remove the element from `createdElements` if present
      removeCreatedElement(id);
    } else {
      // Otherwise, add the element ID to the store
      addDeletedElement(id);

      if (useRichTextEditorStore.getState().updatedElements[id]) {
        // If the element was recently updated, cancel the update by removing
        // the update data from the store.
        removeUpdatedElement(id);
      }
    }
  },
};

/**
 * Synchronizes rich text element create, update, and delete,
 * events, as well as document children changes with the rich
 * text editor store.
 *
 * @param editor An editor instance.
 * @returns The editor instance with the plugin behaviour.
 */
export function withRichTextEditorStore(editor: Editor): Editor {
  // Add the rich text elements API plugin to the
  // editor with the configured API.
  return withRichTextElementsApi(editor, api);
}
