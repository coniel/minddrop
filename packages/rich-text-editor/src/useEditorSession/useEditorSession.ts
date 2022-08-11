import { RTDocument, RichTextDocuments } from '@minddrop/rich-text';
import { generateId } from '@minddrop/utils';
import { useMemo } from 'react';
import { Editor } from '../types';
import { useRichTextEditorStore } from '../useRichTextEditorStore';
import { createEditor } from '../utils';
import { withRichTextEditorStore } from '../withRichTextEditorStore';

/**
 * Returns an editor instance configured with an editor
 * session which trackes changes made to the document's
 * contents in the rich text editor store.
 *
 * @param core A MindDrop core instance.
 * @param documentId The ID of the document being edited.
 * @returns An editor and the session ID instance.
 */
export function useEditorSession(documentId: string): [Editor, string] {
  // Set up the editor session
  const sessionId = useMemo(() => {
    // Generate a session ID
    const id = generateId();
    // Get the rich text document
    const document = RichTextDocuments.get(documentId) as RTDocument;

    // Create the session in the rich text editor store with the
    // current document revision.
    useRichTextEditorStore.getState().addSession(id, document.revision);

    // Return the session ID
    return id;
  }, [documentId]);

  // Create the editor instance
  const editor = useMemo(
    () => withRichTextEditorStore(createEditor(documentId), sessionId),
    [documentId, sessionId],
  );

  return [editor, sessionId];
}
