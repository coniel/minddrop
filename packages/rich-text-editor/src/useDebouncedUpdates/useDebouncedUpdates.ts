import { useDebounce } from 'use-debounce';
import { Core, useCore } from '@minddrop/core';
import { useRichTextEditorStore } from '../useRichTextEditorStore';
import { useEffect } from 'react';
import { RichTextDocuments, RichTextElements } from '@minddrop/rich-text';

/**
 * Updates the rich text document and the document's rich text elements
 * as they are modified in a debounced manner.
 *
 * @param documentId The ID of the document being edited.
 * @param sessionId The editor session ID.
 */
export function useDebouncedUpdates(
  documentId: string,
  sessionId: string,
): void {
  // Create a MindDrop core instance
  const core = useCore('rich-text-editor');
  // Get the session's revision ID from the rich text store
  const sessionRevision = useRichTextEditorStore(
    (state) => state.sessions[sessionId].sessionRevision,
  );
  // Debounce the session revision ID
  const [debouncedSessionRevision] = useDebounce(sessionRevision, 1500, {
    maxWait: 5000,
  });

  // Update the rich text document and elements when the
  // debounced session revision value changes.
  useEffect(() => {
    const {
      createdElements,
      creationOrder,
      updatedElements,
      deletedElements,
      documentChildren,
    } = useRichTextEditorStore.getState().sessions[sessionId];

    // Reset the session changes
    useRichTextEditorStore.getState().resetSessionChanges(sessionId);

    // Create the new elements in the order they were inserted
    creationOrder.forEach((id) => {
      RichTextElements.create(core, createdElements[id]);
    });

    // Update the modified elements
    Object.keys(updatedElements).forEach((id) => {
      RichTextElements.update(core, id, updatedElements[id]);
    });

    // Delete removed elements
    deletedElements.forEach((id) => {
      RichTextElements.delete(core, id);
    });

    if (documentChildren.length) {
      // Set document children if the value has changed
      RichTextDocuments.setChildren(core, documentId, documentChildren);
    }
  }, [debouncedSessionRevision, sessionId]);
}
