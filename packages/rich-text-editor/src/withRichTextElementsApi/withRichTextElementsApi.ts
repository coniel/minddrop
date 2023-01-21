import { Core } from '@minddrop/core';
import { generateId } from '@minddrop/utils';
import { Editor } from '../types';
import { withOperations } from '../withOperations';
import { useRichTextEditorStore } from '../useRichTextEditorStore';
import {
  RichTextDocuments,
  RichTextElements,
  RTElement,
  UpdateRTElementData,
} from '@minddrop/rich-text';

/**
 * Generates a new document revision ID and adds it to the
 * editor session's `documentRevisions`.
 *
 * @param sessionId - The editor session ID.
 */
function updateDocumentRevision(
  core: Core,
  sessionId: string,
  skipUpdate?: boolean,
) {
  // Get the editor session
  const session = useRichTextEditorStore.getState().sessions[sessionId];
  // Generate a new revision ID
  const revision = generateId();

  // Add the revision to the session's document revisions
  useRichTextEditorStore.getState().addDocumentRevision(sessionId, revision);

  if (!skipUpdate) {
    // Update the document
    RichTextDocuments.update(core, session.documentId, { revision });
  }

  return revision;
}

function updatesPaused(sessionId: string) {
  // Get the `pauseUpdates` state from the editor session
  const { pauseUpdates } =
    useRichTextEditorStore.getState().sessions[sessionId];

  return pauseUpdates;
}

const createApi = (core: Core, sessionId: string) => ({
  setDocumentChildren: (children: string[]) => {
    if (updatesPaused(sessionId)) {
      // If updates are paused for the editor session,
      // do nothing.
      return;
    }

    // Get the editor session
    const session = useRichTextEditorStore.getState().sessions[sessionId];

    // Create a new document revision without updating
    // the document.
    const revision = updateDocumentRevision(core, sessionId, true);

    // Update the document's children and revision
    RichTextDocuments.update(core, session.documentId, { children, revision });
  },
  createElement: (element: RTElement) => {
    if (updatesPaused(sessionId)) {
      // If updates are paused for the editor session,
      // do nothing.
      return;
    }

    // Check if the element exists in the RichTextElements store
    const existingElement = RichTextElements.store.get(element.id);

    if (existingElement && existingElement.deleted) {
      // If the element exists and is deleted, restore it
      RichTextElements.restore(core, element.id);
    } else {
      // Create the element
      RichTextElements.create(core, element.type, element);
    }
  },
  updateElement: (id: string, data: UpdateRTElementData) => {
    if (updatesPaused(sessionId)) {
      // If updates are paused for the editor session,
      // do nothing.
      return;
    }

    if ('type' in data) {
      // Ignore updates invloving the `type` field as the
      // update is handled as part of the element conversion.
      return;
    }

    // Update the element
    RichTextElements.update(core, id, data);

    // Update the document revision
    updateDocumentRevision(core, sessionId);
  },
  deleteElement: (id: string) => {
    if (updatesPaused(sessionId)) {
      // If updates are paused for the editor session,
      // do nothing.
      return;
    }

    // Delete the element
    RichTextElements.delete(core, id);
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
export function withRichTextElementsApi(
  core: Core,
  editor: Editor,
  sessionId: string,
): Editor {
  // Add the rich text elements API plugin to the
  // editor with the configured API.
  return withOperations(editor, createApi(core, sessionId));
}
