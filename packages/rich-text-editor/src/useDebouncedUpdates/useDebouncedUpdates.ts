import { useDebounce } from 'use-debounce';
import { Core, useCore } from '@minddrop/core';
import { useRichTextEditorStore } from '../useRichTextEditorStore';
import { useEffect } from 'react';
import { RTDocuments, RTElements } from '@minddrop/rich-text';
import { generateId } from '@minddrop/utils';

/**
 * Generates a new document revision ID and adds it to the
 * editor session's `documentRevisions`. Returns the new
 * revision ID.
 *
 * @param sessionId The editor session ID.
 * @returns The new document revision ID.
 */
function createDocumentRevision(sessionId: string): string {
  // Generate a new revision ID
  const revision = generateId();

  // Add the revision to the session's document revisions
  useRichTextEditorStore.getState().addDocumentRevision(sessionId, revision);

  // Return the new revision ID
  return revision;
}

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

    // Tracks if the any elements have been modified/added/removed,
    // in which case the document's revision will be changed.
    let changeRevision = false;

    // Reset the session changes
    useRichTextEditorStore.getState().resetSessionChanges(sessionId);

    // Create the new elements in the order they were inserted
    creationOrder.forEach((id) => {
      RTElements.create(core, createdElements[id]);
      changeRevision = true;
    });

    // Update the modified elements
    Object.keys(updatedElements).forEach((id) => {
      RTElements.update(core, id, updatedElements[id]);
      changeRevision = true;
    });

    // Delete removed elements
    deletedElements.forEach((id) => {
      RTElements.delete(core, id);
      changeRevision = true;
    });

    // Set document children along with a new revision
    // ID if the value of `documentChildren` has changed.
    if (documentChildren.length) {
      // Create a document new revision
      const revision = createDocumentRevision(sessionId);

      // Set the children and new revision
      RTDocuments.setChildren(core, documentId, documentChildren, revision);

      // Prevent the revision from being chnaged below
      changeRevision = false;
    }

    // If the document or any element within it has been modifed,
    // update the document revision ID.
    if (changeRevision) {
      // Create a new document revision ID
      const revision = createDocumentRevision(sessionId);

      // Update the document revision
      RTDocuments.setRevision(core, documentId, revision);
    }
  }, [debouncedSessionRevision, sessionId]);
}
