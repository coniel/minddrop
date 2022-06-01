import { RTElements, useRTDocument } from '@minddrop/rich-text';
import { useEffect, useRef } from 'react';
import { Descendant } from 'slate';
import { Transforms } from '../Transforms';
import { Editor } from '../types';
import { useRichTextEditorStore } from '../useRichTextEditorStore';

/**
 * Resets the editor children to the latest value when
 * the document's revision changes, unless the changes
 * originate from the current editor session.
 *
 * @param editor The editor instance.
 * @param documentId The ID of the document being edited.
 * @param sessionId The editor session ID.
 */
export function useExternalUpdates(
  editor: Editor,
  documentId: string,
  sessionId: string,
): void {
  // Watch the document for changes
  const document = useRTDocument(documentId);

  useEffect(() => {
    // Get the session's document revisions
    const { documentRevisions } =
      useRichTextEditorStore.getState().sessions[sessionId];

    // If the new document revision is not included in this editor
    // session's document revisions, it means that the document's
    // value has been changed externally.
    if (!documentRevisions.includes(document.revision)) {
      // Get the rich text elements making up the document's children
      const elements = RTElements.get(document.children);

      // Create the editor value by aranging the rich text elements
      // in the order they are listed in the document's children.
      const value = document.children.map((childId) => elements[childId]);

      // Reset the editor content to the new value
      Transforms.resetNodes(editor, { nodes: value });

      // Reseting nodes removes the current nodes and inserts the updated ones,
      // this causes the changes to be added to the editor session in the rich
      // text editor store. Reset the editor session to clear the changes as
      // they aren't actually changes.
      useRichTextEditorStore.getState().resetSessionChanges(sessionId);
    }
  }, [document.revision, sessionId]);
}
