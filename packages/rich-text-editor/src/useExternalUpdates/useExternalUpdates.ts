import {
  RichTextElements,
  RTElement,
  useRichTextDocument,
} from '@minddrop/rich-text';
import { useEffect } from 'react';
import { Transforms } from '../Transforms';
import { Editor } from '../types';
import { useRichTextEditorStore } from '../useRichTextEditorStore';

/**
 * Resets the editor children to the latest value when
 * the document's revision changes, unless the changes
 * originate from the current editor session.
 *
 * @param editor The editor instance.
 * @param sessionId The editor session ID.
 */
export function useExternalUpdates(editor: Editor, sessionId: string): void {
  // Get the document ID from the session
  const { documentId } = useRichTextEditorStore.getState().sessions[sessionId];

  // Watch the document for changes
  const document = useRichTextDocument(documentId);

  useEffect(() => {
    // Get the session's document revisions
    const { documentRevisions } =
      useRichTextEditorStore.getState().sessions[sessionId];

    // If the new document revision is not included in this editor
    // session's document revisions, it means that the document's
    // value has been changed externally.
    if (!documentRevisions.includes(document.revision)) {
      // Get the rich text elements making up the document's children
      const elements = RichTextElements.get(document.children);

      // Create the editor value by aranging the rich text elements
      // in the order they are listed in the document's children.
      const value = document.children.map(
        (childId) => elements[childId],
        /* RichTextElements.generateChildrenTree(elements[childId]), */
      ) as RTElement[];

      // Pause updates for this session to prevent the editor content
      // reset from triggering it's own updates.
      useRichTextEditorStore.getState().pauseUpdates(sessionId);

      // Reset the editor content to the new value
      Transforms.resetNodes(editor, { nodes: value });

      // Resume updates for this session
      useRichTextEditorStore.getState().resumeUpdates(sessionId);
    }
  }, [document.revision, sessionId]);
}
